# aditya-sen.com

My personal portfolio site. The landing page is a real-time 3D scene rendered in the browser: an endless, procedurally generated Golden Gate Bridge with the camera flying along the deck. The sky, sun, moon, fog and lighting follow the **actual current time in San Francisco**.

Behind the landing page (`/aditya`) are the usual portfolio pages: about, career, projects and contact.

---

## Stack

| Layer | Tech | Used for |
| --- | --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack in dev) | Routing, layouts, fonts, build |
| UI | [React 19](https://react.dev/) + TypeScript | Components and page state |
| 3D | [three.js](https://threejs.org/) r186 | WebGL renderer, instanced meshes, custom GLSL shaders |
| Astronomy | [suncalc](https://github.com/mourner/suncalc) | Sun and moon position for San Francisco at a given time |
| Styling | Bootstrap 5, Bootstrap Icons, [augmented-ui](https://augmented-ui.com/), CSS Modules | Layout, icons, clipped-corner "cyber" panels |
| Fonts | `next/font` (Google *Play* plus a local signature font) | Typography |
| Tooling | ESLint (`eslint-config-next`), TypeScript | Linting and type checking |

No 3D model files are loaded. Every piece of the bridge is built from unit boxes and cylinders in code.

---

## Landing page: the 3D renderer

All of the rendering code is in [`src/components/Procedural3D/`](src/components/Procedural3D). The landing page ([`src/app/page.tsx`](src/app/page.tsx)) mounts it behind the hero panel and shows a loading screen until the first frame has been drawn.

### Layout

```
Procedural3D/
├── Procedural3D.tsx        React wrapper: lazy-loads the engine, handles mount/unmount
├── config.ts               Every tunable number: bridge dimensions, camera, fog, chunking
├── types.ts                Shared types (parts, placements, load progress)
├── utils.ts                lerp / smoothstep / seeded RNG (mulberry32)
├── engine/
│   ├── Engine.ts           Owns renderer, scene, camera, frame loop and all subsystems
│   └── LoadingTracker.ts   Turns weighted init stages into a single 0–1 progress value
├── camera/Camera.ts        Constant-speed fly-through along −Z
├── world/
│   ├── ChunkManager.ts     Endless streaming: decides which chunks are live
│   ├── InstancePool.ts     Fixed-size InstancedMesh pool that chunks borrow blocks from
│   └── Ocean.ts            Custom-shader water plane that follows the camera
├── bridge/
│   ├── assets.ts           Shared unit geometry and materials
│   ├── BridgeChunk.ts      Generates one tower-to-tower span
│   └── parts/              tower, deck, cables, suspenders, helpers
├── sky/
│   ├── SkyController.ts    Sky dome, sun/moon lights, stars, env map, lamps
│   └── sunPosition.ts      suncalc → world-space direction, time-of-day presets
└── fog/Fog.ts              Custom height fog injected into every material
```

### Frame loop

`Engine` is the root of the scene. Each frame it runs `step(dt)` and renders:

1. **Camera**: moves forward at `CAMERA.speed` (40 m/s) at the height of the deck.
2. **Floating origin**: re-bases the world when the camera gets too far from the origin.
3. **Chunks**: releases chunks that fell behind and builds at most one new one ahead.
4. **Sky**: recomputes sun and moon every 60 s. It follows the camera every frame.
5. **Ocean and fog**: update time and colour uniforms.

`dt` is clamped to 0.1 s so the scene doesn't jump forward after a stall, and `THREE.Timer` is connected to `document` so the clock pauses while the tab is hidden.

### Procedural bridge and endless streaming

The bridge is divided into **chunks**. Each chunk is one 1280 m main span (tower → deck/cables/suspenders → next tower), built at approximately real dimensions (`BRIDGE` in `config.ts`). The main cables follow the parabola `y(t) = towerHeight − 4·sag·t·(1 − t)`. The towers taper in stepped sections and are joined by portal cross-beams. The deck includes the road, sidewalks, stiffening trusses with alternating diagonals, floor beams, railings with an emissive light strip, and sodium-vapour street lamps.

Each chunk's RNG is seeded from its index (`mulberry32`), so a chunk looks the same every time it is rebuilt. The RNG only changes lamp tints, never instance counts, so every chunk has exactly the same number of instances.

**`ChunkManager`** keeps a window of `loadAhead = 2` chunks ahead of the camera and `keepBehind = 1` behind it. It builds at most one chunk per frame so streaming never causes a hitch. At startup, `prewarm()` builds the whole initial window and yields a frame between chunks so the loading bar can move.

**`InstancePool`** is what keeps it cheap:

- There is one `InstancedMesh` per part type (`steelBox`, `concreteBox`, `cable`, `lamp`, `lampPool`). The whole bridge draws in **five draw calls**.
- The meshes are allocated once at a fixed size (`instances per chunk × maxChunks`). A chunk borrows a *block* (a free-list stack), writes its matrices into it, and hides the slots when it releases the block. No geometry is created or destroyed after load.
- Only the changed slice of the instance buffer is uploaded (`addUpdateRange`) instead of the whole buffer.
- Instance colours are created up front so the shader variant that uses them compiles during loading, not the first time a lamp appears.

### Floating origin

Flying forever along −Z would eventually cause float32 precision jitter. Once the camera passes 5000 m, the engine shifts the whole world back by a whole number of chunks. It does this by adding to element 14 (Z translation) of every instance matrix, then re-placing the camera. Shaders that need absolute world positions (ocean waves, fog noise) receive a `uFogOrigin` offset so their patterns don't jump when the world shifts.

### Sky and real-time lighting

`SkyController` drives everything from a `Date`:

- **Sun and moon** positions for the Golden Gate Bridge are computed with `suncalc` and converted from azimuth/altitude to world directions (+X east, +Y up, −Z north).
- From the sun altitude it derives a **day factor** (night → day through civil twilight) and a **golden factor** (sun near the horizon). These blend the fog/horizon colour, zenith colour, sun colour and intensity, moonlight, and hemisphere light.
- The sky is three.js's physical `Sky` shader (turbidity, Rayleigh, Mie, animated clouds). It is patched in `onBeforeCompile` so its horizon fades into the fog colour.
- **Environment map**: the sky is rendered through `PMREMGenerator` (with the sun disc hidden) so the orange steel picks up sky-coloured reflections. This is expensive, so it only runs when the sky updates.
- **Night**: stars (1500 points) fade in, street lamps go over-bright (HDR) and the additive light pools on the road turn on. The steel gets a faint orange emissive glow to fake the real bridge's floodlights.
- Lights are dimmed, never added or removed, because changing the light count would recompile every material.

### Fog

San Francisco needs fog. [`fog/Fog.ts`](src/components/Procedural3D/fog/Fog.ts) replaces three.js's built-in fog chunks in every material via `onBeforeCompile`. The fog amount is the sum of two optical depths along the camera→fragment ray:

1. **Haze**: uniform `FogExp2`-style haze everywhere.
2. **Marine layer**: density that falls off exponentially with height. It is integrated analytically along the ray (Inigo Quilez's "better fog") and modulated by two octaves of drifting 3D value noise so the fog bank moves.

On top of that:

- **Sun glow**: fog looking toward a low sun is tinted warm, and the sky horizon uses the same function so they match.
- **Edge fade**: past `FOG.fadeStart`, everything is forced into the fog so streamed chunks never visibly pop in.
- **Additive variant**: the lamp light pools fade toward black instead of blending toward the fog colour.

All materials share the fog uniforms by reference, so one update per frame drives every shader.

### Ocean

A single 9 km plane that follows the camera, using a custom `ShaderMaterial`:

- Normals come from the analytic slopes of **five directional sine waves** at different frequencies and speeds. The normals flatten with distance to avoid aliasing.
- Colour is a **Schlick Fresnel** blend between deep-water colour and a reflected sky gradient, plus a tight specular sun highlight.
- Sky colours and sun direction come from `SkyState`, so the water always matches the time of day. The shader also uses the shared fog.

This is much cheaper than three.js's `Water` addon, which renders a reflection pass.

### Loading and startup

- `Procedural3D.tsx` loads the engine with a **dynamic `import()`**, which keeps three.js out of the server bundle and off the critical path. It downloads while the loading screen is visible.
- Initialisation runs in weighted stages reported to the loading bar: `INIT RENDER` → `BUILDING SCENE GRAPH` → `COMPILING SHADERS` → `RASTERIZING IMAGE`.
- Shaders are precompiled with `renderer.compileAsync()` so the first frames don't stutter.
- Startup awaits a frame between stages, and if the component unmounts in the middle, init stops cleanly.
- The loader stays up for at least 800 ms so it doesn't just flash on fast machines.

### Performance and fallbacks

- Pixel ratio is capped at 1.5. Rendering uses ACES filmic tone mapping.
- `prefers-reduced-motion`: renders a single still frame and never starts the animation loop.
- No WebGL or an init error: the page logs a warning and shows the static CSS background.
- Resizes are handled with a `ResizeObserver`.

### Time-of-day selector

By default the scene shows the live time in San Francisco, so a visitor at night sees a night bridge. The **TIME** dropdown in the corner of the landing page appears once the scene has loaded. It lets you switch between lighting conditions without waiting for the real clock.

| Preset | Time used |
| --- | --- |
| **Live** | The real current time in San Francisco |
| **Morning** | 1.5 h after today's sunrise |
| **Afternoon** | 2.5 h after today's solar noon |
| **Evening** | 15 min before today's sunset (golden hour) |
| **Night** | 3 h after today's sunset |

How it works:

- **Presets follow the sun, not the clock.** `presetTime()` in [`sky/sunPosition.ts`](src/components/Procedural3D/sky/sunPosition.ts) asks `suncalc` for *today's* sunrise, solar noon and sunset in SF, then applies an offset. "Evening" is golden hour in both June and December, even though the clock times are hours apart. Each option in the menu shows the SF time it maps to.
- **The engine isn't restarted.** Picking a preset calls `Engine.setTimeOverride()`, which resets the scene's clock and makes the next frame recompute the sky. The sun, moon, fog, lamps, stars, ocean and environment map all update together.
- **Time keeps moving.** The chosen time is a starting point, not a frozen moment. The scene clock keeps advancing in real time from there, so an "Evening" sun keeps setting.
- **The hero clock follows along.** The `SAN FRANCISCO · 7:12 PM` label on the landing panel shows the selected time, not the real one, so the text always matches the sky.
- **Accessible custom listbox.** A native `<select>` popup can't be styled, so [`TimeOfDayDropDown.tsx`](src/components/TimeOfDayDropDown/TimeOfDayDropDown.tsx) is a custom ARIA listbox. It supports keyboard navigation (↑/↓, Home/End, Enter/Space, Esc) and closes when you click outside it.

### Debug options

| Option | Effect |
| --- | --- |
| `?debug` | FPS panel (three.js `Stats`) |
| `?time=<ISO date>` | Start the scene at a specific moment, e.g. `?time=2026-06-21T20:30:00-07:00`. The dropdown overrides it once a preset is picked |

Most visual tuning (bridge dimensions, camera speed/FOV, fog density, chunk window) is in [`config.ts`](src/components/Procedural3D/config.ts).

---

## Rest of the site

| Route | Contents |
| --- | --- |
| `/` | 3D landing page with name, animated hex-text tagline and live SF clock |
| `/aditya` | About |
| `/aditya/career` | Work experience |
| `/aditya/projects` | Projects |
| `/aditya/contact` | Contact |

The inner pages share a layout with a navbar, footer, a CSS "cyber" background and an SVG city skyline generated from a seed.

---

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000 (Turbopack)
```

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Project structure

```
src/
├── app/
│   ├── page.tsx            Landing page (3D scene + loader + hero)
│   ├── layout.tsx          Root layout: fonts, Bootstrap, augmented-ui
│   ├── aditya/             Inner portfolio pages
│   └── styles/             Global and landing CSS
├── components/
│   ├── Procedural3D/       The 3D engine (see above)
│   ├── TimeOfDayDropDown/  Time-of-day preset picker
│   ├── HexAnimation/       Scrambling hex text effect
│   └── ...                 About, Career, Projects, Contact, Navbar, Footer, CitySkyline, ...
└── fonts/
```

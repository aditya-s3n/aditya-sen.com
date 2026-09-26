This is my personal website WIP

I've set up the structure and installed the libraries without writing any of the actual logic. TypeScript compiles cleanly. ESLint shows 34 errors, all of them "unused parameter" warnings on the empty stub functions; they go away as you fill each function in. Nothing is committed.

---

Part 1: What I added

Libraries

┌─────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       Package       │                                                                                Why                                                                                 │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                     │ Gives the sun's position for a date, latitude and longitutly from most tutorials online: angles are in degrees (not radians), and      │
│ suncalc@2           │ azimuth is measured clockwise from north (0 = N, 90 = E). It ships its own types; I removed the old @types/suncalc I'd added by mistake because it describes       │
│                     │ version 1.                                                                                                                             │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ simplex-noise@4     │ Smooth random noise for the drone's wandering path and sm it as import { createNoise2D } from 'simplex-noise'.                         │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ three (already      │ Already includes the extras you need: Sky.js, Water.js, Glil-gui, and the Draco decoder. No extra packages needed.                     │
│ installed)          │                                                                                                                                                                    │
└─────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

Files

public/
  models/README.md, golden-gate/.gitkeep   ← optional .glb props (lamp posts etc.)
  textures/README.md                       ← waternormals.jpg goes here
src/components/Procedural3D/
  Procedural3D.tsx       ← React wrapper: props + TODO steps (fixed style={styles
  Procedrual3D.module.css← full-screen fixed canvas layer (file name typo kept)
  config.ts              ← FILLED IN: real bridge dimensions, chunk/camera/fog se
  types.ts               ← shared types: PartKind, InstanceRange, PartPlacement, LoadProgress
  engine/Engine.ts       ← owns renderer/scene/camera/frame loop; init() → start(
  engine/LoadingTracker.ts ← turns weighted stages into one 0–1 progress value
  sky/sunPosition.ts     ← suncalc → Vector3, formula in the comments
  sky/SkyController.ts   ← sky, sun light, hemisphere light, fog color, exposure
  fog/HeightFog.ts       ← low-lying fog via a patch to three's fog shader code
  world/InstancePool.ts  ← one InstancedMesh per part type; chunks borrow ranges of slots
  world/ChunkManager.ts  ← builds chunks ahead of the camera, recycles chunks beh
  world/Ocean.ts         ← water plane that follows the camera
  bridge/BridgeChunk.ts  ← one repeating span (tower + deck + cables + suspenders
  bridge/parts/{deck,tower,cables,suspenders}.ts ← pure functions that return matrices
  camera/DroneCamera.ts  ← noise-driven flight path

Every stub has a doc comment that says what goes inside it.

---

Part 2: How it fits together

Conventions (keep these consistent everywhere)

- 1 unit = 1 meter. config.ts has the real numbers: a 1280 m main span, 227 m towable sag, suspenders every 15.2 m, and the color International Orange #C0362C.
- Axes: +X = east, +Y = up, −Z = north. The drone flies toward −Z.
- One chunk = one main span, with a tower at the chunk's start. Repeating tower →the bridge endless. Chunk i covers z from -(i+1)*1280 to -i*1280.

Data flow

page.tsx (loading UI)
   ▲ onProgress / onReady
Procedural3D.tsx ──dynamic import──► Engine
                                       ├─ SkyController ◄── sunPosition (suncalc, real Date)
                                       ├─ HeightFog (shader patch + scene.fog)
                                       ├─ Ocean
                                       ├─ ChunkManager ──► BridgeChunk ──► parts/
                                       │        └──────────► InstancePool (InstancedMeshes)
                                       └─ DroneCamera (simplex noise)

---
---

Part 3: Build it in this order

Build it one step at a time and look at the result after each step.

Step 1: Engine basics (Engine.ts, Procedural3D.tsx)

Copy the pattern from your CityLights3D.tsx, which already does this well:
- Load three.js inside useEffect with a dynamic import (e.g. import('./engine/Engine')) so it never runs during server-side rendering.
- Set a disposed flag and check it after every await. React Strict Mode mounts thment, and init is async.
- Renderer: antialias: true, pixel ratio capped with MAX_PIXEL_RATIO, toneMapping = ACESFilmicToneMapping, outputColorSpace = SRGBColorSpace.
- Camera: PerspectiveCamera(CAMERA.fov, aspect, CAMERA.near, CAMERA.far).
- Frame loop: use THREE.Timer (as in CityLights3D) and pass dt to each system.
- Pause when the tab is hidden (document.visibilitychange). For prefers-reduced-me, as CityLights3D does.
- Check: put a single orange box in the scene and confirm you can see it.

Step 2: Bridge part generators (bridge/parts/*)

These are pure functions: a position goes in, a list of matrices comes out. They never touch the scene, which makes them easy to reason about.
- Deck: tile a box of about 27 m wide × 7.6 m deep × one segment long along Z at me box geometry, scaled differently, for the truss underneath.
- Tower: two legs at x = ±cableSpacing/2. The real legs get narrower in steps as they rise, so use 3–4 stacked boxes with shrinking scale. Add towerPortals cross-beams between the legs; the
  real portals sit high up, above the deck.
- Cables: a parabola is correct here, because a suspension cable carrying a uniform deck load hangs in a parabola rather than a catenary: y(t) = towerHeight − 4·cableSag·t·(1−t), with t from
  0 to 1 across the span. Sample about 64 points and place one short unit cylindes. To orient each cylinder, use quaternion.setFromUnitVectors(UP, direction), then matrix.compose(midpoint, quaternion, scale(radius, length, radius)).
- Suspenders: every 15.2 m, one thin cylinder per side from deckHeight up to cabluals that height difference, so a unit cylinder with its origin at the bottommakes this simple.
- Tip: give each geometry its pivot where you want it (e.g. geometry.translate(0,gin is at its base). The matrix math becomes much simpler.

Step 3: Instancing (InstancePool.ts)

This is the core of the performance: each part type is drawn in one draw call, noloaded.
- init: for each part type, create new InstancedMesh(geometry, material, capacity). Capacity = (instances per chunk) × (loadAhead + keepBehind + 1). Compute instances per chunk by running a
  generator once and counting.
- Share one MeshStandardMaterial({ color: BRIDGE.color, roughness: 0.6, metalness: 0.3 }) across all bridge parts. Fewer materials means fewer shader compiles.
- Keep a list of free slots per type. allocate takes the next free slots, writes t, and marks the buffer for re-upload with instanceMatrix.needsUpdate = true. UseaddUpdateRange so only the changed slice is sent to the GPU.
- release: write a zero-scale matrix into each slot so it disappears, and return the slots to the free list. Or maintain mesh.count and swap-remove, but zero-scale is simpler.
- Culling gotcha: three.js skips drawing an InstancedMesh if its bounding sphere is off-screen, and that sphere is computed once. Either call mesh.computeBoundingSphere() after each allocate, or set frustumCulled = false. With only about 6 meshes, false is fine.
- Never create or destroy objects during flight. Only rewrite matrices. That's what makes the streaming smooth.

Step 4: Streaming (ChunkManager.ts, BridgeChunk.ts)

- Each frame: current = floor(-camera.z / CHUNK.length). Chunks from current - keepBehind to current + loadAhead should exist. Release anything outside that range.
- Build at most one chunk per frame so you never get a stutter.
- BridgeChunk.build() calls the generators with zStart = -index * CHUNK.length and passes each result to pool.allocate.
- For variation, seed a random-number generator from the chunk index (e.g. mulberry32, about 5 lines) so a chunk looks the same every time it's rebuilt.
- Floating origin: far from the origin, 32-bit GPU floats lose precision and the geometry starts to shake (roughly beyond 10 km, which takes only about 4 minutes at 40 m/s). When |camera.z| > FLOATING_ORIGIN_THRESHOLD, shift everything back by a whole number of chunks so the chunk grid stays aligned: the camera, every live matrix (pool.shift), the chunk indices, and the dronepath offset. Plan for this from the start; adding it later is painful.

Step 5: Drone camera (DroneCamera.ts)

- Track the distance flown, s += CAMERA.speed * dt. The base position is z = -s.
- x = noise(s * 0.0008, 0) * 40, y = deckHeight + 15 + noise(s * 0.0008, 100) * 30. Low frequencies give slow, cinematic drifts. Clamp or bias the path so it never goes through a tower leg:near z mod 1280 ≈ 0, push |x| toward 0, between the legs, or out beyond them.
- Look direction: camera.lookAt(pathAt(s + 60)). Looking along the path's own future gives natural banking into turns. Add roll proportional to the sideways change: camera.rotateZ(-(xAhead -x) * k).
- Optional fun: every few spans, fly under the deck by lowering the Y offset, so the truss passes overhead.

Step 6: Real-time sun (sunPosition.ts, SkyController.ts)

import { getPosition } from 'suncalc';
const { azimuth, altitude } = getPosition(new Date(), SF_LOCATION.lat, SF_LOCATION.lng); // DEGREES
Convert to a direction using this project's axes (the formula is also in the file):
az = azimuth in radians, alt = altitude in radians
x =  sin(az)·cos(alt)     // east
y =  sin(alt)             // up
z = -cos(az)·cos(alt)     // north is −Z
- Time zone: new Date() is an absolute moment in time, so the sun position is correct for SF wherever the visitor is. Use SF_TIMEZONE (America/Los_Angeles) only when displaying the time, via Intl.DateTimeFormat, e.g. a small "4:52 PM in SF" label on the page.
- Sky: import { Sky } from 'three/addons/objects/Sky.js'. sky.scale.setScalar(10000), and set sky.material.uniforms.sunPosition.value to the sun direction. Lower rayleigh and raise turbidity for SF's hazy marine air.
- Sun light: a DirectionalLight placed at camera.position + sunDir * 500, targeting the camera. Blend its color by altitude: white-yellow at noon, orange below about 10°, off below −6°.
- Night: below about −6° altitude, switch to moonlight (bluish, getMoonPosition from suncalc works the same way), make the lamp posts glow via emissive, and lowerrenderer.toneMappingExposure. Karl the Fog with glowing sodium lamps looks great at night.
- The sun barely moves in a minute, so recompute once per minute, not every frame.
- Debug tip: add ?time=2026-09-26T19:00:00-07:00 URL support to preview sunset. You'll need it; otherwise you can only test the current time.

Step 7: Fog (HeightFog.ts)

Two layers:
1. Distance fog: scene.fog = new THREE.FogExp2(color, FOG.density). This also hides chunk pop-in: tune the density so objects are fully fogged before loadAhead × 1280 m. If you can see achunk appear, raise the density or loadAhead.
2. Height fog (the SF look): fog that is thick near the water and clears above the tower tops. Replace three's built-in fog shader code before any material compiles:
   - THREE.ShaderChunk.fog_pars_vertex / fog_vertex: output the world position (vFogWorldPos = (modelMatrix * instanceMatrix * vec4(transformed,1)).xyz, using instanceMatrix only under #ifdef USE_INSTANCING).
   - fog_fragment: fogFactor = distanceFog * exp(-(vFogWorldPos.y - uBaseHeight) * uFalloff), plus 3D noise that scrolls with uFogTime so the fog bank drifts.
   - Because every built-in material uses these fog chunks, the bridge, water and anything else pick up the fog automatically. Share one uniforms object across materials and update uFogTimeeach frame.
- Match the fog color to the horizon from SkyController (bright gray-white by day, orange-pink at sunset, deep blue at night). The mismatch between fog color and sky color is what usuallylooks fake.
- The Sky shader ignores fog. For a foggy horizon, lower the sun-disc visibility or blend a gradient into the sky yourself.

Step 8: Ocean (Ocean.ts)

- import { Water } from 'three/addons/objects/Water.js'. It needs public/textures/waternormals.jpg; copy it from the three.js repo, examples/textures/.
- Use a large plane (e.g. 10 km) that snaps to the camera's X/Z each frame, and move its normal map in step with it so the water doesn't appear to slide.
- Pass the sun direction in so the reflections line up with the sky.

Step 9: Loading screen (page.tsx, LoadingTracker.ts)

Right now page.tsx fakes progress with a 1.5 s timer. Replace it with real progress:
1. Mount <Procedural3D> immediately, behind the loading overlay (it's position: fixed; z-index: -1). It has to be in the DOM for WebGL to render.
2. Pass onProgress={p => { setProgress(Math.round(p.value * 100)); setLabel(p.stage); }} and onReady={() => setLoaded(true)}. Your existing LOADING_MESSAGES fit well as stage labels.
3. In Engine.init, report stages through LoadingTracker:
   - assets: textures and models via a THREE.LoadingManager (its onProgress gives loaded/total)
   - chunks: chunkManager.prewarm(), one progress tick per chunk
   - shaders: await renderer.compileAsync(scene, camera). This is the key call. Without it, the first frame freezes while shaders compile. Install the height-fog patch before this call, oreverything recompiles later.
   - firstFrame: renderer.render(...) once, then wait for one requestAnimationFrame so the frame is actually on screen.
4. Keep a short minimum display time (e.g. 800 ms) so fast machines don't just flash the loader.
5. WebGL failure: wrap renderer creation in try/catch (as CityLights3D does) and call onReady anyway, so the landing page still appears over your existing gradient background.
6. You'll want a background visible behind the landing text; right now .cyber-bg sits at z-index: -1 too. Decide the stacking order (canvas above the gradient) or drop <Background /> on this page.

Step 10: Polish and performance

- Use stats.module.js and lil-gui from three/addons/libs/ for FPS and live tuning of fog, sun and drone settings. Load them only when a URL flag like ?debug is set.
- Aim for fewer than 20 draw calls in total (renderer.info.render.calls). With instancing, you should have about 6 bridge meshes, plus sky, water and the sun.
- Shadows are expensive over a 3 km view. Skip them, or use one shadow map that follows the camera with a tight camera frustum. Fog hides the lack of shadows well.
- On mobile, lower loadAhead, raise the fog density, and cap the pixel ratio at 1.
- Dispose everything in dispose(): geometries, materials, textures, renderer.dispose(), and remove the canvas.

Common mistakes

1. Using suncalc v1 tutorials (radians, azimuth measured from south) with v2. Your installed version uses degrees and measures from north.
2. Forgetting instanceMatrix.needsUpdate makes instances appear in the wrong place or not at all.
3. Instances disappearing when you turn the camera means the InstancedMesh bounding sphere is stale (see Step 3).
4. A hitch on the first frame means compileAsync wasn't awaited, or a new material was created after it ran.
5. Jittering geometry after a few minutes means the floating origin is missing.
6. Strict Mode double-mount can leave two canvases. Check the disposed flag after each await.

Models folder

It's there (public/models/golden-gate/), but you don't need any models. Everything on the bridge is boxes and cylinders, and those should be generated in code. Use the folder only for detailed props (lamp posts, railings) exported as .glb and compressed; the README there explains Draco setup.

---

Minor issue in your existing code: your original Procedural3D.tsx had style={styles}, which passes the whole CSS-module object as inline styles. I changed it to className={styles.canvas}. The CSS file name is still misspelled Procedrual3D.module.css; I kept it so your import still works, but you may want to rename it.

I can also put this walkthrough on a web page if you'd like to keep it open while you build.
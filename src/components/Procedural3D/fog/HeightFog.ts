import * as THREE from 'three';
import { FOG } from '../config';

/**
 * Karl-the-Fog style height fog, built on top of scene.fog (FogExp2).
 *
 * Every lit material gets its fog chunks swapped via onBeforeCompile. The
 * new fog is the sum of two "optical depths" along the camera->fragment ray:
 *  1. thin haze everywhere: (fogDensity * distance)^2, as in FogExp2
 *  2. a marine layer whose density falls off exponentially with height,
 *     integrated analytically along the ray (Inigo Quilez, "better fog"),
 *     modulated by drifting noise so the bank moves
 * Past FOG.fadeStart everything is forced into the fog so streamed chunks
 * never pop in.
 *
 * These uniform objects are shared by reference with every material, so
 * updating a value here updates all of them.
 */
export const fogUniforms = {
  uFogTime: { value: 0 },
  uFogHeightDensity: { value: FOG.heightDensity },
  uFogHeightFalloff: { value: FOG.heightFalloff },
  uFogBaseHeight: { value: FOG.baseHeight },
  uFogFadeStart: { value: FOG.fadeStart },
  uFogFadeEnd: { value: FOG.fadeEnd },
  /** Added to world positions for noise, so the fog doesn't jump on a floating-origin shift. */
  uFogOrigin: { value: new THREE.Vector3() },
  uSunDirection: { value: new THREE.Vector3(0, 1, 0) },
  /** Glow added to the fog toward the sun, in output (sRGB) space like fogColor. */
  uSunGlowColor: { value: new THREE.Color(0, 0, 0) },
};

/** Shared by the fog and the sky's horizon, so both get the same color. */
export const fogCommon = /* glsl */ `
  uniform vec3 uSunDirection;
  uniform vec3 uSunGlowColor;

  vec3 fogColorFor(vec3 baseColor, vec3 rayDir) {
    float towardSun = max(dot(rayDir, uSunDirection), 0.0);
    return baseColor + uSunGlowColor * pow(towardSun, 8.0);
  }
`;

export const fogParsVertex = /* glsl */ `
  #ifdef USE_FOG
    varying float vFogDepth;
    varying vec3 vFogWorldPos;
  #endif
`;

/** `localPosition` is `transformed` in built-in materials, `position` in custom ones. */
export const fogVertex = (localPosition: string) => /* glsl */ `
  #ifdef USE_FOG
    vec4 fogLocal = vec4(${localPosition}, 1.0);
    #ifdef USE_INSTANCING
      fogLocal = instanceMatrix * fogLocal;
    #endif
    vFogWorldPos = (modelMatrix * fogLocal).xyz;
    vFogDepth = -mvPosition.z;
  #endif
`;

export const fogParsFragment = /* glsl */ `
  #ifdef USE_FOG
    uniform vec3 fogColor;
    varying float vFogDepth;
    varying vec3 vFogWorldPos;
    #ifdef FOG_EXP2
      uniform float fogDensity;
    #else
      uniform float fogNear;
      uniform float fogFar;
    #endif
    uniform float uFogTime;
    uniform float uFogHeightDensity;
    uniform float uFogHeightFalloff;
    uniform float uFogBaseHeight;
    uniform float uFogFadeStart;
    uniform float uFogFadeEnd;
    uniform vec3 uFogOrigin;
    ${fogCommon}

    float fogHash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    // Smooth 3D value noise in [0, 1].
    float fogNoise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(fogHash(i), fogHash(i + vec3(1, 0, 0)), f.x),
            mix(fogHash(i + vec3(0, 1, 0)), fogHash(i + vec3(1, 1, 0)), f.x), f.y),
        mix(mix(fogHash(i + vec3(0, 0, 1)), fogHash(i + vec3(1, 0, 1)), f.x),
            mix(fogHash(i + vec3(0, 1, 1)), fogHash(i + vec3(1, 1, 1)), f.x), f.y),
        f.z);
    }
  #endif
`;

export const fogFragment = /* glsl */ `
  #ifdef USE_FOG
    vec3 fogRay = vFogWorldPos - cameraPosition;
    float fogDist = length(fogRay);
    vec3 fogDir = fogRay / max(fogDist, 1e-4);

    // 1. Thin haze everywhere.
    #ifdef FOG_EXP2
      float fogOD = fogDensity * fogDensity * fogDist * fogDist;
    #else
      float fogOD = 0.0;
    #endif

    // 2. Marine layer: density(y) = a * exp(-b * (y - base)), integrated from
    //    the camera along the ray. Near-horizontal rays use the limit (= dist).
    float fb = uFogHeightFalloff;
    float fdy = fogDir.y * fogDist * fb;
    float fogPath = abs(fdy) < 1e-4 ? fogDist : (1.0 - exp(-fdy)) / (fb * fogDir.y);
    float heightOD = uFogHeightDensity * exp(-fb * (cameraPosition.y - uFogBaseHeight)) * fogPath;

    // 3. Drift: sample noise halfway along the (near part of the) ray.
    vec3 np = cameraPosition + fogDir * min(fogDist, 400.0) * 0.5 + uFogOrigin;
    float drift = 0.6 * fogNoise(np * 0.006 + vec3(uFogTime * 0.03, 0.0, uFogTime * 0.012))
                + 0.4 * fogNoise(np * 0.017 - vec3(0.0, uFogTime * 0.02, 0.0));
    heightOD *= mix(0.45, 1.55, drift);

    float fogFactor = 1.0 - exp(-(fogOD + heightOD));

    // 4. Hide the edge of the streamed world.
    fogFactor = max(fogFactor, smoothstep(uFogFadeStart, uFogFadeEnd, fogDist));

    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColorFor(fogColor, fogDir), fogFactor);
  #endif
`;

/** Swap a built-in material's fog for the height fog. Call before it compiles. */
export function applyHeightFog(material: THREE.Material): void {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, fogUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <fog_pars_vertex>', fogParsVertex)
      .replace('#include <fog_vertex>', fogVertex('transformed'));
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <fog_pars_fragment>', fogParsFragment)
      .replace('#include <fog_fragment>', fogFragment);
  };
}

export function updateHeightFog(elapsed: number, originZ: number): void {
  fogUniforms.uFogTime.value = elapsed;
  // World z = absolute z + origin.z, so absolute = world - origin.z.
  fogUniforms.uFogOrigin.value.set(0, 0, -originZ);
}

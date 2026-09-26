import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import type { BridgeAssets } from '../bridge/assets';
import { SKY_SCALE } from '../config';
import { fogCommon, fogUniforms } from '../fog/HeightFog';
import { lerp, smoothstep } from '../utils';
import { getMoonDirection, getSunAltitude, getSunDirection } from './sunPosition';

/** Time-of-day values other systems (ocean, lamps) read each frame. */
export interface SkyState {
  sunDirection: THREE.Vector3;
  sunAltitude: number;   // degrees
  dayFactor: number;     // 0 night .. 1 day
  goldenFactor: number;  // 1 near sunrise/sunset
  sunColor: THREE.Color;
  sunIntensity: number;
  horizonColor: THREE.Color; // linear
  zenithColor: THREE.Color;  // linear
}

// Palette, picked by eye. Color.set() converts these sRGB hex values to linear.
const FOG_DAY = new THREE.Color('#b9c3cc');
const FOG_GOLDEN = new THREE.Color('#dca283');
const FOG_NIGHT = new THREE.Color('#121a2a');
const ZENITH_DAY = new THREE.Color('#4a78b5');
const ZENITH_NIGHT = new THREE.Color('#050814');
const SUN_NOON = new THREE.Color('#fff4e5');
const SUN_LOW = new THREE.Color('#ff8a3d');
const MOON = new THREE.Color('#9fb4ff');

const STAR_COUNT = 1500;
const STAR_RADIUS = 3000;

/**
 * Drives everything that depends on the real time of day in San Francisco:
 * sky dome, sun and moon lights, ambient light, fog color, stars, street
 * lamps and the environment map used for reflections.
 */
export class SkyController {
  readonly sky = new Sky();
  readonly state: SkyState = {
    sunDirection: new THREE.Vector3(0, 1, 0),
    sunAltitude: 90,
    dayFactor: 1,
    goldenFactor: 0,
    sunColor: new THREE.Color(),
    sunIntensity: 0,
    horizonColor: new THREE.Color(),
    zenithColor: new THREE.Color(),
  };

  private sun = new THREE.DirectionalLight();
  private moon = new THREE.DirectionalLight();
  private hemi = new THREE.HemisphereLight();
  private stars!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private moonDirection = new THREE.Vector3();
  private pmrem: THREE.PMREMGenerator;
  private envTarget: THREE.WebGLRenderTarget | null = null;
  private envScene = new THREE.Scene();

  constructor(
    private scene: THREE.Scene,
    private renderer: THREE.WebGLRenderer,
    private assets: BridgeAssets,
  ) {
    this.pmrem = new THREE.PMREMGenerator(renderer);
  }

  init(): void {
    const material = this.sky.material as THREE.ShaderMaterial;
    const u = material.uniforms;
    u.turbidity.value = 6;          // hazy marine air
    u.rayleigh.value = 1.6;
    u.mieCoefficient.value = 0.006;
    u.mieDirectionalG.value = 0.85;
    u.cloudCoverage.value = 0.3;
    this.patchSkyHorizon(material);

    this.sky.scale.setScalar(SKY_SCALE);
    this.sky.renderOrder = -1;      // always drawn first, behind everything
    material.depthTest = false;
    this.sky.frustumCulled = false;
    this.scene.add(this.sky);

    // Lights are never removed or hidden (only dimmed), because changing the
    // light count forces every material to recompile.
    this.scene.add(this.sun, this.sun.target, this.moon, this.moon.target, this.hemi);
    this.hemi.groundColor.set('#1d262c');

    this.stars = this.createStars();
    this.scene.add(this.stars);
  }

  /** Recompute from a Date. Cheap, but the env map isn't, so call it about once a minute. */
  update(date: Date): void {
    const s = this.state;
    getSunDirection(date, s.sunDirection);
    getMoonDirection(date, this.moonDirection);
    s.sunAltitude = getSunAltitude(date);

    const alt = s.sunAltitude;
    s.dayFactor = smoothstep(-8, 6, alt);                 // civil twilight into day
    s.goldenFactor = 1 - smoothstep(3, 20, Math.abs(alt)); // near the horizon

    // Fog / horizon: night -> (day mixed with golden) by dayFactor.
    s.horizonColor.copy(FOG_DAY).lerp(FOG_GOLDEN, s.goldenFactor);
    s.horizonColor.lerpColors(FOG_NIGHT, s.horizonColor, s.dayFactor);
    s.zenithColor.lerpColors(ZENITH_NIGHT, ZENITH_DAY, s.dayFactor);
    (this.scene.fog as THREE.FogExp2).color.copy(s.horizonColor);

    s.sunColor.lerpColors(SUN_NOON, SUN_LOW, s.goldenFactor);
    s.sunIntensity = 3.2 * smoothstep(-2, 6, alt);
    this.sun.color.copy(s.sunColor);
    this.sun.intensity = s.sunIntensity;

    const moonAltitude = THREE.MathUtils.radToDeg(Math.asin(this.moonDirection.y));
    const moonUp = smoothstep(-2, 5, moonAltitude);
    this.moon.color.copy(MOON);
    this.moon.intensity = 0.35 * (1 - s.dayFactor) * moonUp;

    this.hemi.color.copy(s.horizonColor);
    this.hemi.intensity = lerp(0.25, 0.6, s.dayFactor);

    // Warm glow in the fog toward a low sun. fogColor lives in output (sRGB)
    // space inside the shader, so convert the glow to match.
    const glow = s.sunColor.clone().multiplyScalar(0.55 * s.goldenFactor * s.dayFactor);
    glow.getRGB(fogUniforms.uSunGlowColor.value, THREE.SRGBColorSpace);
    fogUniforms.uSunDirection.value.copy(s.sunDirection);

    // Street lamps: dim by day, over-bright (HDR) at night. Much above ~2 and
    // tone mapping clips them to white, losing the sodium orange.
    this.assets.lampMaterial.color.setScalar(lerp(1.6, 0.5, s.dayFactor));
    // The real bridge is floodlit at night; fake it with a faint orange emissive.
    this.assets.steelMaterial.emissiveIntensity = 0.12 * (1 - s.dayFactor);
    this.stars.material.opacity = 1 - smoothstep(-12, -4, alt);

    const u = (this.sky.material as THREE.ShaderMaterial).uniforms;
    u.sunPosition.value.copy(s.sunDirection);

    this.updateEnvironment();
  }

  /** Keep the sky, stars and lights centered on the camera; animate clouds. */
  follow(camera: THREE.Camera, elapsed: number): void {
    this.sky.position.copy(camera.position);
    this.stars.position.copy(camera.position);
    (this.sky.material as THREE.ShaderMaterial).uniforms.time.value = elapsed;

    this.sun.target.position.copy(camera.position);
    this.sun.position.copy(camera.position).addScaledVector(this.state.sunDirection, 500);
    this.moon.target.position.copy(camera.position);
    this.moon.position.copy(camera.position).addScaledVector(this.moonDirection, 500);
  }

  /**
   * Blend the sky into the fog color near and below the horizon, using the
   * same fogColorFor() as the fog, so fogged objects meet the sky seamlessly.
   * material.fog = true makes three fill in `fogColor` for us.
   */
  private patchSkyHorizon(material: THREE.ShaderMaterial) {
    material.fog = true;
    Object.assign(material.uniforms, THREE.UniformsUtils.clone(THREE.UniformsLib.fog), fogUniforms);
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', `uniform vec3 fogColor;\n${fogCommon}\nvoid main() {`)
        .replace(
          '#include <colorspace_fragment>',
          /* glsl */ `#include <colorspace_fragment>
          float horizonMix = smoothstep(-0.02, 0.2, direction.y);
          gl_FragColor.rgb = mix(fogColorFor(fogColor, direction), gl_FragColor.rgb, horizonMix);`,
        );
    };
  }

  /** Render the sky into a PMREM so the bridge picks up sky-colored reflections. */
  private updateEnvironment() {
    const material = this.sky.material as THREE.ShaderMaterial;
    const position = this.sky.position.clone();

    // The sun disc would make harsh highlights in the env map.
    material.uniforms.showSunDisc.value = 0;
    this.envScene.fog = this.scene.fog; // same fog -> same compiled shader
    this.envScene.add(this.sky);
    const target = this.pmrem.fromScene(this.envScene, 0, 1, SKY_SCALE * 2, { position });
    this.scene.add(this.sky);
    material.uniforms.showSunDisc.value = 1;

    this.envTarget?.dispose();
    this.envTarget = target;
    this.scene.environment = target.texture;
    this.scene.environmentIntensity = lerp(0.15, 0.6, this.state.dayFactor);
  }

  private createStars() {
    const positions = new Float32Array(STAR_COUNT * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < STAR_COUNT; i++) {
      // Random points on the upper hemisphere, clear of the foggy horizon.
      do v.randomDirection(); while (v.y < 0.12);
      v.multiplyScalar(STAR_RADIUS).toArray(positions, i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 1.6,
      sizeAttenuation: false,
      transparent: true,
      depthWrite: false,
      fog: false,
    });
    const stars = new THREE.Points(geometry, material);
    stars.frustumCulled = false;
    return stars;
  }

  dispose(): void {
    this.scene.remove(this.sky, this.sun, this.sun.target, this.moon, this.moon.target, this.hemi, this.stars);
    this.sky.geometry.dispose();
    (this.sky.material as THREE.Material).dispose();
    this.stars.geometry.dispose();
    this.stars.material.dispose();
    this.envTarget?.dispose();
    this.pmrem.dispose();
    this.scene.environment = null;
  }
}

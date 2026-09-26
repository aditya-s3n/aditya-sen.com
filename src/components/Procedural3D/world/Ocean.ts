import * as THREE from 'three';
import { fogFragment, fogParsFragment, fogParsVertex, fogUniforms, fogVertex } from '../fog/HeightFog';
import type { SkyState } from '../sky/SkyController';

const SIZE = 9000;

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  ${fogParsVertex}

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPosition = viewMatrix * worldPos;
    gl_Position = projectionMatrix * mvPosition;
    ${fogVertex('position')}
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uWaterColor;
  uniform vec3 uSkyColor;
  uniform vec3 uHorizonColor;
  uniform vec3 uSunColor;
  uniform vec3 uOceanSunDir;
  varying vec3 vWorldPos;
  ${fogParsFragment}

  // Slope (dh/dx, dh/dz) of one directional sine wave.
  vec2 waveSlope(vec2 p, vec2 dir, float freq, float speed, float amp) {
    return dir * amp * freq * cos(dot(dir, p) * freq + uTime * speed);
  }

  void main() {
    // Absolute position, so the pattern doesn't jump on a floating-origin shift.
    vec2 p = vWorldPos.xz + uFogOrigin.xz;

    vec2 slope = vec2(0.0);
    slope += waveSlope(p, normalize(vec2(0.3, 1.0)), 0.035, 0.9, 0.9);
    slope += waveSlope(p, normalize(vec2(-0.7, 0.6)), 0.07, 1.3, 0.35);
    slope += waveSlope(p, normalize(vec2(0.9, -0.2)), 0.16, 2.1, 0.12);
    slope += waveSlope(p, normalize(vec2(-0.2, -1.0)), 0.41, 3.0, 0.04);
    slope += waveSlope(p, normalize(vec2(0.6, 0.8)), 0.93, 4.2, 0.015);
    vec3 normal = normalize(vec3(-slope.x, 1.0, -slope.y));

    vec3 toFrag = vWorldPos - cameraPosition;
    float dist = length(toFrag);
    vec3 viewDir = toFrag / dist;
    // Flatten far-away normals, they would only alias into noise.
    normal = normalize(mix(normal, vec3(0.0, 1.0, 0.0), smoothstep(150.0, 1500.0, dist)));

    vec3 reflected = reflect(viewDir, normal);
    reflected.y = abs(reflected.y);
    vec3 sky = mix(uHorizonColor, uSkyColor, smoothstep(0.0, 0.5, reflected.y));

    float fresnel = 0.02 + 0.98 * pow(1.0 - max(dot(-viewDir, normal), 0.0), 5.0);
    vec3 color = mix(uWaterColor, sky, fresnel);
    color += uSunColor * pow(max(dot(reflected, uOceanSunDir), 0.0), 350.0) * 6.0;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    ${fogFragment}
  }
`;

/**
 * Water plane under the bridge. It follows the camera in X/Z, and the waves
 * are computed from world position, so it looks infinite and never slides.
 * Cheaper than three's Water.js, which re-renders the scene for reflections.
 */
export class Ocean {
  readonly mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

  constructor(private scene: THREE.Scene) {
    const geometry = new THREE.PlaneGeometry(SIZE, SIZE).rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      fog: true,
      uniforms: {
        ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
        ...fogUniforms, // shared objects, not copies
        uTime: { value: 0 },
        uWaterColor: { value: new THREE.Color(0x0b2a33) },
        uSkyColor: { value: new THREE.Color() },
        uHorizonColor: { value: new THREE.Color() },
        uSunColor: { value: new THREE.Color() },
        uOceanSunDir: { value: new THREE.Vector3(0, 1, 0) },
      },
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.frustumCulled = false;
  }

  init(): void {
    this.scene.add(this.mesh);
  }

  update(camera: THREE.Camera, elapsed: number, sky: SkyState): void {
    const u = this.mesh.material.uniforms;
    this.mesh.position.set(camera.position.x, 0, camera.position.z);
    u.uTime.value = elapsed;
    u.uSkyColor.value.copy(sky.zenithColor);
    u.uHorizonColor.value.copy(sky.horizonColor);
    u.uSunColor.value.copy(sky.sunColor).multiplyScalar(sky.sunIntensity);
    u.uOceanSunDir.value.copy(sky.sunDirection);
  }

  dispose(): void {
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

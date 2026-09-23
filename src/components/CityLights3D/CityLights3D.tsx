'use client';

import { useEffect, useRef } from 'react';
import styles from './CityLights3D.module.css';

const COUNT = 220;
// Half-height of the column the lights travel through, in world units.
const SPAN = 45;
const COLORS = ['#59EEF4', '#FC7265', '#FCA765', '#ff2a6d', '#59EEF4'];

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpan;
  uniform float uPixelRatio;

  attribute vec3 aStart;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = aStart;
    // Travel straight up (or down) and wrap around the column.
    p.y = mod(p.y + aSpeed * uTime + uSpan, 2.0 * uSpan) - uSpan;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (300.0 / -mv.z);

    // Fade in above the rooftops, fade out high in the sky, and twinkle.
    float fadeIn = smoothstep(-uSpan, -uSpan * 0.55, p.y);
    float fadeOut = 1.0 - smoothstep(uSpan * 0.1, uSpan * 0.85, p.y);
    float twinkle = 0.7 + 0.3 * sin(uTime * 2.5 + aPhase);

    vColor = aColor;
    vAlpha = fadeIn * fadeOut * twinkle;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Stretch the glow vertically so each light reads as a short streak.
    vec2 c = gl_PointCoord - 0.5;
    c.x *= 4.0;
    float d = dot(c, c);
    float glow = exp(-d * 10.0);
    float core = exp(-d * 60.0);

    vec3 color = mix(vColor, vec3(1.0), core * 0.6);
    gl_FragColor = vec4(color, (glow * 0.8 + core) * vAlpha);
  }
`;

export default function CityLights3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup = () => {};

    // Load three.js on the client only, after the page has rendered.
    import('three').then((THREE) => {
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
      } catch {
        return; // No WebGL: the SVG skyline still renders on its own.
      }

      const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 1, 200);
      camera.position.set(0, 0, 50);

      const start = new Float32Array(COUNT * 3);
      const speed = new Float32Array(COUNT);
      const size = new Float32Array(COUNT);
      const phase = new Float32Array(COUNT);
      const color = new Float32Array(COUNT * 3);
      const tmp = new THREE.Color();

      for (let i = 0; i < COUNT; i++) {
        start[i * 3] = (Math.random() - 0.5) * 170;
        start[i * 3 + 1] = (Math.random() - 0.5) * 2 * SPAN;
        start[i * 3 + 2] = -40 + Math.random() * 55;
        // Most lights rise; about a quarter come back down.
        const s = 1.2 + Math.random() * 3.5;
        speed[i] = Math.random() < 0.25 ? -s : s;
        size[i] = 1.5 + Math.random() * 3;
        phase[i] = Math.random() * Math.PI * 2;
        tmp.set(COLORS[i % COLORS.length]);
        color.set([tmp.r, tmp.g, tmp.b], i * 3);
      }

      const geometry = new THREE.BufferGeometry();
      // `position` is required by three.js for bounds; the shader uses aStart.
      geometry.setAttribute('position', new THREE.BufferAttribute(start, 3));
      geometry.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
      geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
      geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
      geometry.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
      geometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3));

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uSpan: { value: SPAN },
          uPixelRatio: { value: pixelRatio },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false; // Positions move in the shader.
      scene.add(points);

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = container;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener('resize', resize);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const timer = new THREE.Timer();
      let frame = 0;

      const render = () => {
        timer.update();
        material.uniforms.uTime.value = timer.getElapsed();
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };

      if (reduceMotion) {
        material.uniforms.uTime.value = 10;
        renderer.render(scene, camera);
      } else {
        frame = requestAnimationFrame(render);
      }

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={containerRef} className={styles.lights} aria-hidden="true" />;
}

import * as THREE from 'three';
import { DroneCamera } from '../camera/DroneCamera';
import { createBridgeAssets, type BridgeAssets } from '../bridge/assets';
import { countChunkParts } from '../bridge/BridgeChunk';
import { CAMERA, CHUNK, FLOATING_ORIGIN_THRESHOLD, FOG, MAX_PIXEL_RATIO, SKY_UPDATE_INTERVAL } from '../config';
import { updateHeightFog } from '../fog/HeightFog';
import { SkyController } from '../sky/SkyController';
import type { LoadProgress, WorldOrigin } from '../types';
import { nextFrame } from '../utils';
import { ChunkManager } from '../world/ChunkManager';
import { InstancePool } from '../world/InstancePool';
import { Ocean } from '../world/Ocean';
import { LoadingTracker } from './LoadingTracker';

export interface EngineOptions {
  /** Render one still frame instead of flying. */
  reducedMotion: boolean;
  /** Start the clock at this time instead of now (e.g. ?time=...). */
  timeOverride: Date | null;
  /** Show an FPS panel. */
  debug: boolean;
}

const STAGES = [
  { id: 'scene', label: 'INIT RENDER', weight: 1 },
  { id: 'chunks', label: 'BUILDING SCENE GRAPH', weight: 2 },
  { id: 'shaders', label: 'COMPILING SHADERS', weight: 3 },
  { id: 'firstFrame', label: 'RASTERIZING IMAGE', weight: 1 },
];

/**
 * Owns the renderer, scene, camera and the frame loop, and wires the
 * subsystems (sky, fog, ocean, chunks, drone camera) together.
 *
 *   const engine = new Engine(container, options);
 *   await engine.init(onProgress);   // build + prewarm everything
 *   engine.start();                  // begin the RAF loop
 *   engine.dispose();                // on unmount
 */
export class Engine {
  renderer!: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, CAMERA.near, CAMERA.far);

  private origin: WorldOrigin = { z: 0 };
  private timer = new THREE.Timer();
  private assets!: BridgeAssets;
  private pool!: InstancePool;
  private chunks!: ChunkManager;
  private sky!: SkyController;
  private ocean!: Ocean;
  private drone!: DroneCamera;
  private resizeObserver?: ResizeObserver;
  private stats?: { dom: HTMLElement; update(): void };
  private frame = 0;
  private running = false;
  private disposed = false;
  private nextSkyUpdate = 0;
  private clockStart = Date.now();

  constructor(private container: HTMLElement, private options: EngineOptions) {}

  async init(onProgress: (p: LoadProgress) => void): Promise<void> {
    const tracker = new LoadingTracker(STAGES, onProgress);

    // Scene: renderer, fog, sky, ocean, bridge meshes.
    tracker.update('scene', 0);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;
    this.container.appendChild(this.renderer.domElement);
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);

    this.scene.fog = new THREE.FogExp2(0xb9c3cc, FOG.density);
    this.assets = createBridgeAssets();
    this.sky = new SkyController(this.scene, this.renderer, this.assets);
    this.sky.init();
    this.ocean = new Ocean(this.scene);
    this.ocean.init();

    this.pool = new InstancePool(this.scene);
    this.pool.init(countChunkParts(), ChunkManager.maxChunks, this.assets);
    this.chunks = new ChunkManager(this.pool, this.origin);
    this.drone = new DroneCamera(this.camera, this.origin);
    this.step(0, 0); // place the camera, set the sky, build the current chunk
    tracker.complete('scene');
    await this.checkpoint();

    // Chunks: build the whole initial window up front.
    await this.chunks.prewarm(this.camera, (done, total) => tracker.update('chunks', done / total));
    this.bail();

    // Shaders: compile every program now instead of hitching on frame one.
    tracker.update('shaders', 0);
    await this.renderer.compileAsync(this.scene, this.camera);
    tracker.complete('shaders');
    await this.checkpoint();

    // First frame: make sure it has actually been drawn.
    this.renderer.render(this.scene, this.camera);
    await this.checkpoint();
    tracker.complete('firstFrame');

    if (this.options.debug) await this.enableStats();
  }

  start(): void {
    if (this.options.reducedMotion) {
      this.renderer.render(this.scene, this.camera);
      return;
    }
    this.running = true;
    this.timer.connect(document); // pauses the clock while the tab is hidden
    this.timer.reset();
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (timestamp: number) => {
    this.frame = requestAnimationFrame(this.tick);
    this.timer.update(timestamp);
    const dt = Math.min(this.timer.getDelta(), 0.1); // no giant jump after a stall
    this.step(dt, this.timer.getElapsed());
    this.renderer.render(this.scene, this.camera);
    this.stats?.update();
  };

  /** Advance every system by dt. */
  private step(dt: number, elapsed: number) {
    this.drone.update(dt);
    this.rebaseIfFar();
    this.chunks.update(this.camera);

    if (elapsed >= this.nextSkyUpdate) {
      this.sky.update(this.now());
      this.nextSkyUpdate = elapsed + SKY_UPDATE_INTERVAL;
    }
    this.sky.follow(this.camera, elapsed);
    this.ocean.update(this.camera, elapsed, this.sky.state);
    updateHeightFog(elapsed, this.origin.z);
  }

  /**
   * Floating origin: once the camera is far from 0, move the whole world
   * back by a whole number of chunks so float precision stays high and
   * the chunk grid stays aligned.
   */
  private rebaseIfFar() {
    if (this.camera.position.z > -FLOATING_ORIGIN_THRESHOLD) return;
    const offset = Math.floor(-this.camera.position.z / CHUNK.length) * CHUNK.length;
    this.origin.z += offset;
    this.chunks.shift(offset);
    this.drone.update(0); // recompute the camera from the new origin
  }

  /** Switch to another time (or null for the real clock) and update the sky now. */
  setTimeOverride(date: Date | null): void {
    this.options.timeOverride = date;
    this.clockStart = Date.now();
    this.nextSkyUpdate = 0; // the next frame recomputes the sky
    if (!this.running && this.sky) {
      this.sky.update(this.now());
      this.renderer.render(this.scene, this.camera);
    }
  }

  /** Real SF time, or the override advancing in real time. */
  private now(): Date {
    const { timeOverride } = this.options;
    if (!timeOverride) return new Date();
    return new Date(timeOverride.getTime() + (Date.now() - this.clockStart));
  }

  resize(): void {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (!this.running && this.chunks) this.renderer.render(this.scene, this.camera);
  }

  private async enableStats() {
    const { default: Stats } = await import('three/addons/libs/stats.module.js');
    this.stats = new Stats();
    this.stats.dom.style.cssText = 'position:fixed;top:0;left:0;z-index:10000';
    document.body.appendChild(this.stats.dom);
  }

  /** Let the browser paint the progress bar, and stop if we were unmounted meanwhile. */
  private async checkpoint() {
    await nextFrame();
    this.bail();
  }

  private bail() {
    if (this.disposed) throw new Error('Engine disposed during init');
  }

  dispose(): void {
    this.disposed = true;
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
    this.timer.dispose();
    this.stats?.dom.remove();
    this.chunks?.dispose();
    this.pool?.dispose();
    this.assets?.dispose();
    this.sky?.dispose();
    this.ocean?.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}

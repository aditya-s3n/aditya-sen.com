import * as THREE from 'three';
import { BRIDGE, CAMERA, CHUNK } from '../config';
import type { WorldOrigin } from '../types';

// Centered over the road, above the deck, below the main cable's lowest
// point (towerHeight - cableSag = 83 m) and the tower portals, so the
// straight line clears everything, including the gap between the tower legs.
const FLIGHT_X = 0;
const FLIGHT_Y = BRIDGE.deckHeight + 12;

/**
 * Drone flight: a straight line along -Z at constant speed and height.
 * No drift, bob or roll; the camera always looks straight ahead.
 */
export class DroneCamera {
  private s: number;

  constructor(
    private camera: THREE.PerspectiveCamera,
    private origin: WorldOrigin,
    startDistance = CHUNK.length * 0.35,
  ) {
    this.s = startDistance;
  }

  /** Position on the path at distance s, in world space. */
  pathAt(s: number, target: THREE.Vector3): THREE.Vector3 {
    return target.set(FLIGHT_X, FLIGHT_Y, -s + this.origin.z);
  }

  update(dt: number): void {
    this.s += CAMERA.speed * dt;
    this.pathAt(this.s, this.camera.position);
    this.camera.lookAt(FLIGHT_X, FLIGHT_Y, this.camera.position.z - CAMERA.lookAhead);
  }
}

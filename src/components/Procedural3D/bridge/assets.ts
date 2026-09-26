import * as THREE from 'three';
import { BRIDGE } from '../config';
import { applyHeightFog } from '../fog/HeightFog';
import type { PartKind } from '../types';

export interface BridgeAssets {
  geometries: Record<PartKind, THREE.BufferGeometry>;
  materials: Record<PartKind, THREE.Material>;
  /** Unlit lamp material, brightened at night by SkyController. */
  lampMaterial: THREE.MeshBasicMaterial;
  /** Orange steel; SkyController adds an emissive "floodlight" glow at night. */
  steelMaterial: THREE.MeshStandardMaterial;
  dispose(): void;
}

/** Shared unit geometries and materials for every part kind. */
export function createBridgeAssets(): BridgeAssets {
  const box = new THREE.BoxGeometry(1, 1, 1);
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 10, 1);

  const steel = new THREE.MeshStandardMaterial({
    color: BRIDGE.color,
    roughness: 0.55,
    metalness: 0.1,
    emissive: BRIDGE.color,
    emissiveIntensity: 0,
  });
  const concrete = new THREE.MeshStandardMaterial({ color: 0x2e3134, roughness: 0.95 });
  const lamp = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (const material of [steel, concrete, lamp]) applyHeightFog(material);

  return {
    geometries: { steelBox: box, concreteBox: box, cable: cylinder, lamp: box },
    materials: { steelBox: steel, concreteBox: concrete, cable: steel, lamp },
    lampMaterial: lamp,
    steelMaterial: steel,
    dispose() {
      box.dispose();
      cylinder.dispose();
      steel.dispose();
      concrete.dispose();
      lamp.dispose();
    },
  };
}

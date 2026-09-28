import * as THREE from 'three';
import { BRIDGE } from '../config';
import type { Parts } from '../types';

import { applyFog } from '../fog/Fog';


export interface BridgeAssets {
    geometries: Record<Parts, THREE.BufferGeometry>;
    materials: Record<Parts, THREE.Material>;

    // unlit lamp material (becomes emissive by SkyController)
    lampMaterial: THREE.MeshBasicMaterial;

    // orange steel (emissive by SkyController)
    steelMaterial: THREE.MeshStandardMaterial;
    dispose(): void;
}


/** Shared Unit Geometry and Materials for every part */
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
    for (const material of [steel, concrete, lamp]) {
        applyFog(material);
    }


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
    }
}
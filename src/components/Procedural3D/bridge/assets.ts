import * as THREE from 'three';
import { BRIDGE } from '../config';
import type { Parts } from '../types';

import { applyFog } from '../fog/Fog';


export interface BridgeAssets {
    geometries: Record<Parts, THREE.BufferGeometry>;
    materials: Record<Parts, THREE.Material>;

    // unlit lamp material (becomes emissive by SkyController)
    lampMaterial: THREE.MeshBasicMaterial;

    // additive light pools on the road (brightness set by SkyController)
    lampPoolMaterial: THREE.MeshBasicMaterial;

    // orange steel (emissive by SkyController)
    steelMaterial: THREE.MeshStandardMaterial;
    dispose(): void;
}


/** Radial falloff, 1 at the centre to 0 at the edge */
function createPoolTexture(size = 64): THREE.DataTexture {
    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = (x + 0.5) / size * 2 - 1;
            const dy = (y + 0.5) / size * 2 - 1;
            const falloff = Math.max(0, 1 - Math.hypot(dx, dy));
            const v = Math.round(255 * falloff * falloff);
            data.set([v, v, v, 255], (y * size + x) * 4);
        }
    }

    const texture = new THREE.DataTexture(data, size, size);
    texture.needsUpdate = true;
    return texture;
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

    // unit plane lying in XZ, facing up
    const pool = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
    const poolTexture = createPoolTexture();
    const lampPool = new THREE.MeshBasicMaterial({
        color: 0x000000,
        map: poolTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    applyFog(lampPool, true);


    return {
        geometries: { steelBox: box, concreteBox: box, cable: cylinder, lamp: box, lampPool: pool },
        materials: { steelBox: steel, concreteBox: concrete, cable: steel, lamp, lampPool },
        lampMaterial: lamp,
        lampPoolMaterial: lampPool,
        steelMaterial: steel,
        dispose() {
            box.dispose();
            cylinder.dispose();
            steel.dispose();
            concrete.dispose();
            lamp.dispose();
            pool.dispose();
            poolTexture.dispose();
            lampPool.dispose();
        },
    }
}
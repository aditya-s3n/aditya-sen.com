import * as THREE from "three";




// All part geometries are unit-sized and centered on the origin, with their
// long axis along +Y (BoxGeometry(1,1,1), CylinderGeometry(1,1,1)).
// A matrix then only has to move, rotate and stretch them.
const UP = new THREE.Vector3(0, 1, 0);
const _dir = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();



/** Create Box
 * Centered (x, y, z)
 * size (sz, sy, sz)
 */
export function box(x: number, y: number, z: number, sx: number, sy: number, sz: number) {
    return new THREE.Matrix4().makeScale(sx, sy, sz).setPosition(x, y, z);
}


/** Create a Beam (for cable)
 * startSegment -> endSegement
 * Quaterion for ration around +y axis
 * Width are depth are the radius of cylinder
 */
export function beam(startSegment: THREE.Vector3, endSegment: THREE.Vector3, width: number, depth = width) {
    _dir.subVectors(endSegment, startSegment);

    const length = _dir.length();

    _quat.setFromUnitVectors(UP, _dir.divideScalar(length));
    _mid.addVectors(startSegment, endSegment).multiplyScalar(0.5);
    _scale.set(width, length, depth);


    

    return new THREE.Matrix4().compose(_mid, _quat, _scale);

}
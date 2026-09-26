# 3D models

The bridge is procedural, so no models are required. Put optional detail
props here (glTF binary, `.glb`), e.g. `golden-gate/lamp-post.glb`,
`golden-gate/rivet-plate.glb`. Load them with GLTFLoader through the
engine's LoadingManager so they count toward the loading screen, then use
their geometry in InstancePool (one InstancedMesh per prop).

Compress with Draco or Meshopt (`npx gltf-transform optimize in.glb out.glb`).
If you use Draco, copy `node_modules/three/examples/jsm/libs/draco/gltf/`
to `public/draco/` and call `dracoLoader.setDecoderPath('/draco/')`.

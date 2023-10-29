import { Loader } from "three";
// @ts-ignore
import { GLTFLoader, DRACOLoader, MeshoptDecoder } from "three-stdlib";
import { useLoader } from "@react-three/fiber";

let dracoLoader = null;

let decoderPath = "/draco/";

function extensions(useDraco, useMeshopt, extendLoader) {
  return (loader) => {
    if (extendLoader) {
      extendLoader(loader);
    }
    if (useDraco) {
      if (!dracoLoader) {
        dracoLoader = new DRACOLoader();
      }
      dracoLoader.setDecoderPath(
        typeof useDraco === "string" ? useDraco : decoderPath
      );
      loader.setDRACOLoader(dracoLoader);
    }
    if (useMeshopt) {
      loader.setMeshoptDecoder(
        typeof MeshoptDecoder === "function" ? MeshoptDecoder() : MeshoptDecoder
      );
    }
  };
}

export function useGLTF(path, useDraco, useMeshOpt, extendLoader) {
  const gltf = useLoader(
    GLTFLoader,
    path,
    extensions(useDraco, useMeshOpt, extendLoader)
  );
  return gltf;
}

useGLTF.preload = (path, useDraco, useMeshOpt, extendLoader) =>
  useLoader.preload(
    GLTFLoader,
    path,
    extensions(useDraco, useMeshOpt, extendLoader)
  );

useGLTF.clear = (input) => useLoader.clear(GLTFLoader, input);
useGLTF.setDecoderPath = (path) => {
  decoderPath = path;
};

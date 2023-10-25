import { Canvas } from "@react-three/fiber";
import { Bvh, CameraControls } from "@react-three/drei";

const Scene = () => {
  return (
    <>
      <mesh rotation={[0.3, Math.PI / 3, 0]}>
        <boxGeometry />
        <meshMatcapMaterial />
      </mesh>
      <CameraControls makeDefault />
    </>
  );
};

export default function App() {
  return (
    <Canvas
      // shadows
      orthographic
      camera={{
        position: [0, 0, 10],
        zoom: 100,
        near: 0.01,
      }}
    >
      <Bvh firstHitOnly>
        <Scene />
      </Bvh>
    </Canvas>
  );
}

import { Canvas, useThree } from "@react-three/fiber";
import { Bvh, CameraControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { Color } from "three";

const Scene = () => {
  const { nodes, materials } = useGLTF("/1025_Backdrop.glb");

  const redColor = new Color("hsl(344, 100%, 61%)");
  const blueColor = new Color("hsl(208, 100%, 61%)");
  const greenColor = new Color("hsl(49, 97%, 65%)");
  const yellowColor = new Color("hsl(83, 57%, 47%)");

  const redRef = useRef();
  const blueRef = useRef();
  const greenRef = useRef();
  const yellowRef = useRef();

  const reflection2MatcapTexture = useTexture("matcap_reflection_2.png");

  const circleGroupRef = useRef();
  const { controls } = useThree();

  useEffect(() => {
    if (controls && circleGroupRef.current) {
      controls.fitToSphere(circleGroupRef.current, true);
    }
  }, [controls, circleGroupRef.current]);

  return (
    <>
      <mesh geometry={nodes.Backdrop.geometry}>
        <meshStandardMaterial color={"#efefef"} />
      </mesh>
      <group ref={circleGroupRef}>
        <mesh geometry={nodes.RedSphere.geometry} position={[-3, 2, 0]}>
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={redColor}
          />
        </mesh>
        <mesh geometry={nodes.GreenSphere.geometry} position={[3, 2, 0]}>
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={greenColor}
          />
        </mesh>
        <mesh geometry={nodes.YellowSphere.geometry} position={[-3, -2, 0]}>
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={yellowColor}
          />
        </mesh>
        <mesh geometry={nodes.BlueSphere.geometry} position={[3, -2, 0]}>
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={blueColor}
          />
        </mesh>
      </group>
      <CameraControls
        makeDefault
        mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
        touches={{ one: 0, two: 0, three: 0 }}
        minAzimuthAngle={-0.2}
        maxAzimuthAngle={0.2}
        minPolarAngle={1}
        maxPolarAngle={1.3}
      />
      <pointLight color="#CAD6D7" position={[0, -1, 0]} intensity={10} />
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

useGLTF.preload("/1025_Backdrop.glb");

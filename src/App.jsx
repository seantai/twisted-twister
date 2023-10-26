import {
  Bvh,
  CameraControls,
  Html,
  useGLTF,
  useTexture,
  StatsGl,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Color } from "three";
import { useState } from "react";
import { Box3 } from "three";
import { DragControls } from "three-stdlib";
import { Capsule } from "./components/Capsule";

import { v4 as uuidv4 } from "uuid";

const Scene = () => {
  const {
    controls,
    camera,
    gl: { domElement },
  } = useThree();

  const { nodes } = useGLTF("/1025_Backdrop.glb");

  const draggableObjects = useRef();
  const circleGroupRef = useRef();

  const redRef = useRef();
  const blueRef = useRef();
  const greenRef = useRef();
  const yellowRef = useRef();

  const [redCount, setRedCount] = useState();

  const refsArray = [redRef, blueRef, greenRef, yellowRef];

  const reflection2MatcapTexture = useTexture("matcap_reflection_2.png");

  useEffect(() => {
    if (controls && circleGroupRef.current) {
      controls.fitToSphere(circleGroupRef.current, true);
    }
  }, [controls, circleGroupRef.current]);

  const redColor = new Color("hsl(344, 100%, 61%)");
  const blueColor = new Color("hsl(208, 100%, 61%)");
  const greenColor = new Color("hsl(49, 97%, 65%)");
  const yellowColor = new Color("hsl(83, 57%, 47%)");

  const colors = [redColor, blueColor, greenColor, yellowColor];

  const addMesh = () => {
    setMeshes([<Capsule colors={colors} key={uuidv4()} />]);
  };

  const [meshes, setMeshes] = useState([
    <Capsule colors={colors} key={uuidv4()} />,
  ]);

  useEffect(() => {
    const controls = new DragControls(
      [draggableObjects.current],
      camera,
      domElement
    );

    const handleDrag = (e) => {
      e.object.position.z = 0;
    };

    const handleDragEnd = (e) => {
      const sphereBox = new Box3();
      // const sphereSphere = new Sphere();
      const dragBox = new Box3();
      dragBox.setFromObject(draggableObjects.current);

      const dragColor = e.object.material.color;

      refsArray.forEach((ref) => {
        if (dragColor.equals(ref.current.material.color)) {
          sphereBox.setFromObject(ref.current);
          // sphereSphere.getBoundingBox.setFromObject(ref.current);
        }
      });

      if (dragBox.intersectsBox(sphereBox)) {
        console.log("intersected");
        e.object.position.set(10, 10, 10);
        addMesh();
      }
    };

    controls.addEventListener("drag", handleDrag);
    controls.addEventListener("dragend", handleDragEnd);

    return () => {
      controls.removeEventListener("drag", handleDrag);
      controls.removeEventListener("dragend", handleDragEnd);
      controls.dispose();
    };
  }, []);

  return (
    <>
      <group ref={draggableObjects}>{meshes}</group>
      <mesh geometry={nodes.Backdrop.geometry}>
        <meshStandardMaterial color={"#efefef"} />
      </mesh>
      <group ref={circleGroupRef}>
        <mesh
          ref={redRef}
          geometry={nodes.RedSphere.geometry}
          position={[-3, 2, 0]}
        >
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={redColor}
          />
          <Html transform>
            <div className="text-3xl">3</div>
          </Html>
        </mesh>
        <mesh
          ref={greenRef}
          geometry={nodes.GreenSphere.geometry}
          position={[3, 2, 0]}
        >
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={greenColor}
          />
        </mesh>
        <mesh
          ref={yellowRef}
          geometry={nodes.YellowSphere.geometry}
          position={[-3, -2, 0]}
        >
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={yellowColor}
          />
        </mesh>
        <mesh
          ref={blueRef}
          geometry={nodes.BlueSphere.geometry}
          position={[3, -2, 0]}
        >
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
      {/* <StatsGl /> */}
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

// useGLTF.preload("/1025_Backdrop.glb");

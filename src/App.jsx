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
import { store } from "./store";
import { useSnapshot } from "valtio";
import { AnimatePresence, motion } from "framer-motion";

const Scene = ({ parentRef, startClicked }) => {
  const {
    controls,
    camera,
    // gl: { domElement },
  } = useThree();

  const { nodes } = useGLTF("/1026_BackdropSpheres.glb");

  const snap = useSnapshot(store);

  const draggableObjects = useRef();
  const circleGroupRef = useRef();

  const redRef = useRef();
  const blueRef = useRef();
  const greenRef = useRef();
  const yellowRef = useRef();

  const refsArray = [redRef, blueRef, greenRef, yellowRef];

  const reflection2MatcapTexture = useTexture("matcap_reflection_2.png");

  useEffect(() => {
    if (controls && circleGroupRef.current) {
      controls.fitToSphere(circleGroupRef.current, true);
    }
  }, [controls, circleGroupRef.current]);

  const redColor = new Color("hsl(344, 100%, 61%)");
  const blueColor = new Color("hsl(208, 100%, 61%)");
  const yellowColor = new Color("hsl(49, 97%, 65%)");
  const greenColor = new Color("hsl(83, 57%, 47%)");

  const colors = [redColor, blueColor, greenColor, yellowColor];

  const addMesh = () => {
    setMeshes([
      <Capsule colors={colors} key={uuidv4()} startClicked={startClicked} />,
    ]);
  };

  const [meshes, setMeshes] = useState([
    <Capsule colors={colors} key={uuidv4()} startClicked={startClicked} />,
  ]);

  useEffect(() => {
    if (startClicked) {
      const controls = new DragControls(
        [draggableObjects.current],
        camera,
        parentRef.current
      );

      const handleDrag = (e) => {
        e.object.position.z = 0;
      };

      const handleDragEnd = (e) => {
        const dragBox = new Box3();
        dragBox.setFromObject(e.object);
        const dragColor = e.object.material.color;

        const sphereBox = new Box3();

        refsArray.forEach((ref) => {
          if (dragColor.equals(ref.current.material.color)) {
            sphereBox.setFromObject(ref.current);
            if (dragBox.intersectsBox(sphereBox)) {
              e.object.position.set(10, 10, 10);
              if (ref.current.colorID == "red") {
                if (!store.redCount == 0) {
                  store.redCount = store.redCount - 1;
                } else {
                  // console.log("finished red");
                }
              }
              if (ref.current.colorID == "yellow") {
                if (!store.yellowCount == 0) {
                  store.yellowCount = store.yellowCount - 1;
                } else {
                  // console.log("finished yellow");
                }
              }
              if (ref.current.colorID == "green") {
                if (!store.greenCount == 0) {
                  store.greenCount = store.greenCount - 1;
                } else {
                  // console.log("finished green");
                }
              }
              if (ref.current.colorID == "blue") {
                if (!store.blueCount == 0) {
                  store.blueCount = store.blueCount - 1;
                } else {
                  // console.log("finished blue");
                }
              }
              addMesh();
            }
          }
        });
      };

      controls.addEventListener("drag", handleDrag);
      controls.addEventListener("dragend", handleDragEnd);

      return () => {
        controls.removeEventListener("drag", handleDrag);
        controls.removeEventListener("dragend", handleDragEnd);
        controls.dispose();
      };
    }
  }, [startClicked]);

  useEffect(() => {
    if (
      snap.redCount == 0 &&
      snap.yellowCount == 0 &&
      snap.greenCount == 0 &&
      snap.blueCount == 0
    ) {
      ////fire off the meshline stuff here
      alert("u win");
    }
  }, [snap.redCount, snap.yellowCount, snap.blueCount, snap.greenCount]);

  useEffect(() => {
    store.loaded = true;
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
          colorID="red"
          geometry={nodes.RedSphere.geometry}
          position={[-3, 2, 0]}
        >
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={redColor}
          />
          <Html transform>
            <AnimatePresence mode="wait">
              <motion.div
                key={snap.redCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 2 }}
                className="text-3xl"
              >
                {snap.redCount}
              </motion.div>
            </AnimatePresence>
          </Html>
        </mesh>
        <mesh
          ref={yellowRef}
          colorID="yellow"
          geometry={nodes.YellowSphere.geometry}
          position={[-3, -2, 0]}
        >
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={yellowColor}
          />
          <Html transform>
            <AnimatePresence mode="wait">
              <motion.div
                key={snap.yellowCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 2 }}
                className="text-3xl"
              >
                {snap.yellowCount}
              </motion.div>
            </AnimatePresence>
          </Html>
        </mesh>
        <mesh
          ref={greenRef}
          colorID="green"
          geometry={nodes.GreenSphere.geometry}
          position={[3, 2, 0]}
        >
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={greenColor}
          />
          <Html transform>
            <AnimatePresence mode="wait">
              <motion.div
                key={snap.greenCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 2 }}
                className="text-3xl"
              >
                {snap.greenCount}
              </motion.div>
            </AnimatePresence>
          </Html>
        </mesh>

        <mesh
          ref={blueRef}
          colorID="blue"
          geometry={nodes.BlueSphere.geometry}
          position={[3, -2, 0]}
        >
          <meshMatcapMaterial
            matcap={reflection2MatcapTexture}
            color={blueColor}
          />
          <Html transform>
            <AnimatePresence mode="wait">
              <motion.div
                key={snap.blueCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 2 }}
                className="text-3xl"
              >
                {snap.blueCount}
              </motion.div>
            </AnimatePresence>
          </Html>
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
  const parentRef = useRef();
  const snap = useSnapshot(store);
  const [startClicked, setStartClicked] = useState(false);

  return (
    <div
      ref={parentRef}
      className="fixed inset-0 h-full w-full overflow-hidden"
    >
      <div
        onClick={() => {}}
        className="fixed bottom-0 left-0 right-0 top-0 z-10 flex  flex-col items-center justify-center"
      >
        {!startClicked && snap.loaded && (
          <motion.div
            whileHover={{ fontSize: "1.4rem" }}
            initial={{ scale: 0, fontSize: "1.85rem" }}
            animate={{ scale: 1 }}
            className="cursor-pointer text-3xl"
            onClick={() => setStartClicked(true)}
          >
            START
          </motion.div>
        )}
      </div>
      <Canvas
        className="pointer-events-none h-full w-full"
        eventSource={parentRef}
        orthographic
        camera={{
          position: [0, 0, 10],
          zoom: 100,
          near: 0.01,
        }}
      >
        {/* <Bvh firstHitOnly> */}
        <Scene parentRef={parentRef} startClicked={startClicked} />
        {/* </Bvh> */}
      </Canvas>
    </div>
  );
}

useGLTF.preload("/1025_Backdrop.glb");

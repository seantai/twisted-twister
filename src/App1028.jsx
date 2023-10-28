import {
  CameraControls,
  Html,
  StatsGl,
  Svg,
  useGLTF,
  useTexture,
  useHelper,
  Bvh,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Box3, Color, BoxHelper } from "three";
import { DragControls } from "./components/CustomDragControls";
import { Capsule } from "./components/Capsule";

import { AnimatePresence, motion, cubicBezier } from "framer-motion";
import { motion as m } from "framer-motion-3d";
import { v4 as uuidv4 } from "uuid";
import { subscribe, useSnapshot } from "valtio";
import { store } from "./store";
import { MyTimer } from "./components/Timer";
import useSound from "use-sound";
import clsx from "clsx";
import { Sock } from "./components/Sock";
import { Hand } from "./components/Hand";

const Scene = ({ parentRef }) => {
  const {
    controls,
    camera,
    // scene,
    // gl: { domElement },
  } = useThree();

  const { nodes } = useGLTF("/1026_BackdropSpheres.glb");
  const Dump = useGLTF("./1026_Dump-transformed.glb");

  const snap = useSnapshot(store);
  // console.log(snap.start);

  const draggableObjects = useRef();
  const circleGroupRef = useRef();

  const redRef = useRef();
  const blueRef = useRef();
  const greenRef = useRef();
  const yellowRef = useRef();

  const dumpRef = useRef();

  const refsArray = [redRef, blueRef, greenRef, yellowRef];

  const reflection2MatcapTexture = useTexture("matcap_reflection_2.png");

  useEffect(() => {
    if (controls && circleGroupRef.current) {
      controls.fitToSphere(circleGroupRef.current, true);
    }
  }, [controls, circleGroupRef.current]);

  const [playStart] = useSound("0926_Enter.mp3");
  const [playSuccess1] = useSound("0926_Klick1_gained.mp3");
  const [playDump] = useSound("1027_Swoosh2.mp3");

  useEffect(() => {
    if (snap.start) {
      console.log("start");
      // console.log(controls.azimuthAngle);
      // console.log(controls.polarAngle);

      controls.fitToBox(circleGroupRef.current, true, {
        paddingBottom: 0,
        paddingTop: 2,
        paddingLeft: 1,
        paddingRight: 1,
      });
      controls.rotateTo(0, Math.PI, true);

      playStart();
    }
  }, [snap.start]);

  const redColor = new Color("hsl(344, 100%, 61%)");
  const blueColor = new Color("hsl(208, 100%, 61%)");
  const yellowColor = new Color("hsl(49, 97%, 65%)");
  const greenColor = new Color("hsl(83, 57%, 47%)");

  const colors = [redColor, blueColor, greenColor, yellowColor];

  const addMesh = () => {
    // const newMesh =
    //   Math.random() > 0.5
    //     ? { type: "Sock", colors: colors }
    //     : { type: "Hand", colors: colors };

    const newMesh = { type: "Capsule", colors: colors };
    setMeshes(() => [newMesh]);
  };

  const [meshes, setMeshes] = useState([{ type: "Capsule", colors: colors }]);

  // const addMesh = () => {
  //   Math.random() > 0.5
  //     ? setMeshes([<Sock colors={colors} key={uuidv4()} />])
  //     : setMeshes([<Hand colors={colors} key={uuidv4()} />]);
  // };

  // const [meshes, setMeshes] = useState([
  //   <Capsule colors={colors} key={uuidv4()} />,
  // ]);

  // useHelper(dumpRef, BoxHelper);
  // useHelper(yellowRef, BoxHelper);
  // useHelper(greenRef, BoxHelper);
  // useHelper(redRef, BoxHelper);
  // useHelper(blueRef, BoxHelper);

  useEffect(() => {
    if (snap.start) {
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

        //dump
        if (dumpRef.current) {
          const dumpBox = new Box3();
          dumpBox.setFromObject(dumpRef.current);
          if (dragBox.intersectsBox(dumpBox)) {
            playDump();
            addMesh();
          }
        }

        //spheres
        refsArray.forEach((ref) => {
          if (dragColor.equals(ref.current.material.color)) {
            sphereBox.setFromObject(ref.current);
            if (dragBox.intersectsBox(sphereBox)) {
              // if (ref.current.colorID == "red") {
              //   if (!snap.redCount == 0) {
              //     store.redCount = snap.redCount - 1;
              //     playSuccess1();
              //     addMesh();
              //   }
              // }
              // if (ref.current.colorID == "yellow") {
              //   if (!snap.yellowCount == 0) {
              //     store.yellowCount = snap.yellowCount - 1;
              //     playSuccess1();
              //     addMesh();
              //   }
              // }
              // if (ref.current.colorID == "green") {
              //   if (!snap.greenCount == 0) {
              //     store.greenCount = snap.greenCount - 1;
              //     playSuccess1();
              //     addMesh();
              //   }
              // }
              // if (ref.current.colorID == "blue") {
              //   if (!snap.blueCount == 0) {
              //     store.blueCount = snap.blueCount - 1;
              //     playSuccess1();
              //     addMesh();
              //   }
              // }
              // console.log("ok");
              // if (ref.current.colorID == "red" && snap.redCount > 0) {
              //   store.redCount = snap.redCount - 1;
              //   setTimeout(checkAndResetCounts, 0);
              //   playSuccess1();
              //   addMesh();
              // }
              // if (ref.current.colorID == "yellow" && snap.yellowCount > 0) {
              //   store.yellowCount = snap.yellowCount - 1;
              //   setTimeout(checkAndResetCounts, 0);
              //   playSuccess1();
              //   addMesh();
              // }
              // if (ref.current.colorID == "green" && snap.greenCount > 0) {
              //   store.greenCount = snap.greenCount - 1;
              //   setTimeout(checkAndResetCounts, 0);
              //   playSuccess1();
              //   addMesh();
              // }
              // if (ref.current.colorID == "blue" && snap.blueCount > 0) {
              //   store.blueCount = snap.blueCount - 1;
              //   setTimeout(checkAndResetCounts, 0);
              //   playSuccess1();
              //   addMesh();
              // }
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
  }, [snap.start]);

  // useEffect(() => {
  //   if (
  //     snap.redCount === 0 &&
  //     snap.yellowCount === 0 &&
  //     snap.greenCount === 0 &&
  //     snap.blueCount === 0
  //   ) {
  //     // End the game and reset the counts
  //     // store.redCount = 3;
  //     // store.yellowCount = 3;
  //     // store.greenCount = 3;
  //     // store.blueCount = 3;

  //     setTimeout(() => {
  //       store.redCount = 3;
  //       store.yellowCount = 3;
  //       store.greenCount = 3;
  //       store.blueCount = 3;
  //       // Add your game end logic here
  //     }, 100); // Adjust the delay as needed
  //     // Add your game end logic here
  //   }
  // }, [snap.redCount, snap.yellowCount, snap.greenCount, snap.blueCount]);

  // function checkAndResetCounts() {
  //   if (
  //     store.redCount === 0 &&
  //     store.yellowCount === 0 &&
  //     store.greenCount === 0 &&
  //     store.blueCount === 0
  //   ) {
  //     // End the game and reset the counts
  //     store.redCount = 3;
  //     store.yellowCount = 3;
  //     store.greenCount = 3;
  //     store.blueCount = 3;
  //     // Add your game end logic here
  //   }
  // }
  // // useEffect(() => {
  //   // Subscribe to changes in store.blueCount
  //   const unsubscribe = subscribe(store, () => {
  //     if (
  //       snap.redCount == 0 &&
  //       snap.yellowCount == 0 &&
  //       snap.greenCount == 0 &&
  //       snap.blueCount == 0
  //     ) {
  //       store.level = snap.level + 1;
  //     }
  //     console.log(snap.blueCount); // This will always log the latest value
  //     console.log(snap.level); // This will always log the latest value
  //   });

  //   // Cleanup function
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [snap.level]);

  // useEffect(() => {
  //   if (
  //     snap.redCount == 0 &&
  //     snap.yellowCount == 0 &&
  //     snap.greenCount == 0 &&
  //     snap.blueCount == 0
  //   ) {
  //     ////fire off the meshline stuff here
  //     // alert("u win");
  //     //show  moda o rosometing
  //     // shut off tomimer.
  //     // store.finished = true;
  //     // store.start = false;
  //     // store.showStart = true;
  //     // snap.roundTimeLength

  //     // if (snap.level == 1) {
  //     //   store.level = 2;
  //     // }
  //     store.level = snap.level + 1;
  //   }
  // }, [snap.redCount, snap.yellowCount, snap.blueCount, snap.greenCount]);

  // useEffect(() => {
  //   console.log(snap.level);
  //   if (snap.level > 1) {
  //     switch (snap.level) {
  //       case 2:
  //         //  preload level 2
  //         store.yellowCount = 3;
  //         store.blueCount = 3;
  //         store.redCount = 3;
  //         store.greenCount = 3;
  //       default:
  //         return;
  //     }
  //   }
  // }, [snap.level]);

  // useEffect(() => {
  //   if (snap.resume) {
  //     console.log("resume");
  //   }
  // }, [snap.resume]);

  // useEffect(() => {
  //   if (snap.redCount == 0) {
  //     addMesh();
  //   }
  // }, [snap.redCount]);

  useEffect(() => {
    store.loaded = true;
    console.log("loaded");
  }, []);

  return (
    <>
      <group ref={draggableObjects}>
        {meshes.map((mesh, index) => {
          switch (mesh.type) {
            case "Capsule":
              return <Capsule colors={mesh.colors} key={uuidv4()} />;
            // case "Sock":
            //   return <Sock colors={mesh.colors} key={index} />;
            // case "Hand":
            //   return <Hand colors={mesh.colors} key={index} />;
            default:
              return null;
          }
        })}
      </group>
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
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: snap.start ? 1 : 0,
                  opacity: snap.expired ? 0 : 1,
                }}
                exit={{ scale: 1.5 }}
                transition={{ ease: cubicBezier(0.34, 1.56, 0.64, 1) }}
                className="text-3xl"
              >
                {store.redCount}
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
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: snap.start ? 1 : 0,
                  opacity: snap.showModal ? 0 : 1,
                }}
                exit={{ scale: 1.5 }}
                transition={{ ease: cubicBezier(0.34, 1.56, 0.64, 1) }}
                className="text-3xl"
              >
                {store.yellowCount}
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
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: snap.start ? 1 : 0,
                  opacity: snap.showModal ? 0 : 1,
                }}
                exit={{ scale: 1.5 }}
                transition={{ ease: cubicBezier(0.34, 1.56, 0.64, 1) }}
                className="text-3xl"
              >
                {store.greenCount}
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
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: snap.start ? 1 : 0,
                  opacity: snap.showModal ? 0 : 1,
                }}
                exit={{ scale: 1.5 }}
                transition={{ ease: cubicBezier(0.34, 1.56, 0.64, 1) }}
                className="text-3xl"
              >
                {store.blueCount}
              </motion.div>
            </AnimatePresence>
          </Html>
        </mesh>
      </group>
      <m.mesh
        initial={{ scale: 0 }}
        animate={{ scale: snap.start ? 1 : 0 }}
        ref={dumpRef}
        geometry={Dump.nodes.Dump.geometry}
        //this will depend on final meshes
        position={[0, 3, 0.7]}
      >
        <meshMatcapMaterial matcap={reflection2MatcapTexture} side={2} />
      </m.mesh>
      <CameraControls
        makeDefault
        polarAngle={1.9412172877096}
        azimuthAngle={-0.4080060034431936}
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

  return (
    <>
      {/* {snap.expired && ( */}
      <div
        className={clsx(
          "pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-0 backdrop-blur-xl"
          // "pointer-events-auto opacity-100"
        )}
      ></div>
      {/* )} */}
      <div
        ref={parentRef}
        className="fixed inset-0 h-full w-full overflow-hidden"
      >
        <div
          // onClick={() => {}}
          className="pointer-events-auto fixed bottom-0 left-0 right-0 top-0 z-10 flex  flex-col items-center justify-center"
        >
          {snap.loaded && snap.showStart && (
            <div className="cursor-pointer rounded-sm border-2 bg-slate-700/60 px-5 py-2 text-3xl text-slate-100">
              <motion.div
                whileHover={{ scale: 0.9, transition: { duration: 0.07 } }}
                initial={{ scale: 0, fontSize: "1.85rem" }}
                animate={{ scale: 1 }}
                onClick={() => {
                  switch (snap.level) {
                    case 1:
                      // store.start = true;
                      // store.showStart = false;
                      break;
                    case 2:
                      // store.start = true;
                      // store.redCount = 1;
                      // store.roundTimeLength = 35;
                      // store.expired = false;
                      // store.resume = true;

                      break;
                    default:
                      break;
                  }
                }}
              >
                START
              </motion.div>
            </div>
          )}
        </div>
        {/* ////////////////////////////////// */}
        <MyTimer />
        {/* ////////////////////////////////// */}
        <Canvas
          className="pointer-events-none h-full w-full"
          eventSource={parentRef}
          orthographic
          camera={{
            // rotation: [0, 0, 0],
            position: [0, 0, 10],
            zoom: 100,
            near: 0.01,
          }}
        >
          <Bvh firstHitOnly>
            <Scene parentRef={parentRef} />
          </Bvh>
        </Canvas>
      </div>
    </>
  );
}

useGLTF.preload("/1026_BackdropSpheres.glb");
useGLTF.preload("/1026_Dump.glb");

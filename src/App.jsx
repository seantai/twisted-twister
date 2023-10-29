import {
  CameraControls,
  Html,
  StatsGl,
  useGLTF,
  useTexture,
  // useHelper,
  Bvh,
} from "@react-three/drei";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box3,
  Color,
  // BoxHelper,
  MathUtils,
  Vector3,
  CatmullRomCurve3,
} from "three";
import { DragControls } from "./components/CustomDragControls";
import { Capsule } from "./components/Capsule";
import { MyTimer } from "./components/Timer";

import { motion, cubicBezier } from "framer-motion";
import { motion as m } from "framer-motion-3d";

import { useSnapshot } from "valtio";
import { store } from "./store";

import { v4 as uuidv4 } from "uuid";
import useSound from "use-sound";

import { MeshLineGeometry, MeshLineMaterial } from "meshline";
extend({ MeshLineGeometry, MeshLineMaterial });

import startAudio from "/0926_Enter.mp3";
import success1Audio from "/0926_Klick1_gained.mp3";
import dumpAudio from "/1027_Swoosh2.mp3";
import levelCompleteAudio from "/1028_LevelComplete.mp3";

const Scene = ({ parentRef, addTimer }) => {
  const { controls, camera } = useThree();

  const { nodes } = useGLTF("./1026_BackdropSpheres.glb");
  const Dump = useGLTF("./1026_Dump-transformed.glb");

  const snap = useSnapshot(store);

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

  const [playStart] = useSound(startAudio);
  const [playSuccess1] = useSound(success1Audio);
  const [playDump] = useSound(dumpAudio);
  const [playLevelComplete] = useSound(levelCompleteAudio);

  useEffect(() => {
    if (snap.gameOn) {
      // console.log("start");
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
  }, [snap.gameOn]);

  const redColor = new Color("hsl(344, 100%, 61%)");
  const blueColor = new Color("hsl(208, 100%, 61%)");
  const yellowColor = new Color("hsl(49, 97%, 65%)");
  const greenColor = new Color("hsl(83, 57%, 47%)");

  const colors = [redColor, blueColor, greenColor, yellowColor];

  const addMesh = () => {
    const newMesh = { type: "Capsule", colors: colors };
    setMeshes(() => [newMesh]);
  };

  const [meshes, setMeshes] = useState([{ type: "Capsule", colors: colors }]);

  // useHelper(dumpRef, BoxHelper);
  // useHelper(yellowRef, BoxHelper);
  // useHelper(greenRef, BoxHelper);
  // useHelper(redRef, BoxHelper);
  // useHelper(blueRef, BoxHelper);

  useEffect(() => {
    if (snap.playDump) {
      playDump();
      store.playDump = false;
    }
  }, [snap.playDump]);

  useEffect(() => {
    if (snap.playSuccess1) {
      playSuccess1();
      store.playSuccess1 = false;
    }
  }, [snap.playSuccess1]);

  useEffect(() => {
    if (snap.playLevelComplete) {
      playLevelComplete();
      store.playLevelComplete = false;
    }
  }, [snap.playLevelComplete]);

  useEffect(() => {
    if (true) {
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
            store.playDump = true;
            addMesh();
          }
        }

        //spheres
        refsArray.forEach((ref) => {
          if (dragColor.equals(ref.current.material.color)) {
            sphereBox.setFromObject(ref.current);
            if (dragBox.intersectsBox(sphereBox)) {
              if (ref.current.colorID == "red") {
                if (store.redCount !== 0) {
                  store.redCount = store.redCount - 1;
                  addMesh();
                  store.playSuccess1 = true;
                }
              }
              if (ref.current.colorID == "yellow") {
                if (store.yellowCount !== 0) {
                  store.yellowCount = store.yellowCount - 1;
                  addMesh();
                  store.playSuccess1 = true;
                }
              }
              if (ref.current.colorID == "green") {
                if (store.greenCount !== 0) {
                  store.greenCount = store.greenCount - 1;
                  addMesh();
                  store.playSuccess1 = true;
                }
              }
              if (ref.current.colorID == "blue") {
                if (store.blueCount !== 0) {
                  store.blueCount = store.blueCount - 1;
                  addMesh();
                  store.playSuccess1 = true;
                }
              }
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
  }, []);

  useEffect(() => {
    if (
      snap.redCount == 0 &&
      snap.yellowCount == 0 &&
      snap.greenCount === 0 &&
      snap.blueCount === 0
    ) {
      // console.log("everything 0");
      store.playLevelComplete = true;
      store.gameOn = false;
      store.showContinue = true;
      store.showConfetti = true;

      switch (snap.level) {
        case 1:
          store.yellowCount = 1;
          store.blueCount = 1;
          store.redCount = 2;
          store.greenCount = 2;
          store.level = 2;
          addTimer(30);
          break;

        case 2:
          store.yellowCount = 2;
          store.blueCount = 2;
          store.redCount = 2;
          store.greenCount = 1;
          store.level = 3;
          addTimer(30);
          break;

        case 3:
          store.yellowCount = 3;
          store.blueCount = 3;
          store.redCount = 2;
          store.greenCount = 3;
          store.level = 4;
          addTimer(30);
          break;

        case 4:
          store.yellowCount = 3;
          store.blueCount = 4;
          store.redCount = 2;
          store.greenCount = 3;
          store.level = 5;
          addTimer(30);
          break;

        case 5:
          store.yellowCount = 5;
          store.blueCount = 4;
          store.redCount = 2;
          store.greenCount = 3;
          store.level = 6;
          addTimer(30);
          break;

        case 6:
          store.yellowCount = 5;
          store.blueCount = 4;
          store.redCount = 4;
          store.greenCount = 5;
          store.level = 7;
          addTimer(30);
          break;
        case 7:
          store.yellowCount = 5;
          store.blueCount = 4;
          store.redCount = 4;
          store.greenCount = 5;
          store.level = 8;
          addTimer(25);
          break;
        case 8:
          store.level = 9;
          break;

        default:
          return;
      }
    }
  }, [snap.redCount, snap.yellowCount, snap.greenCount, snap.blueCount]);

  useEffect(() => {
    if (snap.timerExpired) {
      store.gameOn = false;
      store.showContinue = true;

      // console.log(snap.level, snap.level - 1);
      switch (snap.level - 1) {
        case 0:
          store.yellowCount = 1;
          store.blueCount = 1;
          store.redCount = 1;
          store.greenCount = 1;

          break;
        case 1:
          store.yellowCount = 1;
          store.blueCount = 1;
          store.redCount = 2;
          store.greenCount = 2;

          break;
        case 2:
          store.yellowCount = 2;
          store.blueCount = 2;
          store.redCount = 2;
          store.greenCount = 1;

          break;
        case 3:
          store.yellowCount = 3;
          store.blueCount = 3;
          store.redCount = 2;
          store.greenCount = 3;

          break;
        case 4:
          store.yellowCount = 3;
          store.blueCount = 4;
          store.redCount = 2;
          store.greenCount = 3;

          break;
        case 5:
          store.yellowCount = 5;
          store.blueCount = 4;
          store.redCount = 2;
          store.greenCount = 3;

          break;
        case 6:
          store.yellowCount = 5;
          store.blueCount = 4;
          store.redCount = 4;
          store.greenCount = 5;
          break;

        case 7:
          store.yellowCount = 5;
          store.blueCount = 4;
          store.redCount = 4;
          store.greenCount = 5;
          break;

        default:
          return;
      }
    }
  }, [snap.timerExpired]);

  useEffect(() => {
    store.loaded = true;
    // console.log("loaded");
  }, []);

  return (
    <>
      <group ref={draggableObjects}>
        {meshes.map((mesh) => {
          switch (mesh.type) {
            case "Capsule":
              return <Capsule colors={mesh.colors} key={uuidv4()} />;
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
            <motion.div
              key={snap.redCount}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: snap.gameOn ? 1 : 0,
                opacity: snap.showCount ? 1 : 0,
              }}
              transition={{ ease: cubicBezier(0.34, 1.56, 0.64, 1) }}
              className="font-fira text-3xl"
            >
              {snap.redCount}
            </motion.div>
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
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: snap.gameOn ? 1 : 0,
                opacity: snap.showCount ? 1 : 0,
              }}
              transition={{ ease: cubicBezier(0.34, 1.56, 0.64, 1) }}
              className="font-fira text-3xl"
            >
              {snap.yellowCount}
            </motion.div>
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
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: snap.gameOn ? 1 : 0,
                opacity: snap.showCount ? 1 : 0,
              }}
              transition={{ ease: cubicBezier(0.34, 1.56, 0.64, 1) }}
              className="font-fira text-3xl"
            >
              {snap.greenCount}
            </motion.div>
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
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: snap.gameOn ? 1 : 0,
                opacity: snap.showCount ? 1 : 0,
              }}
              transition={{ ease: cubicBezier(0.34, 1.56, 0.64, 1) }}
              className="font-fira text-3xl"
            >
              {snap.blueCount}
            </motion.div>
          </Html>
        </mesh>
      </group>
      <m.mesh
        initial={{ scale: 0 }}
        animate={{ scale: snap.gameOn ? 1 : 0 }}
        ref={dumpRef}
        geometry={Dump.nodes.Dump.geometry}
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
      <pointLight color="#CAD6D7" position={[0, -1, 2]} intensity={12} />
      {snap.showConfetti && (
        <m.group
          initial={{ scale: 0 }}
          animate={{ scale: snap.showConfetti ? 1 : 0 }}
          position={[0, 0, -6]}
        >
          <Lines
            dash={0.9}
            count={50}
            radius={4}
            colors={[redColor, blueColor, yellowColor, greenColor]}
          />
        </m.group>
      )}
      {/* <StatsGl /> */}
    </>
  );
};

function Lines({
  dash,
  count,
  colors,
  radius = 50,
  rand = MathUtils.randFloatSpread,
}) {
  const lines = useMemo(() => {
    return Array.from({ length: count }, () => {
      const pos = new Vector3(rand(radius), rand(radius), rand(radius));
      const points = Array.from({ length: 10 }, () =>
        pos.add(new Vector3(rand(radius), rand(radius), rand(radius))).clone()
      );
      const curve = new CatmullRomCurve3(points).getPoints(300);
      return {
        color: colors[parseInt(colors.length * Math.random())],
        width: Math.max(radius / 100, (radius / 50) * Math.random()),
        speed: Math.max(0.1, 1 * Math.random()),
        curve: curve.flatMap((point) => point.toArray()),
      };
    });
  }, [colors, count, radius]);
  return lines.map((props, index) => (
    <Fatline key={index} dash={dash} {...props} />
  ));
}

function Fatline({ curve, width, color, speed, dash }) {
  const ref = useRef();
  useFrame(
    (state, delta) => (ref.current.material.dashOffset -= (delta * speed) / 10)
  );
  return (
    <mesh ref={ref}>
      <meshLineGeometry points={curve} />
      <meshLineMaterial
        transparent
        lineWidth={width}
        color={color}
        depthWrite={false}
        dashArray={0.25}
        dashRatio={dash}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function App() {
  const parentRef = useRef();
  const snap = useSnapshot(store);

  const [timer, setTimer] = useState([{ time: 30 }]);

  const addTimer = (time) => {
    const newTimer = { time: time };
    setTimer([newTimer]);
  };

  return (
    <>
      <div
        ref={parentRef}
        className="fixed inset-0 h-full w-full overflow-hidden"
      >
        <div className="pointer-events-auto fixed bottom-0 left-0 right-0 top-0 z-10 flex flex-col items-center justify-center">
          {snap.loaded && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: !snap.gameOn ? 1 : 0 }}
              className="cursor-pointer rounded-xl border-2 bg-slate-700/80 px-5 py-2 text-3xl text-slate-100"
              onClick={() => {
                // console.log(snap.level);
                switch (snap.level) {
                  case 1:
                    store.gameOn = true;
                    store.showCount = true;
                    store.showConfetti = false;
                    store.timerExpired = false;
                    store.showTutorial = false;
                    break;
                  case 2:
                    store.gameOn = true;
                    store.showConfetti = false;
                    store.timerExpired = false;
                    break;
                  case 3:
                    store.gameOn = true;
                    store.showConfetti = false;
                    store.timerExpired = false;
                    break;
                  case 4:
                    store.gameOn = true;
                    store.showConfetti = false;
                    store.timerExpired = false;
                    break;
                  case 5:
                    store.gameOn = true;
                    store.showConfetti = false;
                    store.timerExpired = false;
                    break;
                  case 6:
                    store.gameOn = true;
                    store.showConfetti = false;
                    store.timerExpired = false;
                    break;
                  case 7:
                    store.gameOn = true;
                    store.showConfetti = false;
                    store.timerExpired = false;
                    break;
                  case 8:
                    store.gameOn = true;
                    store.showConfetti = false;
                    store.timerExpired = false;
                    break;
                  // case 7:
                  //   store.gameOn = true;
                  //   store.showConfetti = false;
                  //   break;
                  default:
                    break;
                }
              }}
            >
              <motion.div
                whileHover={{ scale: 0.9, transition: { duration: 0.07 } }}
                initial={{ scale: 0, fontSize: "1.85rem" }}
                animate={{ scale: 1 }}
                className="font-fira"
              >
                {!snap.showContinue && "START"}
                {snap.showContinue && snap.level !== 9 && "CONTINUE"}
                {snap.level == 9 && "GG!"}
              </motion.div>
            </motion.div>
          )}
        </div>
        {/* ////////////////////////////////// */}
        {timer.map((timer) => {
          return <MyTimer time={timer.time} key={uuidv4()} />;
        })}
        {/* ////////////////////////////////// */}
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
          <Bvh firstHitOnly>
            <Scene parentRef={parentRef} addTimer={addTimer} />
          </Bvh>
        </Canvas>
      </div>
      <div className="fixed right-4 top-4 z-30">
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="z-30 flex px-2 py-[1px] text-center font-super text-4xl text-slate-50"
          transition={{ scale: { delay: 1.3 }, opacity: { duration: 0.4 } }}
        >
          <div className="text-slate-300">Twisted&nbsp;</div>
          <div className="">Twister</div>
        </motion.div>
      </div>
      <div className="fixed bottom-10 left-0 right-0 z-30 ">
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: !snap.gameOn && snap.showTutorial ? 1 : 0,
            opacity: !snap.gameOn && snap.showTutorial ? 1 : 0,
          }}
          className="px-2 text-center font-fira text-2xl text-slate-50"
          transition={{ scale: { delay: 1.3 }, opacity: { duration: 0.4 } }}
        >
          <div className="text-slate-300">Drag & Match Color</div>
        </motion.div>
      </div>
    </>
  );
}

useGLTF.preload("/1026_BackdropSpheres.glb");
useGLTF.preload("/1026_Dump-transformed.glb");

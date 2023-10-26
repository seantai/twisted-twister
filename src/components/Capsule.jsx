import { useTexture, useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { motion } from "framer-motion-3d";
import { store } from "../store";
import { useSnapshot } from "valtio";

export const Capsule = (props) => {
  const snap = useSnapshot(store);
  const randomColor = useRef(
    props.colors[Math.floor(Math.random() * props.colors.length)]
  );
  const randomOrder = useRef([...props.colors]);
  randomOrder.current.sort(() => Math.random() - 0.5);

  const reflection2MatcapTexture = useTexture("matcap_reflection_2.png");

  const capsuleRef = useRef();
  const [spinning, setSpinning] = useState(true);
  const [colorChange, setColorChange] = useState(true);
  const [hovered, setHovered] = useState(false);

  useCursor(hovered, "all-scroll");

  useFrame((state, delta) => {
    if (capsuleRef.current) {
      spinning && (capsuleRef.current.rotation.y += 25 * delta);
      let rotation = capsuleRef.current.rotation.y % (Math.PI * 8);
      let rotationNormalized = normalizeRadians(rotation, 0, Math.PI * 8, 0, 1);
      // console.log(rotationNormalized);
      if (colorChange) {
        if (rotationNormalized > 0 && rotationNormalized <= 0.25) {
          capsuleRef.current.material.color = randomOrder.current[0];
        } else if (rotationNormalized > 0.25 && rotationNormalized <= 0.5) {
          capsuleRef.current.material.color = randomOrder.current[1];
        } else if (rotationNormalized > 0.5 && rotationNormalized <= 0.75) {
          capsuleRef.current.material.color = randomOrder.current[2];
        } else if (rotationNormalized > 0.75 && rotationNormalized <= 0.99) {
          capsuleRef.current.material.color = randomOrder.current[3];
        } else {
          return;
        }
      }
    }
  });
  return (
    <motion.mesh
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onPointerDown={() => {
        setSpinning(false);
        setColorChange(false);
        // setHovered(true);
      }}
      onPointerUp={() => {
        setSpinning(true);
      }}
      onPointerOver={() => {
        snap.start && setHovered(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
      }}
      ref={capsuleRef}
      rotation-z={0.1}
      position={[0, 0, 1.2]}
    >
      <capsuleGeometry />
      <meshMatcapMaterial
        matcap={reflection2MatcapTexture}
        color={randomColor.current}
      />
    </motion.mesh>
  );
};

function normalizeRadians(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

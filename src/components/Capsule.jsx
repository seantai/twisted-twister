import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { motion } from "framer-motion-3d";

export const Capsule = (props) => {
  const randomColor = useRef(
    props.colors[Math.floor(Math.random() * props.colors.length)]
  );
  const randomOrder = useRef([...props.colors]);
  randomOrder.current.sort(() => Math.random() - 0.5);

  const reflection2MatcapTexture = useTexture("matcap_reflection_2.png");

  const capsuleRef = useRef();
  const [spinning, setSpinning] = useState(true);
  const [colorChange, setColorChange] = useState(true);

  useFrame((state, delta) => {
    if (capsuleRef.current) {
      spinning && (capsuleRef.current.rotation.y += 15 * delta);
      let rotation = capsuleRef.current.rotation.y % (Math.PI * 8);
      let rotationNormalized = normalizeRadians(rotation, 0, Math.PI * 8, 0, 1);
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
      animate={{ scale: 0.7, transition: { duration: 0.2 } }}
      onPointerDown={() => {
        setSpinning(false);
        setColorChange(false);
      }}
      onPointerLeave={() => {
        setSpinning(true);
      }}
      ref={capsuleRef}
      rotation-z={0.1}
    >
      <capsuleGeometry args={[1, 1, 4, 40]} />
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

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export const Capsule = (props) => {
  const randomColor = useRef(
    props.colors[Math.floor(Math.random() * props.colors.length)]
  );
  const randomOrder = useRef([...props.colors]);
  randomOrder.current.sort(() => Math.random() - 0.5);
  // console.log(randomOrder.current[0]);

  const reflection2MatcapTexture = useTexture("matcap_reflection_2.png");

  const capsuleRef = useRef();
  const [pointerDown, setPointerDown] = useState(false);
  // console.log(randomOrder)

  useFrame((state, delta) => {
    if (capsuleRef.current && !pointerDown) {
      // capsuleRef.current.rotation.y += 25 * delta;
      let rotation = capsuleRef.current.rotation.y % (Math.PI * 8);
      let rotationNormalized = normalizeRadians(rotation, 0, Math.PI * 8, 0, 1);
      // console.log(rotationNormalized);
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
  });
  return (
    <mesh
      onPointerDown={() => {
        setPointerDown(true);
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
    </mesh>
  );
};

function normalizeRadians(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export const Capsule = (props) => {
  const randomColor = useRef(
    props.colors[Math.floor(Math.random() * props.colors.length)]
  );
  const reflection2MatcapTexture = useTexture("matcap_reflection_2.png");

  const capsuleRef = useRef();
  const [pointerDown, setPointerDown] = useState(false);

  useFrame((state, delta) => {
    if (capsuleRef.current && !pointerDown) {
      capsuleRef.current.rotation.y += 25 * delta;
      let rotation = capsuleRef.current.rotation.y % (Math.PI * 8);
      let rotationNormalized = normalizeRadians(rotation, 0, Math.PI * 8, 0, 1);
      // console.log(rotationNormalized);
      if (rotationNormalized > 0 && rotationNormalized <= 0.25) {
        capsuleRef.current.material.color = props.colors[0];
      } else if (rotationNormalized > 0.25 && rotationNormalized <= 0.5) {
        capsuleRef.current.material.color = props.colors[1];
      } else if (rotationNormalized > 0.5 && rotationNormalized <= 0.75) {
        capsuleRef.current.material.color = props.colors[2];
      } else if (rotationNormalized > 0.75 && rotationNormalized <= 0.99) {
        capsuleRef.current.material.color = props.colors[3];
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

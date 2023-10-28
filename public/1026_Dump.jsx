/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 1026_Dump.glb -T
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/1026_Dump-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Dump.geometry} material={nodes.Dump.material} />
    </group>
  )
}

useGLTF.preload('/1026_Dump-transformed.glb')
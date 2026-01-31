import React, { Suspense } from 'react'
import { technologies } from "../../utils/index"
import { Canvas } from '@react-three/fiber'
import { Decal, Float, OrbitControls, Preload, useTexture, } from '@react-three/drei'
import CanvasLoader from './CanvasLoader'

const Ball = ({ imageUrl }) => {
  const [decal] = useTexture([imageUrl])
  return (
    <Float speed={0.5} rotationIntensity={1.5} >
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.095]} />
      <mesh scale={2.75}>
        <icosahedronGeometry castShawdow reciveShadow args={[1, 1]} />
        <meshStandardMaterial
          color={"#fff8eb"}
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6, 25]}
          flatShading
          map={decal}
        />
      </mesh>

    </Float>
  )
}



const BallCanvas = ({ icon }) => {
  return (
    <Canvas
      frameloop="always"
      gl={{ preserveDrawingBuffer: true, }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
        />
        <Ball imageUrl={icon} />
      </Suspense>
      <Preload all />
    </Canvas>
  )
}



export default BallCanvas
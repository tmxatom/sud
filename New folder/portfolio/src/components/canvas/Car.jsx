import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "./CanvasLoader";

const Car = () => {
  const computer = useGLTF("./2020_koenigsegg_jesko/scene.gltf");


  return (
    <group >
      <hemisphereLight intensity={0.8} groundColor="#1a1a1a" />
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 25, 10]}
        angle={0.15}
        penumbra={0.8}
        intensity={2.5}
        castShadow
        shadow-mapSize={1024}
        target-position={[0, 0, 0]}
      />
      <pointLight position={[0, 0, -1]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[8, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[0, -5, 10]} intensity={0.8} color="#e8f0ff" />

      <primitive
        object={computer.scene}
        scale={6}
        position={[0.03, -0.05, 0]}
        rotation={[Math.PI / 10, -Math.PI / 3.5, 0]}
        castShadow
        receiveShadow
      />
    </group>
  );
};

export const CarCanvas = () => {
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    // Enable autoRotate after a short delay to ensure model is visible
    const timer = setTimeout(() => {
      setModelLoaded(true);
    }, 500); // 500ms delay after model loads

    return () => clearTimeout(timer);
  }, []);

  return (
    <Canvas
      frameloop="always"
      shadows
      camera={{ position: [0, 0, 1], fov: 20 }}
      gl={{ preserveDrawingBuffer: true, shadowMap: { enabled: true } }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate={modelLoaded}
          autoRotateSpeed={0.5}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Car />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default CarCanvas;

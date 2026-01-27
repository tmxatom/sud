import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "./CanvasLoader";
import { flattenJSON } from "three/src/animation/AnimationUtils.js";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <group>
      <hemisphereLight intensity={1.5} groundColor="black" />
      <ambientLight intensity={1} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={3}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight position={[0, 0, 0]} intensity={0.5} />
      <directionalLight position={[5, -2.9, 2]} intensity={1} />

      <primitive
        object={computer.scene}
        scale={isMobile ? 0.68 : 0.75}
        position={isMobile ? [-1, -3, -2.45] : [0, -2.9, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
        castShadow
        receiveShadow
      />
    </group>
  );
};

export const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Only runs once on mount
    return window.matchMedia("(max-width: 500px)").matches;
  });

  useEffect(() => {
    const medaQuery = window.matchMedia("(max-width:500px)");

    const handleChangeInMedia = (event) => {
      setIsMobile(event.matches);
    };
    medaQuery.addEventListener("change", handleChangeInMedia);
    return () => {
      medaQuery.removeEventListener("change", handleChangeInMedia);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, shadowMap: { enabled: true } }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;

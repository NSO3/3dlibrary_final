// src/scenes/LibraryScene.tsx

import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
// 💡 コンポーネントのインポートパスを調整
import Bookshelf from '../components/Bookshelf'; 
import Floor from '../components/Floor'; 
import Wall from '../components/Wall';   
import CameraFocus from '../components/CameraFocus';


// ----------------------------------------------------
// 環境光調整コンポーネント (App.tsxから移動)
// ----------------------------------------------------
interface AdjusterProps {
    intensity: number;
}

const EnvironmentAdjuster: React.FC<AdjusterProps> = ({ intensity }) => {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMappingExposure = intensity; 
  }, [gl, intensity]);
  
  return null;
};
// ----------------------------------------------------


// ----------------------------------------------------
// ライブラリの3Dシーン (App.tsxから移動)
// ----------------------------------------------------
function LibraryScene() {
  return (
    <Canvas shadows camera={{ position: [20, 10, 20], fov: 60 }}>
      <Suspense fallback={null}> 
        
        <directionalLight 
            position={[10, 20, 10]} 
            intensity={1} 
            castShadow={true}
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048} 
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-camera-near={1} 
            shadow-camera-far={50} 
        />
        <ambientLight intensity={0.5} /> 

        <Environment preset="warehouse" background={true} />
        <EnvironmentAdjuster intensity={0.7} /> 

        <Floor /> 
        <Wall /> 

        {/* 複数本棚の配置 */}
        <Bookshelf position={[-7.5, -5, 0]} rotationY={0} bookIdOffset={1000} /> 
        <Bookshelf position={[-7.5, -5, 10]} rotationY={0} bookIdOffset={2000} />
        <Bookshelf position={[7.5, -5, 0]} rotationY={Math.PI} bookIdOffset={3000} /> 
        <Bookshelf position={[7.5, -5, 10]} rotationY={Math.PI} bookIdOffset={4000} />
        
        <CameraFocus /> 
        
      </Suspense>
    </Canvas>
  );
}

export default LibraryScene;
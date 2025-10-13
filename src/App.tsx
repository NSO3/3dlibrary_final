import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Bookshelf from './components/Bookshelf'; 
import Floor from './components/Floor'; 
import Wall from './components/Wall';
import { Suspense, useEffect } from 'react';

interface AdjusterProps {
    intensity: number;
}

const EnvironmentAdjuster: React.FC<AdjusterProps> = ({ intensity }) => {
  const { scene } = useThree(); 

  // 💡 useEffect を使用して環境マップの設定を適用
  useEffect(() => {
  }, [scene.environment, intensity]);

  // 環境マップの強度を下げても変化がない場合は、Rendererの露出を下げます
  const { gl } = useThree();
  useEffect(() => {
    // gl.toneMappingExposure のデフォルトは 1.0 です。
    gl.toneMappingExposure = intensity; // intensityの値で露出を制御
  }, [gl, intensity]);
  
  return null;
};

function LibraryScene() {
  return (
    <Canvas shadows camera={{ position: [20, 10, 20], fov: 60 }}>
      <Suspense fallback={null}> 
        
        {/* 💡 1. 光源の強化と影の有効化 */}
        <ambientLight intensity={1.0} /> 
        {/* DirectionalLight の影の描画範囲を拡大 */}
        <directionalLight 
            position={[10, 15, 10]} 
            intensity={1} 
            castShadow={true}
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048} 
            // 💡 影のカメラサイズを調整
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-camera-near={1} 
            shadow-camera-far={50} 
        />

        {/* 💡 Environment コンポーネントを再導入し、背景として使用 (preset="warehouse"など) */}
        {/* background={true} を追加すると、その環境テクスチャが背景全体に表示されます */}
        <Environment preset="warehouse" background={true} />

        {/* 💡 EnvironmentAdjuster を追加し、反射光を全体的に暗くする */}
        {/* gl.toneMappingExposure を 0.2 に設定することで、シーン全体を暗くします */}
        <EnvironmentAdjuster intensity={0.7} /> 

        <Floor /> 

        <Wall /> 

        // 💡 左側の列 (X = -7.5 に並べる)
        <Bookshelf position={[-7.5, -5, 0]} rotationY={0} /> // 部屋の手前
        <Bookshelf position={[-7.5, -5, 10]} rotationY={0} /> // 奥に連ねる
        <Bookshelf position={[-7.5, -5, 20]} rotationY={0} /> // さらに奥

        // 💡 右側の列 (X = 7.5 に並べる)
        <Bookshelf position={[7.5, -5, 0]} rotationY={Math.PI} /> // 180度回転させて左の列と向かい合わせに
        <Bookshelf position={[7.5, -5, 10]} rotationY={Math.PI} /> 
        <Bookshelf position={[7.5, -5, 20]} rotationY={Math.PI} /> 
        
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Suspense>
    </Canvas>
  );
}

export default LibraryScene;
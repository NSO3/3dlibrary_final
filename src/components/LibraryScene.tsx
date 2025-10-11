import { Canvas } from '@react-three/fiber'; 
// Environment, OrbitControls を drei からインポート
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
// Bookshelf コンポーネントをインポート
import Bookshelf from './Bookshelf.tsx';

const LibraryScene = () => {
  // ラジアン計算用の定数
  const PI = Math.PI; 
  
  return (
    <Canvas 
      // 影を有効化
      shadows
      gl={{ antialias: true, alpha: false }} 
      linear 
      style={{ background: '#f0f0f0' }} 
      // カメラの初期位置: 部屋に入った視点
      camera={{ position: [0, 2, 5], fov: 60 }} 
    >
      
      {/* 🚀 カメラ制御 */}
      <OrbitControls 
        enableDamping 
        dampingFactor={0.1}
        minDistance={3}
        maxDistance={20}
        // 注視点を部屋の中央の高さに設定
        target={[0, 2, 0]} 
      />

      {/* 🚀 ライティング・環境設定 (明るい部屋用) */}
      
      {/* 外部の明るい空の光を部屋に適用 (Skyの代わり) */}
      <Environment preset="sunset" background />
      
      {/* 太陽光 (影を落とすための光源) */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.5}        
        castShadow             
        // 影の調整（任意だが、部屋の暗さ対策として追加）
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* 影の影響を受けにくい、全体を補強する環境光 */}
      <ambientLight intensity={0.5} />

      {/* 🚀 ジオメトリ（部屋の構成要素） */}

      {/* 1. 床面 (明るいグレーに変更) */}
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#D0D0D0" /> 
      </mesh>

      {/* 2. 天井 (明るいグレー/ほぼ白に変更) */}
      <mesh rotation={[PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* 3. 奥の壁 (Z軸奥側) (明るいグレー/ほぼ白に変更) */}
      <mesh rotation={[0, 0, 0]} position={[0, 2.5, -10]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* 🚀 本棚の配置 (Bookshelf.tsx には明るい木目調の色が適用されている前提) */}
      
      {/* 1. 正面奥の壁 (Z軸奥側) */}
      <Bookshelf position={[0, 2.5, -7]} rotationY={0} />
      <Bookshelf position={[4, 2.5, -7]} rotationY={0} />
      <Bookshelf position={[-4, 2.5, -7]} rotationY={0} />
      
      {/* 2. 左側の壁 (X軸マイナス側) */}
      <Bookshelf position={[-8, 2.5, 0]} rotationY={PI / 2} />
      <Bookshelf position={[-8, 2.5, -4]} rotationY={PI / 2} />
      
      {/* 3. 右側の壁 (X軸プラス側) */}
      <Bookshelf position={[8, 2.5, 0]} rotationY={PI / 2} />
      <Bookshelf position={[8, 2.5, -4]} rotationY={PI / 2} />
      
    </Canvas>
  );
};

export default LibraryScene;
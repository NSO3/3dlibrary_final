import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Bookshelf from './components/Bookshelf'; 
import Floor from './components/Floor'; // 💡 復活
import Wall from './components/Wall';   // 💡 復活
import { Suspense, useEffect } from 'react';
// 💡 react-router-dom から必要なコンポーネントをインポート
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'; 


// 💡 シーン全体の明るさ調整のためのProps
interface AdjusterProps {
    intensity: number;
}

// 💡 環境光による露出（明るさ）を調整するコンポーネント
//    Environment Mapの強すぎる反射を抑え、シーン全体が白飛びしないように制御します。
const EnvironmentAdjuster: React.FC<AdjusterProps> = ({ intensity }) => {
  const { gl } = useThree();
  useEffect(() => {
    // gl.toneMappingExposure のデフォルトは 1.0 です。
    gl.toneMappingExposure = intensity; // intensityの値で露出を制御
  }, [gl, intensity]);
  
  return null;
};
// ----------------------------------------------------


// ----------------------------------------------------
// ライブラリの3Dシーン (3D要素を復活させる)
// ----------------------------------------------------
function LibraryScene() {
  return (
    <Canvas shadows camera={{ position: [20, 10, 20], fov: 60 }}> {/* 💡 以前のカメラ位置に戻す */}
      <Suspense fallback={null}> 
        
        {/* 💡 光源を復活 */}
        <ambientLight intensity={1.0} /> 
        <directionalLight 
            position={[10, 15, 10]} 
            intensity={1} 
            castShadow={true}
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048} 
            // 💡 影のカメラサイズを復活
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-camera-near={1} 
            shadow-camera-far={50} 
        />

        {/* 💡 Environmentと露出調整を復活 */}
        <Environment preset="warehouse" background={true} />
        {/* 💡 環境光の露出（明るさ）を調整する。数値が小さいほど暗くなります。 */}
        <EnvironmentAdjuster intensity={0.7} /> 

        <Floor /> // 💡 Floorを復活

        <Wall /> // 💡 Wallを復活

        // 💡 1. 左側の列 (X = -7.5 に並べる)
        // Y=-5 は床面の座標を基準に、Bookshelf.tsx内のMODEL_Y_ADJUSTMENT (2.0)で調整される想定
        <Bookshelf position={[-7.5, -5, 0]} rotationY={0} bookIdOffset={1000} /> // 部屋の手前
        <Bookshelf position={[-7.5, -5, 10]} rotationY={0} bookIdOffset={2000} /> // 奥に連ねる
        <Bookshelf position={[-7.5, -5, 20]} rotationY={0} bookIdOffset={3000} /> // さらに奥

        // 💡 2. 右側の列 (X = 7.5 に並べる)
        // rotationY={Math.PI} で180度回転させ、左の列と向かい合わせに
        <Bookshelf position={[7.5, -5, 0]} rotationY={Math.PI} bookIdOffset={4000} /> 
        <Bookshelf position={[7.5, -5, 10]} rotationY={Math.PI} bookIdOffset={5000} /> 
        <Bookshelf position={[7.5, -5, 20]} rotationY={Math.PI} bookIdOffset={6000} /> 
        
        {/*
          // 💡 これまでコメントアウトされていた単一の本棚は削除します
          <Bookshelf position={[0, -5, 0]} rotationY={0} /> 
        */}
        
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Suspense>
    </Canvas>
  );
}
// ----------------------------------------------------


// ----------------------------------------------------
// 本の詳細ページ (仮のHTML表示)
// ----------------------------------------------------
function BookDetailPage() {
    const { id } = useParams(); 
    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <h1>Book Detail Page</h1>
            <p style={{fontSize: '1.2em'}}>You clicked on Book ID: <strong>{id}</strong></p>
            <p>
                <a href="/">Go back to the Library</a>
            </p>
        </div>
    );
}

// ----------------------------------------------------
// メインのAppコンポーネント (ルーティングを処理)
// ----------------------------------------------------
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. ライブラリシーンのルート */}
                <Route path="/" element={<LibraryScene />} />
                {/* 2. 本の詳細ページのルート (IDをパラメータとして受け取る) */}
                <Route path="/book/:id" element={<BookDetailPage />} />
            </Routes>
        </BrowserRouter>
    );
}

// 💡 App をエクスポート
export default App;
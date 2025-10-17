import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Bookshelf from './components/Bookshelf'; 
import Floor from './components/Floor';
import Wall from './components/Wall'; 
import { Suspense, useEffect } from 'react';
// react-router-dom から必要なコンポーネントをインポート
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'; 
import { findBookById } from './data/bookData'; 
import type { BookMetadata } from './data/bookData'; // 👈 'type' を使用して型のみをインポート

// シーン全体の明るさ調整のためのProps
interface AdjusterProps {
    intensity: number;
}

// 環境光による露出（明るさ）を調整するコンポーネント
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
        
        {/* 光源を復活 */}
        <ambientLight intensity={1.0} /> 
        <directionalLight 
            position={[10, 15, 10]} 
            intensity={1} 
            castShadow={true}
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048} 
            // 影のカメラサイズを復活
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-camera-near={1} 
            shadow-camera-far={50} 
        />

        {/* Environmentと露出調整を復活 */}
        <Environment preset="warehouse" background={true} />
        {/* 環境光の露出（明るさ）を調整する。数値が小さいほど暗くなります。 */}
        <EnvironmentAdjuster intensity={0.7} /> 

        <Floor />

        <Wall />

        // 1. 左側の列 (X = -7.5 に並べる)
        // Y=-5 は床面の座標を基準に、Bookshelf.tsx内のMODEL_Y_ADJUSTMENT (2.0)で調整される想定
        <Bookshelf position={[-7.5, -5, 0]} rotationY={0} bookIdOffset={1000} /> // 部屋の手前
        <Bookshelf position={[-7.5, -5, 10]} rotationY={0} bookIdOffset={2000} /> // 奥に連ねる
        <Bookshelf position={[-7.5, -5, 20]} rotationY={0} bookIdOffset={3000} /> // さらに奥

        // 2. 右側の列 (X = 7.5 に並べる)
        // rotationY={Math.PI} で180度回転させ、左の列と向かい合わせに
        <Bookshelf position={[7.5, -5, 0]} rotationY={Math.PI} bookIdOffset={4000} /> 
        <Bookshelf position={[7.5, -5, 10]} rotationY={Math.PI} bookIdOffset={5000} /> 
        <Bookshelf position={[7.5, -5, 20]} rotationY={Math.PI} bookIdOffset={6000} /> 
        
        {/*
          // これまでコメントアウトされていた単一の本棚は削除します
          <Bookshelf position={[0, -5, 0]} rotationY={0} /> 
        */}
        
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Suspense>
    </Canvas>
  );
}
// ----------------------------------------------------

// ----------------------------------------------------
// 本の詳細ページ (本格的なHTML表示に修正)
// ----------------------------------------------------
function BookDetailPage() {
    const { id } = useParams(); // URLから文字列のIDを取得
    const bookId = Number(id); // IDを数値に変換

    // 💡 IDに基づいて本のデータを検索
    const book: BookMetadata | undefined = findBookById(bookId);

    if (!book) {
        return (
            <div style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100vh', textAlign: 'center' }}>
                <h1 style={{color: '#E53E3E'}}>Error: Book Not Found</h1>
                <p style={{fontSize: '1.2em'}}>ID: {id} に対応する本は見つかりませんでした。</p>
                <Link to="/" style={{display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', textDecoration: 'none', borderRadius: '5px'}}>
                    図書館に戻る
                </Link>
            </div>
        );
    }
    
    // 💡 データが見つかった場合の表示
    return (
        <div style={{ padding: '40px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <h1 style={{ borderBottom: `3px solid ${book.color}`, paddingBottom: '10px' }}>{book.title}</h1>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', marginTop: '30px' }}>
                <img 
                    src={book.imageUrl} 
                    alt={book.title} 
                    style={{ width: '200px', height: 'auto', border: `5px solid ${book.color}` }} 
                />
                <div>
                    <p style={{ fontSize: '1.4em', fontWeight: 'bold' }}>著者: {book.author}</p>
                    <p style={{ marginTop: '20px', fontSize: '1.1em', lineHeight: '1.6' }}>{book.summary}</p>
                    <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>* Book ID: {book.id}</p>
                </div>
            </div>
            
            <Link to="/" style={{display: 'inline-block', marginTop: '40px', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', textDecoration: 'none', borderRadius: '5px'}}>
                図書館に戻る
            </Link>
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
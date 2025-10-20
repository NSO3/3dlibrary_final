// src/App.tsx 
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Bookshelf from './components/Bookshelf'; 
import Floor from './components/Floor'; 
import Wall from './components/Wall';   
import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'; // Linkを追加
import CameraFocus from './components/CameraFocus'; 
// 💡 【修正点】BookMetadata は型であるため、'import type' を使用
import type { BookMetadata } from './data/bookData'; 
// 💡 findBookById は値（関数）であるため、通常の 'import' を使用
import { findBookById } from './data/bookData';


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
// ライブラリの3Dシーン 
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

        {/* 💡 【復元】複数本棚の配置とIDオフセットの適用 */}
        {/* ID: 1000番台 */}
        <Bookshelf position={[-7.5, -5, 0]} rotationY={0} bookIdOffset={1000} /> 
        {/* ID: 2000番台 */}
        <Bookshelf position={[-7.5, -5, 10]} rotationY={0} bookIdOffset={2000} />
        {/* ID: 3000番台 */}
        <Bookshelf position={[7.5, -5, 0]} rotationY={Math.PI} bookIdOffset={3000} /> 
        {/* ID: 4000番台 */}
        <Bookshelf position={[7.5, -5, 10]} rotationY={Math.PI} bookIdOffset={4000} />
        
        <CameraFocus /> 
        
      </Suspense>
    </Canvas>
  );
}
// ----------------------------------------------------


// ----------------------------------------------------
// 本の詳細ページ (データ連動 & オーバーレイ表示)
// ----------------------------------------------------
function BookDetailPage() {
    const { id } = useParams(); 
    const bookId = Number(id);

    // 💡 インポートした findBookById を使用
    const book: BookMetadata | undefined = findBookById(bookId);
    
    // 💡 オーバーレイ表示のためのスタイル (3Dシーンを背景に残す)
    const overlayStyle: React.CSSProperties = {
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10, 
        padding: '40px', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // 半透明
        overflowY: 'auto'
    };

    if (!book) {
        return (
            <div style={{ ...overlayStyle, backgroundColor: 'rgba(245, 245, 245, 0.95)', textAlign: 'center' }}>
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
        <div style={overlayStyle}>
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
// メインのAppコンポーネント
// ----------------------------------------------------
function App() {
    return (
        <BrowserRouter>
            {/* LibraryScene (3D) を Routes の外側で常にレンダリング */}
            <LibraryScene />
            
            <Routes>
                {/* /book/:id の時だけ BookDetailPage をオーバーレイで表示 */}
                <Route path="/book/:id" element={<BookDetailPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
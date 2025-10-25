// src/App.tsx 
import Home from './components/Home';
import EmptyPlaceholder from './components/EmptyPlaceholder';
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
import '../css/BookDetailPage.css';

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
// 本の詳細ページ (スタイル分離済み)
// ----------------------------------------------------
function BookDetailPage() {
    const { id } = useParams(); 
    const bookId = Number(id);

    const book: BookMetadata | undefined = findBookById(bookId);

    // 💡 【修正点２】スタイルオブジェクトを削除し、クラス名に置き換え
    const overlayClass = "book-detail-overlay";

    if (!book) {
        return (
            // エラー時のコンテナにクラスを適用
            <div className={`${overlayClass} error-state`}>
                <h1 style={{color: '#E53E3E'}}>Error: Book Not Found</h1>
                <p style={{fontSize: '1.2em'}}>ID: {id} に対応する本は見つかりませんでした。</p>
                <Link to="/" className="book-detail-return-link">
                    図書館に戻る
                </Link>
            </div>
        );
    }
    
    return (
        // 💡 【修正点３】クラス名に置き換え
        <div className={overlayClass}>
            <h1 style={{ borderBottom: `3px solid ${book.color}`, paddingBottom: '10px' }}>{book.title}</h1>
            
            {/* 💡 【修正点４】flexコンテナにクラスを適用 */}
            <div className="book-detail-content">
                <img 
                    src={book.imageUrl} 
                    alt={book.title} 
                    style={{ width: '200px', height: 'auto', border: `5px solid ${book.color}` }} 
                />
                <div>
                    {/* 💡 【修正点５】著者名と概要にクラスを適用 */}
                    <p className="book-detail-author">著者: {book.author}</p>
                    <p className="book-detail-summary">{book.summary}</p>
                    <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>* Book ID: {book.id}</p>
                </div>
            </div>
            
            {/* 💡 【修正点６】Linkにクラスを適用 */}
            <Link to="/" className="book-detail-return-link">
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
                <Route path="/" element={<Home />} />
                <Route path="/book/:id" element={<BookDetailPage />} />
                <Route path="/focus/:id" element={<EmptyPlaceholder />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
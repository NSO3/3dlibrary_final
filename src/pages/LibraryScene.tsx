// src/components/LibraryScene.tsx (最終修正版: カメラジャンプデグレード解消)

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useLocation } from 'react-router-dom'; 

// 💡 bookApi の利用を維持します
import { fetchAllBooks } from '../api/bookApi'; 

import Bookshelf from '../components/Bookshelf'; 
import Floor from '../components/Floor'; 
import Wall from '../components/Wall';   
import CameraFocus from '../components/CameraFocus'; 
import type { BookMetadata } from '../data/bookData'; 

// ----------------------------------------------------
// 環境設定とデータ取得 (変更なし)
// ----------------------------------------------------
interface AdjusterProps {
    intensity: number;
}
// ... (EnvironmentAdjusterの定義は変更なし) ...
const EnvironmentAdjuster: React.FC<AdjusterProps> = ({ intensity }) => {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMappingExposure = intensity; 
  }, [gl, intensity]);
  return null;
};
// ----------------------------------------------------


function LibraryScene() {
    const [books, setBooks] = useState<BookMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    // 💡 データ取得ロジック (変更なし)
    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchAllBooks(); 
                setBooks(data); 
            } catch (err) {
                console.error("Failed to fetch books in LibraryScene:", err);
                setError("書籍データの取得中に予期せぬエラーが発生しました。");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooks();
    }, [location.search]); 
    

    // 💡 【修正点】ローディング/エラー表示の早期リターンを削除し、Canvasの外側に移動
    // ----------------------------------------------------
    // 3Dレンダリングとオーバーレイ
    // ----------------------------------------------------
    return (
        <>
            {/* 💡 修正の核心: ローディング/エラー表示をCSSオーバーレイとして配置 */}
            {/* Canvasより前面 (zIndex: 100) に表示し、Canvasのアンマウントを防ぐ */}
            {(isLoading || error) && (
                <div style={{ 
                    color: 'white', 
                    position: 'absolute', 
                    top: 0, // 画面全体にオーバーレイ
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column', // 縦に並べる
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)', 
                    zIndex: 100 
                }}>
                    {/* ローディングメッセージ */}
                    {isLoading && <div style={{ padding: '10px', color: 'white' }}>書籍データを読み込み中...</div>}
                    {/* エラーメッセージ */}
                    {error && <div style={{ padding: '10px', color: 'red' }}>エラー: {error}</div>}
                </div>
            )}
            
            {/* 💡 Canvasは常にマウントされた状態を維持する */}
            <Canvas shadows camera={{ position: [20, 10, 20], fov: 60 }}>
              <Suspense fallback={null}> 
                
                {/* 環境光と影の設定 (省略) */}
                <directionalLight position={[10, 20, 10]} intensity={1} castShadow={true} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-camera-near={1} shadow-camera-far={50} />
                <ambientLight intensity={0.5} /> 

                {/* 環境マップと露出の調整 (省略) */}
                <Environment preset="warehouse" background={true} />
                <EnvironmentAdjuster intensity={0.7} /> 

                <Floor /> 
                <Wall /> 

                {/* Bookshelfの動的配置 (データ連携) */}
                <Bookshelf books={books} position={[-7.5, -5, 0]} rotationY={0} shelfIndex={0} /> 
                <Bookshelf books={books} position={[-7.5, -5, 10]} rotationY={0} shelfIndex={1} />
                <Bookshelf books={books} position={[7.5, -5, 0]} rotationY={Math.PI} shelfIndex={2} /> 
                <Bookshelf books={books} position={[7.5, -5, 10]} rotationY={Math.PI} shelfIndex={3} />
                
                <CameraFocus />
                
              </Suspense>
            </Canvas>
        </>
  );
}

export default LibraryScene;
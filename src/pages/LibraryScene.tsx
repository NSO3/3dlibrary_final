import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
// 💡 useLocationを追加 (データ再フェッチ用)
import { useLocation } from 'react-router-dom'; 
// 💡 【修正点 1】axios のインポートを削除
// import axios from 'axios'; 

// 💡 【修正点 2】fetchAllBooks 関数をインポート
import { fetchAllBooks } from '../api/bookApi'; 

// 💡 コンポーネントのインポートパス
import Bookshelf from '../components/Bookshelf'; 
import Floor from '../components/Floor'; 
import Wall from '../components/Wall';   
import CameraFocus from '../components/CameraFocus'; // カメラ制御
import type { BookMetadata } from '../data/bookData'; 

// ----------------------------------------------------
// 環境設定とデータ取得
// ----------------------------------------------------

interface AdjusterProps {
    intensity: number;
}

const EnvironmentAdjuster: React.FC<AdjusterProps> = ({ intensity }) => {
  const { gl } = useThree();
  useEffect(() => {
    // トーンマッピング露出を調整し、シーンの明るさを制御
    gl.toneMappingExposure = intensity; 
  }, [gl, intensity]);
  
  return null;
};
// ----------------------------------------------------


// ----------------------------------------------------
// ライブラリの3Dシーン (APIデータ統合 & 3D機能復元)
// ----------------------------------------------------
function LibraryScene() {
    const [books, setBooks] = useState<BookMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 💡 データの再フェッチをトリガーするuseLocation
    const location = useLocation();

    // 💡 データ取得ロジック (location.searchが変わるたびに再実行 = ページ遷移/リフレッシュに対応)
    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // 💡 【修正点 4】fetchAllBooks 関数を使用して書籍リストを取得
                const data = await fetchAllBooks(); 
                
                // fetchAllBooksはエラー発生時も空配列を返すため、データチェックは不要
                setBooks(data); 
            } catch (err) {
                // fetchAllBooks は API レベルのエラーを内部で処理し、空配列を返すため、
                // ここでキャッチされるのは主にネットワークレベルのエラーのみ
                console.error("Failed to fetch books in LibraryScene:", err);
                setError("書籍データの取得中に予期せぬエラーが発生しました。");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooks();
    }, [location.search]); // 💡 location.search (クエリパラメータ) に依存することで、本作成後のリフレッシュに対応
    

    // ローディング/エラー表示 (前回の修正を維持)
    if (isLoading) {
        return <div style={{ color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px' }}>書籍データを読み込み中...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px' }}>エラー: {error}</div>;
    }
    
    // ----------------------------------------------------
    // 3Dレンダリング
    // ----------------------------------------------------
    return (
        <Canvas shadows camera={{ position: [20, 10, 20], fov: 60 }}>
          <Suspense fallback={null}> 
            
            {/* 環境光と影の設定 */}
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

            {/* 環境マップと露出の調整 */}
            <Environment preset="warehouse" background={true} />
            <EnvironmentAdjuster intensity={0.7} /> 

            <Floor /> 
            <Wall /> 

            {/* Bookshelfの動的配置 (データ連携) */}
            <Bookshelf books={books} position={[-7.5, -5, 0]} rotationY={0} shelfIndex={0} /> 
            <Bookshelf books={books} position={[-7.5, -5, 10]} rotationY={0} shelfIndex={1} />
            <Bookshelf books={books} position={[7.5, -5, 0]} rotationY={Math.PI} shelfIndex={2} /> 
            <Bookshelf books={books} position={[7.5, -5, 10]} rotationY={Math.PI} shelfIndex={3} />
            
            {/* 💡 CameraFocusの呼び出し (アニメーションの復元) */}
            <CameraFocus />
            
          </Suspense>
        </Canvas>
  );
}

export default LibraryScene;
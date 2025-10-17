// src/components/Bookshelf.tsx

import { useGLTF } from '@react-three/drei';
import React from 'react';
import Book from './Book';
import * as THREE from 'three'; 

// 💡 位置情報をpropsで受け取るための型を定義
interface BookshelfProps {
  position: [number, number, number]; 
  rotationY: number; 
  bookIdOffset?: number; // 👈 複数本棚対応で追加されたプロパティを再追加
}

// ----------------------------------------------------
// ユーティリティ関数
// ----------------------------------------------------
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randColor = () => `#${new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString()}`;

// ----------------------------------------------------
// 本のランダム生成関数
// ----------------------------------------------------
const generateRandomBooks = (
  shelfYCenter: number, // 棚のY座標の中心
  xRange: [number, number], // X座標の配置範囲
  maxBooks: number, // 配置する本の最大数
  startId: number, // 本に割り当てるIDの開始値
) => {
  const books = [];
  let currentX = xRange[0]; // X軸の開始位置
  let currentId = startId;

  while (currentX < xRange[1] && books.length < maxBooks) {
    // 💡 1. ランダムなサイズを決定
    const width = rand(0.15, 0.35); // 幅 (X軸)
    const height = rand(1.0, 1.4);   // 高さ (Y軸) - 本棚の高さに合わせて調整
    const depth = rand(0.7, 1.0);    // 奥行き (Z軸)

    // 💡 2. 本の位置を決定
    const x = currentX + width / 2; // X位置は、現在のX位置 + 本の幅の半分
    const y = shelfYCenter + height / 2; // Y位置は、棚のYの中心 + 本の高さの半分
    // Z位置は本棚の奥行き方向でランダムにずらす
    const z = rand(1, -1.0); 
    
    // 許容範囲を超えたら終了
    if (x + width / 2 > xRange[1]) break;

    books.push({
      key: currentId,
      bookId: currentId,
      position: [x, y, z] as [number, number, number],
      size: [width, height, depth] as [number, number, number],
      color: randColor(),
    });

    // 💡 3. 次の本のX位置を決定 (本の幅 + ランダムな隙間)
    currentX += width + rand(0.10, 1.00);
    currentId++;
  }
  return books;
};

// ----------------------------------------------------
// Bookshelf コンポーネント本体
// ----------------------------------------------------
const Bookshelf: React.FC<BookshelfProps> = ({ position, rotationY, bookIdOffset = 0 }) => {
  const gltf = useGLTF('/my_bookshelf.glb'); 
  const BOOKSHELF_SCALE: [number, number, number] = [15, 8, 15]; // 確定したスケール値
  const MODEL_Y_ADJUSTMENT = 2.0; // モデルのY位置調整
  
  // 💡 ランダム配置のためのパラメータ定義
  // モデルの中心Y=0からの相対座標 + MODEL_Y_ADJUSTMENT (2.0)
  const SHELF_Y_CENTERS = [
    -0.4 + MODEL_Y_ADJUSTMENT -1, // 1段目 (以前の -0.4)
    0.2 + MODEL_Y_ADJUSTMENT -1,  // 2段目 (以前の 0.2)
    0.8 + MODEL_Y_ADJUSTMENT -1,  // 3段目 (推測)
    1.4 + MODEL_Y_ADJUSTMENT -1,  // 4段目 (推測)
  ];
  const X_RANGE: [number, number] = [0, 1]; 
  const MAX_BOOKS_PER_SHELF = 1; // 一つの棚に配置する本の最大数

  // 💡 全ての棚のデータを生成
  const allBooks = React.useMemo(() => {
    let generatedBooks: any[] = [];
    let currentId = bookIdOffset;

    SHELF_Y_CENTERS.forEach((shelfYCenter) => {
      const booksOnShelf = generateRandomBooks(
        shelfYCenter, 
        X_RANGE, 
        MAX_BOOKS_PER_SHELF, 
        currentId,
      );
      generatedBooks = [...generatedBooks, ...booksOnShelf];
      currentId += MAX_BOOKS_PER_SHELF; // IDを次の棚へ進める
    });
    return generatedBooks;
  }, [bookIdOffset]); // bookIdOffset が変わったときに再生成

  // 💡 モデルのシーンをクローンして、複数のインスタンスで再利用できるようにする
  const clonedScene = React.useMemo(() => gltf.scene.clone(), [gltf.scene]);

  // 💡 モデル内の全てのメッシュに影の設定を適用
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group 
        position={position}
        rotation={[0, rotationY, 0]} 
    >
      <primitive
        object={clonedScene} 
        scale={BOOKSHELF_SCALE} 
        position={[0, MODEL_Y_ADJUSTMENT, 0]} 
        rotation={[0, 0, 0]} 
      />

      {/* ----------- 本のランダム配置 ----------- */}
      {allBooks.map((book) => (
        <Book 
          key={book.key}
          position={book.position} 
          castShadow={true}
          bookId={book.bookId}
        />
      ))}
      
    </group>
  );
};

useGLTF.preload('/my_bookshelf.glb'); 

export default Bookshelf;
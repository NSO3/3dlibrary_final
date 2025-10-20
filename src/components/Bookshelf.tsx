// src/components/Bookshelf.tsx (Y座標修正版)

import { useGLTF } from '@react-three/drei';
import React from 'react';
import Book from './Book';
import * as THREE from 'three'; 

// 💡 位置情報をpropsで受け取るための型を定義
interface BookshelfProps {
  position: [number, number, number]; 
  rotationY: number; 
  bookIdOffset: number; // IDのオフセット値
}

// ----------------------------------------------------
// ユーティリティ関数 (変更なし)
// ----------------------------------------------------
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randColor = () => `#${new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString()}`;

// ----------------------------------------------------
// 本の配置定数
// ----------------------------------------------------
const BOOKSHELF_SCALE: [number, number, number] = [15, 8, 15];

// 💡 【修正点１】モデル自体のY位置調整を定数で保持
const MODEL_Y_ADJUSTMENT = 2.0; 

// 💡 【修正点２】棚のY座標の中心位置を、グローバルなモデルの中心(Y=-3.0)からの相対位置で定義
// モデルの中心 (-5, -5, 0) + [0, MODEL_Y_ADJUSTMENT, 0] = (-5, -3, 0)
// 本棚モデルの中心Y座標 (-3.0) を基準とする。
const BOOK_POSITION_Y_BASE = -3.0; // 本棚の垂直方向の中心Y座標

// 💡 【修正点３】棚のY座標の絶対位置を定義（モデルの中心Y=-3.0を基準）
// モデルの棚の相対的な高さに合わせて調整
const SHELF_Y_CENTERS = [
    BOOK_POSITION_Y_BASE + 0.9, // 上から1段目 (-3.0 + 0.9 = -2.1)
    BOOK_POSITION_Y_BASE + 0.1, // 上から2段目 (-3.0 + 0.1 = -2.9)
    BOOK_POSITION_Y_BASE - 0.7, // 上から3段目 (-3.0 - 0.7 = -3.7)
    BOOK_POSITION_Y_BASE - 1.5, // 上から4段目 (-3.0 - 1.5 = -4.5)
];

const X_RANGE: [number, number] = [-0.5, 0.5]; 
// 一つの棚に配置する本の最大数
//const MAX_BOOKS_PER_SHELF = 10;
// BookDAta.tsが少ないのと見栄えの関係でこの値で
const MAX_BOOKS_PER_SHELF = 1; 

// ----------------------------------------------------
// 本のランダム生成関数 (変更なし)
// ----------------------------------------------------
const generateRandomBooks = (
  shelfYCenter: number, 
  xRange: [number, number], 
  maxBooks: number, 
  startId: number, 
) => {
  const books = [];
  let currentX = xRange[0]; 
  let currentId = startId;
  const Z_OFFSET = rand(-0.02, 0.02); 

  while (currentX < xRange[1] && books.length < maxBooks) {
    const bookWidth = rand(0.15, 0.25); 
    const bookHeight = rand(1.0, 1.3);
    const bookDepth = rand(0.7, 0.9);
    
    const bookPositionX = currentX + bookWidth / 2;
    
    if (bookPositionX + bookWidth / 2 > xRange[1]) break; 

    books.push(
      <Book 
        key={currentId}
        bookId={currentId} 
        // 💡 ここでの位置は Bookshelf の group のローカル座標系なので、
        // group の位置 ([0, 0, 0]) からの相対位置で定義すれば OK。
        position={[bookPositionX, shelfYCenter + 5, Z_OFFSET]} // 💡 group の Y=-5 を打ち消すため +5 
        size={[bookWidth, bookHeight, bookDepth]}
        color={randColor()}
      />
    );
    
    currentX = bookPositionX + bookWidth / 2 + rand(0.05, 0.1); 
    currentId++;
  }
  return books;
};

// ----------------------------------------------------
// Bookshelf コンポーネント
// ----------------------------------------------------
const Bookshelf: React.FC<BookshelfProps> = ({ position, rotationY, bookIdOffset }) => {
  const gltf = useGLTF('/my_bookshelf.glb'); 
  
  const bookElements = React.useMemo(() => {
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
      currentId += MAX_BOOKS_PER_SHELF; 
    });
    return generatedBooks;
  }, [bookIdOffset]); 

  const clonedScene = React.useMemo(() => gltf.scene.clone(), [gltf.scene]);

  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group 
        // 💡 App.tsxで定義された位置 (例: [-7.5, -5, 0])
        position={position} 
        rotation={[0, rotationY, 0]} 
    >
      <primitive
        object={clonedScene} 
        scale={BOOKSHELF_SCALE} 
        // 💡 モデルを地面に合わせるための調整 (モデルの中心を Y=-3.0 にする)
        position={[0, MODEL_Y_ADJUSTMENT, 0]} 
        rotation={[0, 0, 0]} 
      />

      {bookElements}
    </group>
  );
};

export default Bookshelf;
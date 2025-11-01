// src/components/Bookshelf.tsx (APIデータ統合版)

import { useGLTF } from '@react-three/drei';
import React from 'react';
import Book from './Book';
import * as THREE from 'three'; 
import type { BookMetadata } from '../data/bookData'; // 💡 BookMetadataをインポート

// ----------------------------------------------------
// 💡 BookshelfPropsの修正: APIデータを取得する
// ----------------------------------------------------
interface BookshelfProps {
  position: [number, number, number]; 
  rotationY: number; 
  // 💡 修正: books配列とshelfIndexを受け取る
  books: BookMetadata[]; 
  shelfIndex: number; // 本棚のインデックス (0, 1, 2, 3)
}

// ----------------------------------------------------
// ユーティリティ関数 (変更なし)
// ----------------------------------------------------
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

// ----------------------------------------------------
// 本の配置定数 (一部変更なし)
// ----------------------------------------------------
const BOOKSHELF_SCALE: [number, number, number] = [15, 8, 15];
const MODEL_Y_ADJUSTMENT = 2.0; 
const BOOK_POSITION_Y_BASE = -3.0; // 本棚の垂直方向の中心Y座標
const SHELF_Y_CENTERS = [
    BOOK_POSITION_Y_BASE + 0.9, 
    BOOK_POSITION_Y_BASE + 0.1, 
    BOOK_POSITION_Y_BASE - 0.7, 
    BOOK_POSITION_Y_BASE - 1.5, 
];
const X_RANGE: [number, number] = [-0.5, 0.5]; 


// ----------------------------------------------------
// Bookshelf コンポーネント (データ統合ロジック)
// ----------------------------------------------------
const Bookshelf: React.FC<BookshelfProps> = ({ position, rotationY, books, shelfIndex }) => {
  const gltf = useGLTF('/my_bookshelf.glb'); 
  
  const bookElements = React.useMemo(() => {
    if (books.length === 0) return [];
    
    let renderedBooks: React.JSX.Element[] = [];
    
    // 各本棚の4つの棚段をループする
    SHELF_Y_CENTERS.forEach((shelfYCenter, shelfLevel) => {
      // 💡 books配列内のインデックスを計算
      // Index = (本棚のインデックス * 棚の段数) + 段のレベル
      // これにより、4つの本棚全体に書籍が分散して配置される
      const bookIndex = (shelfIndex * SHELF_Y_CENTERS.length) + shelfLevel;

      if (bookIndex < books.length) {
        const book = books[bookIndex];
        
        // 💡 書籍のサイズをランダムに決定（本棚にリアルさを出すため）
        const bookWidth = rand(0.15, 0.25); 
        const bookHeight = rand(1.0, 1.3);
        const bookDepth = rand(0.7, 0.9);
        
        // 💡 X位置を計算 (棚のX_RANGEの中央付近に配置)
        // 現在の本が1冊のみの場合も、中央付近に配置される
        const X_CENTER = (X_RANGE[0] + X_RANGE[1]) / 2;
        const bookPositionX = X_CENTER + rand(-0.1, 0.1); // 中央から少しずらす
        
        const Z_OFFSET = rand(-0.02, 0.02); 

        renderedBooks.push(
          <Book 
            key={book.id}
            bookMetadata={book} // 💡 APIから取得したメタデータをBookコンポーネントに渡す
            // position: Bookshelfグループのローカル座標系 (Y=-5を打ち消すため +5)
            position={[bookPositionX, shelfYCenter + 5, Z_OFFSET]} 
            size={[bookWidth, bookHeight, bookDepth]}
          />
        );
      }
    });

    return renderedBooks;

  }, [books, shelfIndex]); // 💡 依存配列にbooksとshelfIndexを含める

  const clonedScene = React.useMemo(() => gltf.scene.clone(), [gltf.scene]);

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

      {bookElements}
    </group>
  );
};

export default Bookshelf;
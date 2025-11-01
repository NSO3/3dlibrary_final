// src/components/Book.tsx (視線基準ズーム対応版)

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useThree } from '@react-three/fiber';
import type { BookMetadata } from '../data/bookData'; 

// 本のプロパティを定義
interface BookProps {
  position: [number, number, number]; 
  size?: [number, number, number];    
  castShadow?: boolean;
  bookMetadata: BookMetadata;
}

// 💡 ユーティリティ関数: 乱数生成
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const Book: React.FC<BookProps> = ({ 
    position, 
    size: propSize, 
    castShadow = true, 
    bookMetadata 
}) => {
  
  const navigate = useNavigate(); 
  const meshRef = useRef<THREE.Mesh>(null!); 
  // 警告回避のため、デストラクトせずに呼び出しは残すか、または完全に削除。ここでは残す。
  useThree(); 
  
  const { id: bookId, color: propColor } = bookMetadata;

  // 💡 マテリアルの色をランダムに設定するロジック
  const bookColor = propColor === 'random' || !propColor
    ? `#${new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString()}`
    : propColor || 'gray'; 
  
  // 💡 ランダムな回転を生成し、わずかな傾きでリアリティを出す
  const finalSize = propSize || [0.2, 1.2, 0.8]; 
  const rotationY = rand(-0.5, 0.5); // Y軸回転 (約±28度)
  const rotationZ = rand(-0.02, 0.02); // Z軸回転 (約±1度)

  const handleBookClick = () => {
    if (meshRef.current) {
        // 1. 本のワールド座標を取得
        meshRef.current.updateWorldMatrix(true, false);
        const worldPosition = new THREE.Vector3();
        meshRef.current.getWorldPosition(worldPosition);

        // 2. 座標をURLクエリパラメータとしてエンコード
        // rotationY (rot) は不要になったため削除
        const encodedPosition = `${worldPosition.x.toFixed(2)},${worldPosition.y.toFixed(2)},${worldPosition.z.toFixed(2)}`;
        
        // 3. /focus/ パスに座標情報のみ含めて遷移
        navigate(`/focus/${bookId}?pos=${encodedPosition}`); 
    }
  };

  return (
    <group position={position} rotation={[0, rotationY, rotationZ]}>
      <mesh 
        ref={meshRef} 
        castShadow={castShadow} 
        onClick={handleBookClick} 
      >
        <boxGeometry args={finalSize} />
        <meshStandardMaterial color={bookColor} />
      </mesh>
    </group>
  );
};

export default Book;
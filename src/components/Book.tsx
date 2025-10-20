import React from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

// 本のプロパティを定義
interface BookProps {
  position: [number, number, number]; 
  size?: [number, number, number];    
  color?: string;                     
  castShadow?: boolean;
  bookId: number; 
}

// 💡 ユーティリティ関数: 乱数生成
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const Book: React.FC<BookProps> = ({ position, size: propSize, color: propColor, castShadow = true , bookId}) => {
  
  const navigate = useNavigate(); 
  
  // 💡 【復元】マテリアルの色をランダムに設定するロジック
  const bookColor = propColor === 'random' || !propColor
    ? `#${new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString()}`
    : propColor || 'gray'; 
  
  // 💡 【復元】ランダムな回転を生成し、わずかな傾きでリアリティを出す
  const finalSize = propSize || [0.2, 1.2, 0.8]; 
  const rotationY = rand(-0.5, 0.5); // Y軸回転 (約±28度)
  const rotationZ = rand(-0.02, 0.02); // Z軸回転 (約±1度)

  const handleClick = (e: any) => {
    e.stopPropagation(); 
    // アニメーションをトリガーするため、/focus/:id に遷移させる
    navigate(`/focus/${bookId}`); 
  };

  return (
    <mesh 
      position={position} 
      castShadow={castShadow} 
      onClick={handleClick}
      // 💡 ランダムな回転を適用
      rotation={[0, rotationY, rotationZ]} 
    >
      <boxGeometry args={finalSize} /> 
      <meshStandardMaterial color={bookColor} /> 
    </mesh>
  );
};

export default Book;
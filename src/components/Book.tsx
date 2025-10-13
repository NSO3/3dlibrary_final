import React from 'react';
import * as THREE from 'three';

// 本のプロパティを定義
interface BookProps {
  position: [number, number, number]; // 本の位置
  size?: [number, number, number];    // 本のサイズ (幅, 高さ, 奥行き)
  color?: string;                     // 本の色
  castShadow?: boolean;
}

const Book: React.FC<BookProps> = ({ position, size = [0.2, 1.2, 0.8], color = 'red', castShadow = true }) => {
  
  // マテリアルの色をランダムに設定する（オプション）
  const bookColor = color === 'random' 
    ? `#${new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString()}`
    : color;

  return (
    <mesh position={position} castShadow={castShadow}>
      {/* BoxGeometry: 本の形状（幅、高さ、奥行き） */}
      <boxGeometry args={size} /> 
      {/* MeshStandardMaterial: 本の質感 */}
      <meshStandardMaterial color={bookColor} />
    </mesh>
  );
};

export default Book;
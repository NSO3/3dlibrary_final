import { Box } from '@react-three/drei';
import React from 'react';

// 💡 位置情報をpropsで受け取るための型を定義
interface BookshelfProps {
  position: [number, number, number]; // [x, y, z] の座標
  rotationY: number; // Y軸の回転角度 (ラジアン)
}

// 💡 propsを受け取るように修正
const Bookshelf: React.FC<BookshelfProps> = ({ position, rotationY }) => {
  return (
    <Box 
      args={[3, 5, 1]} // サイズ: [幅3, 高さ5, 奥行き1]
      position={position} // 💡 propsから受け取った位置を設定
      rotation={[0, rotationY, 0]} // 💡 propsから受け取った回転角度を設定
    >
      <meshStandardMaterial color="#654321" />
    </Box>
  );
};

export default Bookshelf;
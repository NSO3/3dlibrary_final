import { useGLTF } from '@react-three/drei';
import React from 'react';
import Book from './Book';
import * as THREE from 'three'; 

// 💡 位置情報をpropsで受け取るための型を定義
interface BookshelfProps {
  position: [number, number, number]; 
  rotationY: number; 
  bookIdOffset?: number;
}

const Bookshelf: React.FC<BookshelfProps> = ({ position, rotationY, bookIdOffset = 0  }) => {
  const gltf = useGLTF('/my_bookshelf.glb'); 
  const BOOKSHELF_SCALE: [number, number, number] = [15, 8, 15]; // 確定したスケール値
    // 💡 ここでモデル自体のY位置を調整する！
  const MODEL_Y_ADJUSTMENT = 2.0; // 例: 2.0 単位上に持ち上げる (安定版の値を使用)

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

      {/* ----------- 本の配置 (IDを追加) ----------- */}
      
      {/* 例: 一番下の棚（Y座標は非常に低いかマイナス） */}
      <Book 
        position={[0.2, -0.4 + MODEL_Y_ADJUSTMENT, 0]} // X, Y, Z
        size={[0.2, 1.2, 0.8]} 
        color="blue" 
        castShadow={true}
        bookId={101+ bookIdOffset} //  オフセット値を加算
      />
      <Book 
        position={[-0.2, -0.4 + MODEL_Y_ADJUSTMENT, 0]} 
        size={[0.2, 1.0, 0.7]} 
        color="random" 
        castShadow={true}
        bookId={102+ bookIdOffset} //  オフセット値を加算
      />
      
      {/* 例: 2段目の棚（Y座標を調整） */}
      <Book 
        position={[0.1, 0.2 + MODEL_Y_ADJUSTMENT, 0]} 
        size={[0.2, 1.1, 0.8]} 
        color="green" 
        castShadow={true}
        bookId={201} // 💡 別のID (例: 201)
      />
      
    </group>
  );
};

useGLTF.preload('/my_bookshelf.glb'); 

export default Bookshelf;
import React from 'react';
import * as THREE from 'three';
// useTexture がない場合はインストールが必要です: npm install @react-three/drei
import { useTexture } from '@react-three/drei'; 
import { Suspense } from 'react'; // Suspense が必要ならインポート

const Floor: React.FC = () => {
  // 💡 ファイル名は 'concrete.png' を使用
  const texture = useTexture('/concrete.png'); 

  // テクスチャを繰り返す設定
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // 💡 繰り返し回数を大幅に減らして、格子状のパターンを目立たなくする
  // (例: 10x10 から 3x3 へ)
  texture.repeat.set(1, 1); 

  return (
    // 💡 Suspenseで囲むことで、テクスチャの読み込み完了まで待機
    <Suspense fallback={null}> 
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow={true}>
          <planeGeometry args={[100, 100]} /> 
          <meshStandardMaterial 
            map={texture} 
            side={THREE.DoubleSide} 
            // 💡 粗さを上げ、テカリを抑える（設定済みのはずだが、改めて確認）
            roughness={0.9} 
            metalness={0.1} 
            // 💡 環境マップ（Environment）の反射強度を大幅に下げる
            // これでテカテカした鏡面反射が軽減されます
            envMapIntensity={0.05} 
          /> 
        </mesh>
    </Suspense>
  );
};

export default Floor;
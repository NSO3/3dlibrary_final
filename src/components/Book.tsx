import React from 'react';
import { useNavigate } from 'react-router-dom';
// 💡 データ連携のためのインポート
import { findBookById } from '../data/bookData'; 
import type { BookMetadata } from '../data/bookData'; 


// 本のプロパティを定義
interface BookProps {
  position: [number, number, number]; 
  size?: [number, number, number]; 
  color?: string;                     
  castShadow?: boolean;
  bookId: number; // 必須
}

// ユーティリティ関数: 乱数生成
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const Book: React.FC<BookProps> = ({ position, size: propSize, color: propColor, castShadow = true , bookId}) => {
  
  const navigate = useNavigate(); 
  
  // 💡 bookDataからメタデータを取得
  const metadata: BookMetadata | undefined = findBookById(bookId);

  // 💡 3Dモデルに使用する最終的な色とサイズを決定
  // bookDataに色があればそれを使い、なければ propColor を使い、それもなければ 'gray' を使う
  const bookColor = metadata ? metadata.color : propColor || 'gray'; 
  
  // 💡 Bookshelf.tsxからサイズが渡されていない場合はデフォルト値を使用
  const finalSize = propSize || [0.2, 1.2, 0.8]; 

  // 💡 リアリティのためのランダムな回転を生成
  // Y軸回転（ヨー）: 横方向の回転 (約±28度)
  const rotationY = rand(-0.5, 0.5); // ラジアン
  
  // 💡 【重要】Z軸回転（ロール/傾き）: はみ出しを防ぐため非常に小さな値に制限 (約±1度)
  const rotationZ = rand(-0.02, 0.02); // ラジアン 

  const handleClick = (e: any) => {
    e.stopPropagation(); 
    navigate(`/book/${bookId}`); 
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
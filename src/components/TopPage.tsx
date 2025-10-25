import React from 'react';
import { Link } from 'react-router-dom';
// 💡 スタイルも分離し、src/css/TopPage.css を参照します
import '../css/TopPage.css'; 

const TopPage: React.FC = () => {
  return (
    // position: fixed で画面全体を覆うコンテナ
    <div className="top-page-container">
      <div className="top-page-content">
        <h1>3D Library Project</h1>
        <p>未来の読書体験へようこそ。3D空間で知識を探求しましょう。</p>
        
        {/* 💡 【核心】3D図書館シーンへのリンク。パスを /library に設定 */}
        <Link to="/library" className="start-button">
          3D図書館に入る
        </Link>
        
        {/* 今後実装する機能へのナビゲーションリンク (プレースホルダー) */}
        <nav className="top-page-nav">
          <Link to="/create-book">本の作成</Link>
          <Link to="/search">本の検索</Link>
          <Link to="/contact">お問い合わせ</Link>
        </nav>
      </div>
    </div>
  );
};

export default TopPage;
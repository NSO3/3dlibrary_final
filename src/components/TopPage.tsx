import React from 'react';
import { Link } from 'react-router-dom';
import '../css/TopPage.css'; 

const TopPage: React.FC = () => {
  return (
    <div className="top-page-container">
      <div className="top-page-content">
        <h1>3D Library Project</h1>
        <p>未来の読書体験へようこそ。3D空間で知識を探求しましょう。</p>
        
        {/* 1. メインCTA: 3D図書館へ */}
        <Link to="/library" className="start-button">
          3D図書館に入る
        </Link>
        
        {/* 2. サブナビゲーション: 新機能へのリンク */}
        <nav className="top-page-nav">
          {/* 💡 【修正点】リンクパスを /create-book に確定 */}
          <Link to="/create-book">本の作成</Link>
          
          {/* 💡 【修正点】リンクパスを /search に確定 */}
          <Link to="/search">本の検索</Link>
          
          {/* 💡 【修正点】リンクパスを /contact に確定 */}
          <Link to="/contact">お問い合わせ</Link>

          {/* 💡 【追加予定】管理者機能へのリンク（後ほど実装） */}
          {/* <Link to="/admin">管理者メニュー</Link> */}
        </nav>
      </div>
    </div>
  );
};

export default TopPage;
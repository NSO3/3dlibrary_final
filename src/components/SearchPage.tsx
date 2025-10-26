import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/SearchPage.css';
// 💡 仮のデータ（実際はAPIから取得します）
import { BOOKS_DATA } from '../data/bookData'; 

const SearchPage: React.FC = () => {
    // 💡 検索キーワードの状態を管理
    const [searchTerm, setSearchTerm] = useState('');
    // 💡 検索結果の状態を管理（現在は全データを表示）
    const [searchResults, setSearchResults] = useState(BOOKS_DATA); 

    // 検索キーワード入力時のハンドラ
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // UI基盤作成フェーズでは、入力に応じてデータをフィルタリングするロジックは省略します。
        // ここにAPI連携後の検索ロジックが入ります。
    };

    // 検索ボタンが押された時のハンドラ
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`「${searchTerm}」で検索を実行します（API連携は後ほど）`);
        
        // 💡 ダミーのフィルタリング処理（小文字に変換してタイトルと著者を検索）
        const filtered = BOOKS_DATA.filter(book => 
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
    };

    return (
        <div className="search-page-container">
            <div className="search-content">
                <Link to="/" className="back-to-top-link">
                    &larr; トップページに戻る
                </Link>
                <h1>🔍 本の検索</h1>
                
                {/* 1. 検索フォーム */}
                <form onSubmit={handleSearch} className="search-form">
                    <input 
                        type="text"
                        placeholder="タイトル、著者名で検索..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">検索</button>
                </form>

                {/* 2. 検索結果エリア */}
                <div className="search-results-list">
                    <h2>検索結果 ({searchResults.length} 件)</h2>
                    {searchResults.length === 0 ? (
                        <p className="no-results">該当する本は見つかりませんでした。</p>
                    ) : (
                        <div className="results-grid">
                            {searchResults.map((book) => (
                                // 💡 検索結果から本の詳細ページへ遷移できるリンク
                                <div key={book.id} className="book-result-item">
                                    <Link to={`/book/${book.id}`} className="book-link">
                                        <img src={book.imageUrl} alt={book.title} style={{ borderColor: book.color }} />
                                        <div className="book-info">
                                            <h3>{book.title}</h3>
                                            <p>{book.author}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
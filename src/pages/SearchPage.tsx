// src/components/SearchPage.tsx (API連携最終版)

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../css/SearchPage.css';
import type { BookMetadata } from '../data/bookData'; 
import { searchBooks } from '../api/bookApi'; // 💡 API連携関数をインポート

const SearchPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    // 💡 検索結果の初期値は空にし、全件表示のダミー処理を削除
    const [searchResults, setSearchResults] = useState<BookMetadata[]>([]); 
    const [isLoading, setIsLoading] = useState(false);

    // 検索キーワード入力時のハンドラ
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // 検索ボタンが押された時のハンドラ (API連携ロジックに置き換え)
    const handleSearch = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        const query = searchTerm.trim();
        if (!query) {
            setSearchResults([]); 
            return;
        }

        setIsLoading(true);
        // alert(`「${query}」で検索を実行します...`); // 💡 alertは削除
        
        try {
            // 💡 API呼び出し: searchBooks関数に置き換え
            const fetchedResults = await searchBooks(query);
            setSearchResults(fetchedResults);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            // エラーは bookApi 側でコンソールに出力されるため、ここでは空配列をセット
            setSearchResults([]); 
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm]); // 💡 依存配列に searchTerm を追加

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
                        disabled={isLoading} // 💡 ローディング中は無効化
                    />
                    <button type="submit" className="search-button" disabled={isLoading}>
                        {isLoading ? '検索中...' : '検索'}
                    </button>
                </form>

                {/* 2. 検索結果エリア */}
                <div className="search-results-list">
                    <h2>検索結果 ({searchResults.length} 件)</h2>
                    
                    {/* 💡 ローディング表示を追加 */}
                    {isLoading && <p className="no-results">検索中です...</p>}
                    
                    {!isLoading && searchResults.length === 0 && searchTerm.trim() && (
                        <p className="no-results">「{searchTerm}」に該当する本は見つかりませんでした。</p>
                    )}
                    
                    {!isLoading && searchResults.length > 0 && (
                        <div className="results-grid">
                            {searchResults.map((book) => (
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
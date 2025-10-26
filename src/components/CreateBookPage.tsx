import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/CreateBookPage.css';
import type { PageContent } from '../data/bookData';

// 1. 本の基本情報を管理
const initialBookState = {
    title: '',
    author: '',
    color: '#CCCCCC', // デフォルトカラー
    summary: '',
};

const initialPages: PageContent[] = [
    { pageNumber: 1, content: '' } // 常に1ページから開始
];

const CreateBookPage: React.FC = () => {
    // 💡 フォームの状態管理 (React Hooks)
 const [bookData, setBookData] = useState(initialBookState);
    // 💡 ページ情報の配列を管理
    const [pages, setPages] = useState<PageContent[]>(initialPages);
    // 💡 現在編集中のページ番号を管理
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

// 既存の基本情報変更ハンドラ
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    // 💡 ページコンテンツ変更ハンドラ
    const handlePageContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newPages = pages.map(page => 
            page.pageNumber === currentPage 
                ? { ...page, content: e.target.value } // 現在のページを更新
                : page
        );
        setPages(newPages);
    };

    // 💡 ページを増やすハンドラ
    const handleAddPage = () => {
        const nextPageNumber = pages.length + 1;
        setPages([...pages, { pageNumber: nextPageNumber, content: '' }]);
        setCurrentPage(nextPageNumber); // 新しいページに移動
    };

    // 💡 ページ切り替えハンドラ
    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPage = Number(e.target.value);
        if (newPage >= 1 && newPage <= pages.length) {
            setCurrentPage(newPage);
        }
    };
    
    // 💡 現在のページ内容を取得
    const getCurrentPageContent = () => {
        return pages.find(page => page.pageNumber === currentPage)?.content || '';
    };

    // 既存の送信ハンドラ
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 💡 ページ数が0またはコンテンツがない場合はアラート
        const filledPages = pages.filter(p => p.content.trim() !== '');
        if (filledPages.length === 0) {
             alert('最低1ページは内容を入力してください。');
             return;
        }

        const newBook = {
            ...bookData,
            id: Date.now(), // 💡 一時的なID生成
            imageUrl: 'https://via.placeholder.com/150/000000/FFFFFF?text=NEW+BOOK',
            pages: filledPages
        };

        console.log('作成された本データ:', newBook);
        alert('本が作成されました！（データ保存機能は今後実装）');
        navigate('/library');
    };

    return (
        <div className="create-book-container">
            <div className="create-book-content">
                <h1>📚 新しい本を作成</h1>
                <form onSubmit={handleSubmit} className="book-creation-form">
                    
                    {/* 1. 基本情報入力フィールド */}
                    <div className="form-section basic-info-section">
                        <h2>基本情報</h2>
                        <input name="title" placeholder="タイトル (必須)" value={bookData.title} onChange={handleChange} required />
                        <input name="author" placeholder="著者名" value={bookData.author} onChange={handleChange} />
                        <textarea name="summary" placeholder="本の概要 (最大200字)" value={bookData.summary} onChange={handleChange} maxLength={200} />
                        
                        <div className="form-group color-group">
                            <label htmlFor="color-picker">本の背表紙の色:</label>
                            <input id="color-picker" type="color" name="color" value={bookData.color} onChange={handleChange} />
                        </div>
                    </div>

                    {/* 2. ページ切り替え＆コンテンツ入力フィールド */}
                    <div className="form-section page-content-section">
                        <h2>コンテンツ (ページ管理)</h2>
                        
                        {/* 💡 ページ切り替えコントロール */}
                        <div className="page-navigation-controls">
                            <label>現在のページ:</label>
                            {/* 💡 ページ番号の入力フィールド */}
                            <input 
                                type="number" 
                                min="1" 
                                max={pages.length} 
                                value={currentPage} 
                                onChange={handlePageChange} 
                                className="page-number-input"
                            />
                            <span> / {pages.length} ページ</span>
                            <button type="button" onClick={handleAddPage} className="add-page-button">
                                ページを追加
                            </button>
                        </div>
                        
                        {/* 💡 ページ本文の入力エリア */}
                        <textarea 
                            name="pageContent" 
                            placeholder={`ページ ${currentPage} の本文を記述...`} 
                            value={getCurrentPageContent()} 
                            onChange={handlePageContentChange} 
                            rows={15} 
                            required 
                            className="page-content-textarea"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-button">本を公開する</button>
                        <Link to="/" className="cancel-link">キャンセルして戻る</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookPage;
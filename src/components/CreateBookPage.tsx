import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/CreateBookPage.css';
import type { PageContent } from '../data/bookData'; 
// 💡 【修正点 1】axios のインポートを削除
// import axios from 'axios'; 
// 💡 【修正点 2】新しく作成した createBook 関数をインポート
import { createBook } from '../api/bookApi'; // 💡 ファイルパスを修正: ../api/bookApi

// 1. 本の基本情報を管理
const initialBookState = {
    title: '',
    author: '',
    color: '#CCCCCC', // デフォルトカラー
    summary: '',
    imageUrl: '',
};

const initialPages: PageContent[] = [
    { pageNumber: 1, content: '' } // 常に1ページから開始
];

// 💡 【修正点 3】API_BASE_URL の直接定義を削除 (bookApi.tsで定義済みのため)
// const API_BASE_URL = 'http://localhost:8080/api/v1/books'; 

const CreateBookPage: React.FC = () => {
    // 💡 フォームの状態管理 (React Hooks)
    const [bookData, setBookData] = useState(initialBookState);
    // 💡 ページ情報の配列を管理
    const [pages, setPages] = useState<PageContent[]>(initialPages);
    // 💡 現在編集中のページ番号を管理
    const [currentPage, setCurrentPage] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false); // 💡 送信中フラグを追加（元のコードにはないが、追加を推奨）

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

    const handleSubmit = useCallback(async (e: React.FormEvent) => { 
        e.preventDefault()
        
        if (isSubmitting) return; // 二重送信防止
        
        // ページが空の場合は処理を停止
        if (pages.length === 0 || pages[0].content.trim() === '') {
            alert('ページ内容が入力されていません。');
            return;
        }

        setIsSubmitting(true); // 送信開始

        // 送信用のデータ構造を構築（Bookエンティティに合わせた形）
        const finalBookData = {
            title: bookData.title,
            author: bookData.author,
            summary: bookData.summary,
            color: bookData.color,
            imageUrl: bookData.imageUrl,
            
            // ページ内容を添付
            pages: pages.map(page => ({
                pageNumber: page.pageNumber,
                content: page.content,
            }))
        };

        try {
            // 💡 【修正点 4】 createBook 関数で API 呼び出しに置き換え
            const result = await createBook(finalBookData); 

            if (result) {
                console.log('Book created successfully:', result);
                alert('本が正常に作成されました！');
                
                // 成功後、3D図書館シーンへ遷移し、リフレッシュを促す
                navigate('/library?refresh=' + Date.now()); 
            } else {
                // createBookがnullを返した場合（APIエラーハンドリング内でconsole.errorが出力されている）
                alert('本の作成に失敗しました。コンソールを確認してください。');
            }

        } catch (error) {
            // ネットワークエラーなど、fetch自体が失敗した場合
            console.error('Network or unexpected error during book creation:', error);
            alert('本の作成に失敗しました。');
        } finally {
            setIsSubmitting(false); // 送信終了
        }
    }, [bookData, pages, navigate, isSubmitting]); // 依存配列に isSubmitting を追加

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
                            disabled={isSubmitting} // 💡 送信中は無効化
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? '公開中...' : '本を公開する'}
                        </button>
                        <Link to="/" className="cancel-link">キャンセルして戻る</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookPage;
// src/components/BookDetailPage.tsx (API連携 最終版)

import { useEffect, useState } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; 
// 💡 BookMetadataの型定義をインポート
import type { BookMetadata } from '../data/bookData'; 
// import { findBookById } from '../data/bookData'; // ダミーデータ関数は不要なので削除
import '../css/BookDetailPage.css'; 


// 💡 APIエンドポイントの定義
const API_BASE_URL = 'http://localhost:8080/api/v1/books'; 


// ----------------------------------------------------
// 本の詳細ページ (APIデータ取得版)
// ----------------------------------------------------
function BookDetailPage() {
    // 1. URLパラメータからIDを取得
    const { id } = useParams(); 
    const bookId = Number(id);

    // 2. 状態変数を定義
    const [book, setBook] = useState<BookMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 3. データ取得ロジック
    useEffect(() => {
        // IDが無効な場合は処理を中断
        if (!bookId || isNaN(bookId)) {
            setError("無効な書籍IDです。");
            setIsLoading(false);
            return;
        }

        const fetchBook = async () => {
            setIsLoading(true); 
            try {
                // API: GET /api/v1/books/{id} を呼び出し
                const response = await axios.get<BookMetadata>(`${API_BASE_URL}/${bookId}`);
                setBook(response.data);
                setError(null);
            } catch (err) {
                console.error(`Failed to fetch book ${bookId}:`, err);
                // エラーメッセージを設定
                setError(`ID: ${bookId} に対応する書籍が見つかりませんでした。サーバーが起動しているか、IDが正しいか確認してください。`);
                setBook(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBook();
    }, [bookId]); // bookIdが変更されたときに再実行


    const overlayClass = "book-detail-overlay";

    // 4. ローディング状態の表示
    if (isLoading) {
        return (
            <div className={`${overlayClass} loading-state`}>
                <h1>書籍データを読み込み中...</h1>
            </div>
        );
    }
    
    // 5. エラーまたは本が見つからなかった場合の表示
    if (error || !book) {
        return (
            <div className={`${overlayClass} error-state`}>
                <h1 style={{color: '#E53E3E'}}>Error: Book Not Found</h1>
                <p style={{fontSize: '1.2em'}}>{error || `ID: ${id} に対応する本は見つかりませんでした。`}</p>
                <Link to="/library" className="book-detail-return-link">
                    図書館に戻る
                </Link>
            </div>
        );
    }

    // 6. 正常な詳細情報の表示
    return (
        <div className={overlayClass}>
            <h1 style={{ borderBottom: `3px solid ${book.color}`, paddingBottom: '10px' }}>{book.title}</h1>
            
            <div className="book-detail-content">
                <img 
                    src={book.imageUrl} 
                    alt={book.title} 
                    style={{ width: '200px', height: 'auto', border: `5px solid ${book.color}` }} 
                />
                <div>
                    <p className="book-detail-author">著者: {book.author}</p>
                    <p className="book-detail-summary">{book.summary}</p>
                    <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>* Book ID: {book.id}</p>
                </div>
            </div>
            
            <Link to="/library" className="book-detail-return-link">
                図書館に戻る
            </Link>
        </div>
    );
}

export default BookDetailPage;
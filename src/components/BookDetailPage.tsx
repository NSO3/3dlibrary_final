// src/components/BookDetailPage.tsx

import { useParams, Link } from 'react-router-dom';
// 💡 データファイルへのインポートパスを調整
import type { BookMetadata } from '../data/bookData'; 
import { findBookById } from '../data/bookData';
import '../css/BookDetailPage.css'; 


// ----------------------------------------------------
// 本の詳細ページ (App.tsxから移動)
// ----------------------------------------------------
function BookDetailPage() {
    const { id } = useParams(); 
    const bookId = Number(id);

    // findBookById は App.tsx でのインポートをそのまま使用
    const book: BookMetadata | undefined = findBookById(bookId);

    const overlayClass = "book-detail-overlay";

    if (!book) {
        return (
            <div className={`${overlayClass} error-state`}>
                <h1 style={{color: '#E53E3E'}}>Error: Book Not Found</h1>
                <p style={{fontSize: '1.2em'}}>ID: {id} に対応する本は見つかりませんでした。</p>
                <Link to="/" className="book-detail-return-link">
                    図書館に戻る
                </Link>
            </div>
        );
    }
    
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
            
            <Link to="/" className="book-detail-return-link">
                図書館に戻る
            </Link>
        </div>
    );
}

export default BookDetailPage;
// src/App.tsx (リファクタリング後の最終版)

import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

// 💡 分離したコンポーネントをインポート
import LibraryScene from './scenes/LibraryScene'; 
import BookDetailPage from './components/BookDetailPage'; 
import TopPage from './components/TopPage';
import CreateBookPage from './components/CreateBookPage';
import SearchPage from './components/SearchPage'; 
import ContactPage from './components/ContactPage';
import Home from './components/Home';
import EmptyPlaceholder from './components/EmptyPlaceholder';

// ----------------------------------------------------
// メインのAppコンポーネント
// ----------------------------------------------------
function App() {
    return (
        <BrowserRouter>
            {/* LibraryScene (3D) を Routes の外側で常にレンダリング */}
            <LibraryScene />
            
            <Routes>
                <Route path="/" element={<TopPage />} /> 
                <Route path="/library" element={<Home />} /> 
                <Route path="/create-book" element={<CreateBookPage />} />
                <Route path="/search" element={<SearchPage />} />
                {/* 💡 【新規追加】お問い合わせ機能のルート */}
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/book/:id" element={<BookDetailPage />} />
                <Route path="/focus/:id" element={<EmptyPlaceholder />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
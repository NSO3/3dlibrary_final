// src/App.tsx (リファクタリング後の最終版)

import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

// 💡 分離したコンポーネントをインポート
import LibraryScene from './scenes/LibraryScene'; 
import BookDetailPage from './components/BookDetailPage'; 
import TopPage from './components/TopPage';
import CreateBookPage from './components/CreateBookPage';
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
                {/* 💡 【修正点１】ルートパス("/")をTopPageに割り当て */}
                <Route path="/" element={<TopPage />} /> 
                
                {/* 💡 【修正点２】従来のライブラリシーンを新しいパス("/library")に移動 */}
                <Route path="/library" element={<Home />} /> 
                {/* 💡 【新規追加】本の作成機能のルート */}
                <Route path="/create-book" element={<CreateBookPage />} />
                <Route path="/book/:id" element={<BookDetailPage />} />
                <Route path="/focus/:id" element={<EmptyPlaceholder />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
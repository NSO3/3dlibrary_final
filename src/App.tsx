// src/App.tsx (リファクタリング後の最終版)

import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

// 💡 分離したコンポーネントをインポート
import LibraryScene from './scenes/LibraryScene'; 
import BookDetailPage from './components/BookDetailPage'; 

// 既存のコンポーネント
import Home from './components/Home';
import EmptyPlaceholder from './components/EmptyPlaceholder';

// ★ 以前あった、Canvas, useThree, Environment, Bookshelf, Floor, Wall などの
// Three.js関連のインポートは LibraryScene.tsx に移動しました。

// ★ LibraryScene と BookDetailPage 関数も削除されました。

// ----------------------------------------------------
// メインのAppコンポーネント
// ----------------------------------------------------
function App() {
    return (
        <BrowserRouter>
            {/* LibraryScene (3D) を Routes の外側で常にレンダリング */}
            <LibraryScene />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/book/:id" element={<BookDetailPage />} />
                <Route path="/focus/:id" element={<EmptyPlaceholder />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
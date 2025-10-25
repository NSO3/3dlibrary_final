// src/hooks/useCameraFocusState.ts

import { useLocation } from 'react-router-dom';

/**
 * 現在のルーティングパスに基づき、カメラの状態を判定するカスタムフック
 * @returns {object} 現在のカメラの状態を示すブール値とターゲットID
 */
export const useCameraFocusState = () => {
    const location = useLocation(); 

    const isFocusing = location.pathname.startsWith('/focus/');
    const isDetailPage = location.pathname.startsWith('/book/');
    
    // /focus/:id または /book/:id のいずれかからIDを抽出
    const bookIdPath = isFocusing || isDetailPage 
        ? location.pathname.split('/')[2] 
        : null;
    
    const bookId = bookIdPath ? Number(bookIdPath) : null;
    
    // ズームイン対象のIDオフセットを計算 (1000, 2000, ...)
    const offsetId = bookId ? Math.floor(bookId / 1000) * 1000 : null;

    return {
        isFocusing,     // /focus/:id にいるか？ (アニメーション実行フラグ)
        isDetailPage,   // /book/:id にいるか？ (オーバーレイ表示フラグ)
        bookId,         // 現在対象となっている本のID
        offsetId,       // 本棚のオフセットID (例: 1000)
        isHome: location.pathname === '/' // ホーム画面にいるか？
    };
};
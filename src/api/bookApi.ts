// src/data/bookApi.ts (デバッグ情報出力のための修正)

import type { BookMetadata } from '../data/bookData'; 

const API_BASE_URL = 'http://localhost:8080/api/v1/books';

export const searchBooks = async (query: string): Promise<BookMetadata[]> => {
    if (!query) {
        return [];
    }

    let responseText = ''; // 💡 レスポンステキストを格納する変数を定義

    try {
        console.error(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        
        // 💡 応答のテキストを一度取得し、responseTextに保持
        // response.text() は一度しか実行できないため、ここで実行します
        responseText = await response.text(); 
        
        // 💡 HTTPステータスが200番台以外の場合
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}. Returning empty results.`);
            // HTTPエラーが発生した場合、responseText (HTMLなど) をコンソールに出力
            console.error("Server Response (Non-OK Status):", responseText);
            return [];
        }
        
        // 💡 JSON形式に変換
        // responseTextがJSON文字列であることを期待してパースします
        const data: BookMetadata[] = JSON.parse(responseText); 
        return data;
        
    } catch (error) {
        // 💡 ネットワークエラーやJSONパースエラー（今回のSyntaxError）が発生した場合
        console.error("Book search API failed (Network or JSON Parse Error):", error);
        
        // 💡 エラーの原因となったレスポンス全体をコンソールに出力
        if (responseText) {
            console.warn("--- Raw Server Response (Check for HTML/Proxy Error) ---");
            console.log(responseText.substring(0, 5000) + (responseText.length > 5000 ? '...' : '')); // 長すぎる場合は一部を切り詰める
            console.warn("-------------------------------------------------------");
        } else {
            console.warn("No server response received (Network failure).");
        }
        
        // UIには影響を与えず、空の配列を返す
        return []; 
    }
};
// 💡 他のAPI関数 (fetchAllBooks, createBook) もここに追加されます
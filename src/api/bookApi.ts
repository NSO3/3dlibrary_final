// src/data/bookApi.ts (API関数統合＆エラー処理改善版)

import type { BookMetadata } from '../data/bookData'; // 適切な型定義をインポート

const API_BASE_URL = 'http://localhost:8080/api/v1/books';

/**
 * API応答のエラー処理とJSONパースを担う共通ヘルパー関数
 */
const handleApiResponse = async (response: Response, errorMessage: string) => {
    if (!response.ok) {
        // 💡 エラー発生時の処理（以前のデバッグロジックを統合）
        console.error(`${errorMessage}. Status: ${response.status}. URL: ${response.url}`);
        
        let errorText = '';
        try {
            // エラーログ出力のためにテキストを取得（JSONパースエラーを避けるため先に実行）
            errorText = await response.text();
        } catch (e) {
            errorText = 'Could not read response text.';
        }

        if (errorText.includes('<!doctype html>')) {
            // 💡 HTMLが返された場合 (Proxy/Fallbackエラー)
            console.error("--- Raw Server Response (Proxy/Fallback Error) ---");
            console.log(errorText.substring(0, 5000) + (errorText.length > 5000 ? '...' : ''));
            console.warn("-------------------------------------------------------");
        } else {
            console.error("Server Response:", errorText.substring(0, 5000));
        }
        
        // 呼び出し元でキャッチできるように例外を投げる
        throw new Error("API call failed.");
    }

    try {
        // 💡 成功時はJSONパース
        return await response.json();
    } catch (e) {
        console.error("JSON parsing failed:", e);
        throw new Error("Failed to parse response as JSON.");
    }
};


// --- 1. 書籍作成 (POST /api/v1/books) ---
export const createBook = async (bookData: Partial<BookMetadata>): Promise<BookMetadata | null> => {
    try {
        const url = API_BASE_URL;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        // 成功すれば BookMetadata (登録された書籍データ) を返す
        return await handleApiResponse(response, "Book creation failed");
    } catch (error) {
        console.error("Book creation API failed:", error);
        return null; 
    }
};

// --- 2. 書籍メタデータ全件取得 (GET /api/v1/books) ---
export const fetchAllBooks = async (): Promise<BookMetadata[]> => {
    try {
        const url = API_BASE_URL;
        const response = await fetch(url);
        
        const data = await handleApiResponse(response, "Failed to fetch all books");
        return data as BookMetadata[];
    } catch (error) {
        console.error("Fetch all books API failed:", error);
        return [];
    }
};

// --- 3. 書籍詳細取得 (GET /api/v1/books/{id}) ---
export const fetchBookById = async (id: number): Promise<BookMetadata | null> => {
    try {
        const url = `${API_BASE_URL}/${id}`;
        const response = await fetch(url);

        // 成功すれば BookMetadata (単一の書籍データ) を返す
        const data = await handleApiResponse(response, `Failed to fetch book with ID ${id}`);
        return data as BookMetadata;
    } catch (error) {
        console.error(`Fetch book by ID ${id} failed:`, error);
        return null;
    }
};

// --- 4. 書籍検索 (GET /api/v1/books/search?q={query}) ---
// 💡 修正済み: searchBooks のロジックを handleApiResponse に置き換え
export const searchBooks = async (query: string): Promise<BookMetadata[]> => {
    if (!query) return [];

    try {
        const url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        
        const data = await handleApiResponse(response, `Failed to search books with query: ${query}`);
        return data as BookMetadata[];
    } catch (error) {
        console.error("Book search API failed:", error);
        return [];
    }
};
// src/utils/constants.ts

import * as THREE from 'three';

/**
 * 3Dシーン全体で使用される静的な定数
 */

// ----------------------------------------------------
// カメラの初期設定
// ----------------------------------------------------
export const DEFAULT_POSITION = new THREE.Vector3(20, 10, 20); 
export const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);       

// ----------------------------------------------------
// 本棚とフォーカス位置の設定
// ----------------------------------------------------
// ズームイン時のカメラのオフセット（ターゲットからどれだけ離れるか）
export const ZOOM_OFFSET_X = 2.5; 
// 本棚モデルの垂直方向の中心Y座標 (App.tsxとBookshelf.tsxの調整結果から算出)
export const BOOKSHELF_MODEL_Y_CENTER = -3.0; 

// Book IDの1000の位に基づく本棚のグループ位置（App.tsxでBookshelfに渡しているposition）
// ズームイン時のターゲット位置計算の基準となる
export const BOOKSHELF_OFFSETS: Record<number, [number, number, number]> = {
    1000: [-7.5, -5, 0],   
    2000: [-7.5, -5, 10],  
    3000: [7.5, -5, 0],    
    4000: [7.5, -5, 10],   
};
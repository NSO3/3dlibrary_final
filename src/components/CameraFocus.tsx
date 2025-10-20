// src/components/CameraFocus.tsx (カメラ位置維持修正版)

import { CameraControls } from '@react-three/drei';
import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import * as THREE from 'three';

// 💡 定数 (変更なし)
const DEFAULT_POSITION = new THREE.Vector3(20, 10, 20); 
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);       
const ZOOM_OFFSET_X = 2.5; 
const BOOKSHELF_MODEL_Y_CENTER = -3.0; // 本棚のモデル中心
const BOOKSHELF_OFFSETS: Record<number, [number, number, number]> = {
    1000: [-7.5, -5, 0],   
    2000: [-7.5, -5, 10],  
    3000: [7.5, -5, 0],    
    4000: [7.5, -5, 10],   
};

const CameraFocus: React.FC = () => {
  // @ts-ignore で型エラー回避を維持
  const controlsRef = useRef<CameraControls | any>(null); 
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  const isFocusing = location.pathname.startsWith('/focus/');
  const isDetailPage = location.pathname.startsWith('/book/');
  
  const bookIdPath = isFocusing || isDetailPage 
    ? location.pathname.split('/')[2] 
    : null;
  const bookId = bookIdPath ? Number(bookIdPath) : null;

  useEffect(() => {
    const controls = controlsRef.current as any;
    if (!controls) return;

    const handleFocusAnimation = async () => {
        if (isFocusing && bookId) { 
            // ------------------------------------------------
            // 1. /focus/ の処理 (アニメーション実行)
            // ------------------------------------------------
            const offsetId = Math.floor(bookId / 1000) * 1000;
            const shelfOffsetPosition = BOOKSHELF_OFFSETS[offsetId];

            if (shelfOffsetPosition) {
                controls.enabled = false; 

                const targetX = shelfOffsetPosition[0];
                const targetY = BOOKSHELF_MODEL_Y_CENTER; 
                const targetZ = shelfOffsetPosition[2];
                
                // カメラ位置は本棚の中心Zを維持しつつ、手前にXオフセット
                const cameraX = targetX + (targetX > 0 ? -1 : 1) * ZOOM_OFFSET_X;
                const cameraY = targetY + 0.5; // 少し上から見下ろす
                const cameraZ = targetZ; 
                
                try {
                    await controls.setLookAt(
                        cameraX, cameraY, cameraZ, 
                        targetX, targetY, targetZ, 
                        true // アニメーションを有効化
                    );
                    
                    // アニメーション完了後、/book/ に遷移
                    navigate(`/book/${bookId}`); 
                    
                } catch (e) {
                    controls.enabled = true;
                    console.error("Camera animation failed:", e);
                }
            }
        } else if (isDetailPage) { // 💡 【修正点１】/book/ の詳細ページにいる場合
            // ------------------------------------------------
            // 2. /book/ の処理 (カメラ位置を維持し、操作を無効化)
            // ------------------------------------------------
            // setLookAt を実行せず、現在のカメラ位置を維持する
            controls.enabled = false; // 詳細画面が表示されている間は操作禁止
            
        } else {
            // ------------------------------------------------
            // 3. / (ホーム) の処理 (初期位置に戻し、操作を有効化)
            // ------------------------------------------------

            // 💡 【修正点】操作権限を有効化するロジックを最上位に移動し、
            //      さらにアニメーションが完了した場合にのみ実行するように修正。
            controls.enabled = true; // 👈 重要な修正: コントロールを有効に戻す

            // 💡 【修正点２】アニメーション中でない場合にのみ実行する (不要なアニメーションを防ぐ)
            if (!controls.isAnimating()) { 
                 controls.setLookAt(
                    DEFAULT_POSITION.x, DEFAULT_POSITION.y, DEFAULT_POSITION.z,
                    DEFAULT_TARGET.x, DEFAULT_TARGET.y, DEFAULT_TARGET.z,
                    true
                );
            }
        }
    };
    
    handleFocusAnimation();
    
  }, [location.pathname, isFocusing, isDetailPage, bookId, navigate]);


  // @ts-ignore
  return (
    <CameraControls 
        ref={controlsRef} 
    />
  );
};

export default CameraFocus;
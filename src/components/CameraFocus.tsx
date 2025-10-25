// src/components/CameraFocus.tsx (リファクタリング後の最終版)

import { CameraControls } from '@react-three/drei';
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useCameraFocusState } from '../hooks/useCameraFocusState'; // 💡 カスタムフックをインポート
import { 
    DEFAULT_POSITION, 
    DEFAULT_TARGET, 
    BOOKSHELF_OFFSETS, 
    BOOKSHELF_MODEL_Y_CENTER, 
    ZOOM_OFFSET_X 
} from '../utils/constants'; // 💡 定数をインポート

const CameraFocus: React.FC = () => {
  // @ts-ignore
  const controlsRef = useRef<CameraControls | any>(null); 
  const navigate = useNavigate(); 
  
  // 💡 【修正点】カスタムフックから状態を取得
  const { isFocusing, isDetailPage, bookId, offsetId } = useCameraFocusState();

  useEffect(() => {
    const controls = controlsRef.current as any;
    if (!controls) return;

    const handleFocusAnimation = async () => {
        if (isFocusing && bookId && offsetId) { 
            // ------------------------------------------------
            // 1. /focus/ の処理 (アニメーション実行)
            // ------------------------------------------------
            const shelfOffsetPosition = BOOKSHELF_OFFSETS[offsetId];

            if (shelfOffsetPosition) {
                controls.enabled = false; 

                // 💡 【修正点】定数を利用してターゲット位置を計算
                const targetX = shelfOffsetPosition[0];
                const targetY = BOOKSHELF_MODEL_Y_CENTER; 
                const targetZ = shelfOffsetPosition[2];
                
                const cameraX = targetX + (targetX > 0 ? -1 : 1) * ZOOM_OFFSET_X;
                const cameraY = targetY + 0.5;
                const cameraZ = targetZ; 
                
                try {
                    await controls.setLookAt(
                        cameraX, cameraY, cameraZ, 
                        targetX, targetY, targetZ, 
                        true 
                    );
                    
                    navigate(`/book/${bookId}`); 
                    
                } catch (e) {
                    controls.enabled = true;
                    console.error("Camera animation failed:", e);
                }
            }
        } else if (isDetailPage) { 
            // ------------------------------------------------
            // 2. /book/ の処理 (カメラ位置を維持し、操作を無効化)
            // ------------------------------------------------
            controls.enabled = false; 
            
        } else {
            // ------------------------------------------------
            // 3. / (ホーム) の処理 (初期位置に戻し、操作を有効化)
            // ------------------------------------------------
            
            controls.enabled = true; 
            
            if (typeof controls.isAnimating === 'function' && !controls.isAnimating()) { 
                 // 💡 【修正点】定数を利用して初期位置へ戻る
                 controls.setLookAt(
                    DEFAULT_POSITION.x, DEFAULT_POSITION.y, DEFAULT_POSITION.z,
                    DEFAULT_TARGET.x, DEFAULT_TARGET.y, DEFAULT_TARGET.z,
                    true
                );
            }
        }
    };
    
    handleFocusAnimation();
    
  // 💡 【修正点】依存配列もカスタムフックから取得した値に依存するように変更可能（ここでは location.pathname に依存することで広範囲をカバー）
  }, [isFocusing, isDetailPage, bookId, offsetId, navigate, controlsRef]);


  // @ts-ignore
  return (
    <CameraControls 
        ref={controlsRef} 
    />
  );
};

export default CameraFocus;
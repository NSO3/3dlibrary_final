// src/components/CameraFocus.tsx (最終確定版: 操作性回復 + 視線基準ズーム)

import { CameraControls } from '@react-three/drei';
import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useThree } from '@react-three/fiber';
import { useCameraFocusState } from '../hooks/useCameraFocusState'; 
import * as THREE from 'three'; 

// ----------------------------------------------------
// 💡 URLから座標のみを取得するヘルパー関数
// ----------------------------------------------------
const getParamsFromUrl = (search: string): { position: THREE.Vector3 | null } => {
    const params = new URLSearchParams(search);
    const posString = params.get('pos');
    
    if (!posString) return { position: null };

    const [x, y, z] = posString.split(',').map(Number);
    if (isNaN(x) || isNaN(y) || isNaN(z)) return { position: null };

    return { position: new THREE.Vector3(x, y, z) };
};


const CameraFocus: React.FC = () => { 
  // @ts-ignore
  const controlsRef = useRef<CameraControls | any>(null); 
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const { camera } = useThree(); 
  
  const { isFocusing, isDetailPage, bookId } = useCameraFocusState(); 
  
  useEffect(() => {
    const controls = controlsRef.current as any;
    if (!controls) return;
    
    const { position: bookWorldPosition } = getParamsFromUrl(location.search);
    
    const handleFocusAnimation = async () => {
        // ------------------------------------------------
        // 1. /focus/ の処理 (アニメーション実行)
        // ------------------------------------------------
        if (isFocusing && bookId && bookWorldPosition) { 
            
            controls.enabled = false; 

            // ズームイン時のLookAt位置（本の中心）
            const targetX = bookWorldPosition.x;
            const targetY = bookWorldPosition.y;
            const targetZ = bookWorldPosition.z;

            // カメラの現在位置を取得
            const currentCameraPosition = new THREE.Vector3();
            camera.getWorldPosition(currentCameraPosition);
            
            const offsetDistance = 3.0; // 本から離れる距離

            // 現在のカメラ位置からターゲット（本）への方向ベクトルを計算
            const direction = new THREE.Vector3()
                .subVectors(bookWorldPosition, currentCameraPosition) 
                .normalize(); 

            // カメラの最終位置を決定
            const cameraFinalPosition = new THREE.Vector3()
                .copy(bookWorldPosition)
                .add(direction.multiplyScalar(-offsetDistance)); 
            cameraFinalPosition.y += 0.5; // わずかなY軸の調整

            try {
                // アニメーションを待機
                await controls.setLookAt(
                    cameraFinalPosition.x, cameraFinalPosition.y, cameraFinalPosition.z, 
                    targetX, targetY, targetZ, 
                    true 
                ); 
                
                // アニメーション完了後に /book/:id に遷移
                navigate(`/book/${bookId}`); 
                
            } catch (e) {
                controls.enabled = true;
                console.error("Camera animation failed:", e);
            }
            
        } else if (isDetailPage) { 
            // ------------------------------------------------
            // 2. /book/ の処理 (カメラ位置を維持し、操作を無効化)
            // ------------------------------------------------
            controls.enabled = false; 
            
        } else {
            // ------------------------------------------------
            // 3. /library や / などの操作可能な画面の処理 (初期位置に戻るロジックを維持)
            // ------------------------------------------------
            // 💡 修正の核心:
            // controls.enabled = true; の実行が暗黙のリセットを誘発するため、
            // controls.enabled が false であり、かつ isFocusing が false の時のみ true に戻す。
            // これにより、アニメーション開始の瞬間（isFocusing=true）に else ブロックが誤って実行されるのを防ぐ。
            
            if (controls.enabled === false || !isFocusing) {
                controls.enabled = true;
            }
        }
    };
    
    handleFocusAnimation();
    
  }, [isFocusing, isDetailPage, bookId, navigate, controlsRef, location.pathname, location.search, camera]); 


  // @ts-ignore
  return (
    <CameraControls 
        ref={controlsRef} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 2} 
        minDistance={1}             // 💡 操作性を確保するため、1を維持
        maxDistance={50}            
        truckSpeed={5}              // 💡 修正: パン操作を有効化
        dollySpeed={1}              // 💡 修正: ズーム操作を有効化
    />
  );
};

export default CameraFocus;
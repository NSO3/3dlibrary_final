import React from 'react';
import * as THREE from 'three';

const Wall: React.FC = () => {
    const WALL_Y_POSITION = -5 + 50; 
    
    return (
        // 後ろの壁 (Z軸のマイナス方向、本棚の向こう側)
        <mesh position={[0, WALL_Y_POSITION, -50]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial 
                color="#E0E0E0" 
                side={THREE.DoubleSide} 
                // 💡 壁の光沢も抑える
                roughness={0.9} 
                metalness={0.0}
                // 💡 環境マップの影響も抑える
                envMapIntensity={0.1}
            />
        </mesh>
    );
};

export default Wall;
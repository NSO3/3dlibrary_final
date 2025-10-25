// src/components/Home.tsx

import React from 'react';
// Homeコンポーネントは、このアプリケーションのメインビュー（本棚など）をレンダリングする役割を担います。
// 現状、3Dシーン全体がApp.tsxでレンダリングされているため、ここでは単にラッパーとして機能させます。

const Home: React.FC = () => {
  // 将来的には、ここにBookShelfなどの3D要素を配置し、
  // LibrarySceneのchildrenとして渡す設計にすると整理しやすいです。

  return (
    // ホーム画面特有のUIオーバーレイ（例：タイトルロゴなど）を配置する場合はここに記述
    <></>
  );
};

export default Home;
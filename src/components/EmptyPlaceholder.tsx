// src/components/EmptyPlaceholder.tsx

import React from 'react';

// /focus/:id ルートの警告を解消するためのプレースホルダ。
// CameraFocus.tsxがすぐに/book/:idにリダイレクトするため、
// このコンポーネントが何かを表示する必要はありません。

const EmptyPlaceholder: React.FC = () => {
  // このコンポーネントが表示されても、すぐにリダイレクトされるため、
  // 何もレンダリングせずに<></>（フラグメント）を返します。
  return <></>;
};

export default EmptyPlaceholder;
// PageContentの型を定義
export interface PageContent {
    pageNumber: number;
    content: string; // ページの本文
    // 💡 将来的な拡張のためのフィールド
    // imageUrl?: string; 
}

// 本のデータの型定義 
export interface BookMetadata {
  id: number;
  title: string;
  author: string;
  color: string;
  summary: string;
  imageUrl: string;
  pages: PageContent[];
}

// 💡 24個のダミーデータ
export const BOOKS_DATA: BookMetadata[] = [
  {
    id: 1001,
    title: '3Dライブラリ設計入門',
    author: 'ジェミニ開発チーム',
    color: '#007BFF', // Blue
    summary: 'React Three Fiberによる3Dウェブサイトの基盤構築とアーキテクチャ設計を学ぶ。',
    imageUrl: 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Book+1001',
     pages: [],
  },
  {
    id: 1002,
    title: 'TypeScript徹底ガイド',
    author: 'ウェブ技術研究会',
    color: '#38B2AC', // Teal
    summary: '大規模開発における静的型付けの恩恵と高度なユーティリティ型を解説。',
    imageUrl: 'https://via.placeholder.com/150/38B2AC/FFFFFF?text=Book+1002',
    pages: [],
  },
  {
    id: 1003,
    title: 'Three.jsシェーダー基礎',
    author: 'マテリアルアーティスト',
    color: '#D53F8C', // Pink
    summary: 'GLSL言語を使ったカスタムマテリアルとエフェクトの作り方をステップバイステップで習得。',
    imageUrl: 'https://via.placeholder.com/150/D53F8C/FFFFFF?text=Book+1003',
    pages: [],
  },
  {
    id: 1004,
    title: 'React Hooks パフォーマンス大全',
    author: 'フロントエンド最適化協会',
    color: '#F6AD55', // Orange
    summary: 'useMemo, useCallback, useEffectの依存関係とレンダリング最適化テクニック集。',
    imageUrl: 'https://via.placeholder.com/150/F6AD55/FFFFFF?text=Book+1004',
    pages: [],
  },
  {
    id: 2001,
    title: 'ライティングと影の技術',
    author: '3Dレンダラー',
    color: '#4A5568', // Gray
    summary: 'PBRに基づいた光と影の計算、およびDirectional Lightのシャドウ調整方法。',
    imageUrl: 'https://via.placeholder.com/150/4A5568/FFFFFF?text=Book+1005',
    pages: [],
  },
  {
    id: 2002,
    title: 'Webアニメーション事典',
    author: 'モーションデザイナー',
    color: '#6B46C1', // Purple
    summary: 'CSSアニメーションからReact Springまで、Webで使うアニメーション技術を網羅。',
    imageUrl: 'https://via.placeholder.com/150/6B46C1/FFFFFF?text=Book+1006',
    pages: [],
  },
  {
    id: 2003,
    title: '3Dモデル圧縮とGLB',
    author: 'データエンジニア',
    color: '#3182CE', // Strong Blue
    summary: '大容量の3Dモデルを軽量化し、ウェブで高速表示するための秘訣。',
    imageUrl: 'https://via.placeholder.com/150/3182CE/FFFFFF?text=Book+1007',
    pages: [],
  },
  {
    id: 2004,
    title: 'React Router v6 実践',
    author: 'ナビゲーション専門家',
    color: '#38A169', // Green
    summary: 'useNavigate, useParamsを活用したSPAのルーティング設計。',
    imageUrl: 'https://via.placeholder.com/150/38A169/FFFFFF?text=Book+1008',
    pages: [],
  },
  {
    id: 3001,
    title: 'ノーコード3Dデザイン',
    author: '非開発者協会',
    color: '#ECC944', // Yellow
    summary: 'BlenderやFigmaを使った非プログラミングでの3Dアセット作成術。',
    imageUrl: 'https://via.placeholder.com/150/ECC944/FFFFFF?text=Book+1009',
    pages: [],
  },
  {
    id: 3002,
    title: 'PBRテクスチャの錬金術',
    author: 'サーフェスアーティスト',
    color: '#C53030', // Red-Brown
    summary: '物理ベースレンダリングにおけるAlbedo, Roughness, Metalnessの設計。',
    imageUrl: 'https://via.placeholder.com/150/C53030/FFFFFF?text=Book+1010',
    pages: [],
  },
  // --- 棚3 - ID 1000番台（3段目、1011から1018） ---
  {
    id: 3003,
    title: 'モバイル3D最適化',
    author: 'モバイル技術者',
    color: '#00B5AD', // Cyan
    summary: 'スマートフォンでのWeb 3Dパフォーマンスを向上させるための秘訣。',
    imageUrl: 'https://via.placeholder.com/150/00B5AD/FFFFFF?text=Book+1011',
    pages: [],
  },
  {
    id: 3004,
    title: '環境光と露出のバランス',
    author: '写真家/3Dアーティスト',
    color: '#718096', // Slate Gray
    summary: 'HDR環境マップと`toneMappingExposure`による理想的なシーンの明るさ調整。',
    imageUrl: 'https://via.placeholder.com/150/718096/FFFFFF?text=Book+1012',
    pages: [],
  },
  {
    id: 4001,
    title: 'CSS in JS 完全ガイド',
    author: 'スタイリングのエキスパート',
    color: '#D5570E', // Dark Orange
    summary: 'Emotion, Styled Componentsを使った大規模アプリケーションのCSS管理。',
    imageUrl: 'https://via.placeholder.com/150/D5570E/FFFFFF?text=Book+1013',
    pages: [],
  },
  {
    id: 4002,
    title: 'カスタムHook作成術',
    author: 'React設計者',
    color: '#0058A3', // Deep Blue
    summary: '再利用可能でクリーンなロジックをカプセル化するためのカスタムHook設計パターン。',
    imageUrl: 'https://via.placeholder.com/150/0058A3/FFFFFF?text=Book+1014',
    pages: [],
  },
  {
    id: 4003,
    title: 'Web Assemblyと3D',
    author: '高性能コンピューティング',
    color: '#805AD5', // Lavender
    summary: 'C++コードをWebAssemblyに変換し、ブラウザで超高速に実行する方法。',
    imageUrl: 'https://via.placeholder.com/150/805AD5/FFFFFF?text=Book+1015',
    pages: [],
  },
  {
    id: 4004,
    title: '3Dカメラ制御の極意',
    author: 'インタラクティブデザイン',
    color: '#E53E3E', // Red
    summary: 'OrbitControls, MapControlsなどを使った直感的で快適なカメラ操作の実装。',
    imageUrl: 'https://via.placeholder.com/150/E53E3E/FFFFFF?text=Book+1016',
    pages: [],
  },
  {
    id: 5001,
    title: 'WebGLレンダリングパイプライン',
    author: 'グラフィックスエンジニア',
    color: '#00A3C4', // Cyan Blue
    summary: '頂点シェーダーからフラグメントシェーダーまでの処理フローを徹底解剖。',
    imageUrl: 'https://via.placeholder.com/150/00A3C4/FFFFFF?text=Book+1017',
    pages: [],
  },
  {
    id: 5002,
    title: 'ウェブセキュリティの基礎',
    author: 'セキュリティアナリスト',
    color: '#2F855A', // Dark Green
    summary: 'XSS, CSRF対策からHTTPS, CSPの設定まで、ウェブアプリケーションの防御戦略。',
    imageUrl: 'https://via.placeholder.com/150/2F855A/FFFFFF?text=Book+1018',
    pages: [],
  },
  // --- 棚4 - ID 1000番台（4段目、1019から1024） ---
  {
    id: 5003,
    title: 'パフォーマンス計測入門',
    author: 'Web Vitals専門家',
    color: '#B83280', // Magenta
    summary: 'LCP, FID, CLSなどのWeb Vitalsを計測し、ユーザー体験を改善する手法。',
    imageUrl: 'https://via.placeholder.com/150/B83280/FFFFFF?text=Book+1019',
    pages: [],
  },
  {
    id: 5004,
    title: 'リアクティブプログラミング',
    author: 'RxJSマイスター',
    color: '#F6AD55', // Gold
    summary: '非同期処理をストリームとして扱い、宣言的なコードで複雑な状態を管理。',
    imageUrl: 'https://via.placeholder.com/150/F6AD55/FFFFFF?text=Book+1020',
    pages: [],
  },
  {
    id: 6001,
    title: 'GitとGitHubの高度な使い方',
    author: 'DevOpsエンジニア',
    color: '#1A202C', // Black
    summary: 'rebase, cherry-pick, submoduleなど、チーム開発で役立つ上級テクニック。',
    imageUrl: 'https://via.placeholder.com/150/1A202C/FFFFFF?text=Book+1021',
    pages: [],
  },
  {
    id: 6002,
    title: 'デザインシステム構築論',
    author: 'UI/UXデザイナー',
    color: '#00BFFF', // Sky Blue
    summary: '再利用可能なコンポーネントとガイドラインを整備し、一貫したデザインを実現。',
    imageUrl: 'https://via.placeholder.com/150/00BFFF/FFFFFF?text=Book+1022',
    pages: [],
  },
  {
    id: 6003,
    title: 'npmとYarnの最新事情',
    author: 'パッケージ管理委員会',
    color: '#A0AEC0', // Light Gray
    summary: '依存関係の解決、セキュリティ、モノレポでのパッケージ管理のベストプラクティス。',
    imageUrl: 'https://via.placeholder.com/150/A0AEC0/FFFFFF?text=Book+1023',
    pages: [],
  },
  {
    id: 6004,
    title: 'レガシーコード改善ガイド',
    author: 'リファクタリングの達人',
    color: '#9C4221', // Brown
    summary: 'テストを追加しながら、安全かつ着実に古いコードベースを現代化する方法。',
    imageUrl: 'https://via.placeholder.com/150/9C4221/FFFFFF?text=Book+1024',
    pages: [],
  },
];


// IDから本を検索するためのユーティリティ関数 (変更なし)
export const findBookById = (id: number): BookMetadata | undefined => {
  return BOOKS_DATA.find(book => book.id === id);
};
📘 開発ドキュメント：UI基盤確立フェーズ
このフェーズでは、公開に向けたユーザー体験（UX）を最優先し、アプリケーションの動線と、将来のバックエンド連携を見据えた主要機能のUI基盤を構築しました。

I. プロジェクト動線とルーティングの再構築
アプリケーションの「玄関口」を整備し、3Dビューアをコア機能の一つとして位置づけるルーティング構造に変更しました。

旧パス,新パス,目的
/,/,TopPage を割り当て、アプリケーションの起点とする。
/,/library,3D図書館シーンを /library に移動し、コア機能の一つとして独立させる。
/book/:id の戻り先,/library,本詳細画面からの戻り先を、 / から /library に修正し、ユーザーが3Dシーンにスムーズに戻れるようにした。

2. ナビゲーションとルーティングの完成
TOPページ (/) に、今回実装したすべての新規機能へのナビゲーションリンクを配置しました。

機能,ルートパス,関連ファイル,役割
本の作成,/create-book,CreateBookPage.tsx,ユーザーが本を作成・編集するための基盤UI。
本の検索,/search,SearchPage.tsx,タイトルや著者で本を探すための検索UI基盤。
お問い合わせ,/contact,ContactPage.tsx,運営への問い合わせフォーム。

II. 新規機能の設計と実装
1. 本の作成機能（CreateBookPage.tsx）
この機能は、3D図書館と並ぶコア機能として、将来のJava Spring連携を見据えた以下の設計を採用しました。

① データ構造の変更（src/data/bookData.ts）
BookMetadataへの pages 導入: 本のコンテンツをページ単位で管理できるよう、BookMetadataにpages: PageContent[]配列を追加。

PageContentの整理: フィードバックに基づき、PageContentから**titleプロパティを削除**し、pageNumberとcontentのみに簡素化。

② ページ管理ロジックの導入
独立した状態管理: bookData（基本情報）と pages（コンテンツ）を独立したステートとして管理し、保存時 (handleSubmit) に統合する設計を採用し、フォームの複雑性を低減。

ページ切り替えUI: 数字入力とボタン操作により、pages配列内の**currentPage**を仲介役として、特定のページコンテンツを編集できるようにロジックを実装。

2. 検索機能（SearchPage.tsx）
グリッドUI採用: 検索結果は、3Dシーンとは異なり、Webでの一覧性を重視したグリッド形式のカードUIを採用。

ダミーフィルタリング: 現段階では、フロントエンドのダミーデータ（BOOKS_DATA）に対するフィルタリング処理を実装。API連携フェーズで、このロジックをバックエンドAPI呼び出しに置き換えます。

III. 技術的改善とバグフィックス
プロジェクトの安定性と品質を向上させるための重要な修正を行いました。

修正内容,発生原因,解決策
戻りリンクの不整合解消,BookDetailPage内の戻りリンクが / のままになっていたため、TopPageへ遷移していた。,リンクの遷移先を /library に統一。
TypeScriptのインポートエラー,CreateBookPage.tsxでPageContent型を通常のインポート（import {...}）していた。,import type { PageContent } from '...'を使用し、型専用インポートに修正 (verbatimModuleSyntax対応)。

III. 技術的改善とバグフィックス
プロジェクトの安定性と品質を向上させるための重要な修正を行いました。

修正内容	発生原因	解決策
戻りリンクの不整合解消	BookDetailPage内の戻りリンクが / のままになっていたため、TopPageへ遷移していた。	リンクの遷移先を /library に統一。
TypeScriptのインポートエラー	CreateBookPage.tsxでPageContent型を通常のインポート（import {...}）していた。	import type { PageContent } from '...'を使用し、型専用インポートに修正 (verbatimModuleSyntax対応)。

IV. 今後の課題（フェーズ2への移行）
UI基盤の確立をもってフェーズ1は完了です。次のフェーズ2では、ロードマップで共有された主要な機能の実装に着手します。

1. バックエンド連携の開始
Java Spring APIの実装: 本の作成・取得・検索のための RESTful API エンドポイントの定義と実装。

フロントエンドの改修: CreateBookPageの handleSubmit や SearchPage の handleSearch の処理を、ダミー処理から API呼び出し に置き換え。

#### A. API連携ロジックの一元化 (`refactor: API連携ロジックの一元化`)
-   **ロジック集約**: 書籍関連の全API関数（create, fetchAll, fetchById, search）を **`src/api/bookApi.ts`** に統合。
-   **エラーハンドリング**: 共通エラーハンドリングロジックを `bookApi.ts` で一元管理し、各ページコンポーネント（CreateBookPage.tsx, LibraryScene.tsx, BookDetailPage.tsx, SearchPage.tsx）から `axios` の直接利用を排除。
-   **効果**: コードの冗長性を排除し、保守性と拡張性を大幅に向上させた。

#### B. フロントエンド・アーキテクチャの整理 (`refactor: フォルダ構造の整理`)
-   ルーティングに対応するトップレベルコンポーネントを **`src/components` から `src/pages` へ**移動。
-   **効果**: コンポーネントの役割（ページ vs 共通部品）が明確化され、プロジェクト構造の可読性が向上。

#### C. 3D/UXデグレードの解消 (`fix(library): ...カメラジャンプを修正`)
-   **原因**: データ取得時（`isLoading`）に `LibraryScene.tsx` の `<Canvas>` がアンマウントされることで、カメラが初期位置に強制リセットされるデグレードが発生していた。
-   **解決策**: ローディング表示を `Canvas` の外側に配置する **CSSオーバーレイ方式**に修正。`Canvas` を常にマウント状態に保つことで、`CameraControls` の初期化を防いだ。
-   **効果**: 詳細ページから戻った際、カメラが最後にフォーカスした位置に留まる正しい挙動が回復し、安定したUXを実現。

#### D. バックエンドの構造安定化 (`Fix: Stop infinite recursion...`)
-   Java Spring Bootのエンティティ（Book/Page）間の関係性について、JSONシリアライズ時の無限再帰を防ぐため **`@JsonManagedReference` / `@JsonBackReference`** を導入。
-   DB保存時の再帰を防ぐため **`@ToString.Exclude` / `@EqualsAndHashCode.Exclude`** を導入。

2. サーバー機能の実装（ログイン必須）
下書き保存: 作成中の本を一時的にサーバーに保存する機能。

管理者機能: ログイン認証を前提とした、全ユーザーの本を管理・削除するためのUIとAPIエンドポイントの設計。
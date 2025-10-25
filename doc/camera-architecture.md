📝 Wiki: カメラ制御ロジックの連携

1. 概要: パスを利用したカメラ制御とHTML連携

このプロジェクトでは、3Dライブラリ（R3F/Three.js）とReact Router DOMのルーティングパスを「カメラの状態管理」に利用しています。

ユーザーが本をクリックしてから詳細画面が表示されるまでの動作は、2段階のパス遷移によって制御されています。

2. 主要ファイルと責務2. 主要ファイルと責務

| ファイル | 責務 | 役割 |
| ---- | ---- | ---- |
| src/hooks/useCameraFocusState.ts | 状態の判定 | 現在のURLパスを監視し、カメラがどの状態（ホーム、アニメーション中、詳細ページ）にあるかを判断するためのブール値とIDを返す。 |
| src/components/CameraFocus.tsx | カメラの制御と実行 | useCameraFocusStateから受け取った状態に基づき、CameraControlsのメソッド（setLookAt）を呼び出してアニメーションを実行したり、controls.enabledを切り替えたりする。
| src/components/Book.tsx | トリガー | 本のクリックイベントを受け取り、**/focus/:id**パスへ強制的に遷移させる。|

3. カメラ制御の2段階ルーティング設計

本のクリックから詳細画面表示まで、カメラは以下の2つのパスを経由します。

ステップ	パス	目的と処理	制御の状態
Step 1: アニメーション実行	/focus/:id	本のIDを受け取り、CameraFocus.tsxでズームアニメーションを開始する。アニメーション完了後、Maps()によって次のパスへ自動遷移する。	controls.enabled = false（アニメーション中はユーザー操作禁止）
Step 2: 詳細画面の表示	/book/:id	App.tsxの<Routes>がこのパスを検知し、HTMLのBookDetailPageをオーバーレイで表示する。カメラ位置はStep 1のズームインした位置で維持される。	controls.enabled = false（詳細画面表示中はユーザー操作禁止）

4. カメラの挙動ロジック (CameraFocus.tsx の処理)
CameraFocus.tsxのuseEffectは、useCameraFocusStateから受け取る状態に応じて、以下の3つの排他的な処理を実行します。

① アニメーション実行 (isFocusing: true の場合)
controls.enabledをfalseに設定し、ユーザー操作を無効化する。

BOOKSHELF_OFFSETSとBOOKSHELF_MODEL_Y_CENTERを基準に、本の位置をターゲットとするカメラ位置を計算する。

controls.setLookAt(..., true)で**アニメーション（true）**を実行する。

アニメーション完了後、Maps('/book/:id')を実行し、HTMLオーバーレイを表示するパスへ遷移させる。

② 詳細画面の維持 (isDetailPage: true の場合)
controls.enabledをfalseに設定し、ユーザー操作を無効化する。

**カメラ位置の変更処理（setLookAt）は実行しない。**これにより、直前のズームインしたカメラ位置がそのまま維持される。

③ ホーム画面への復帰 (isFocusingもisDetailPageもfalseの場合)
controls.enabledをtrueに設定し、カメラ操作を有効化する。（詳細画面からの復帰時に必要）

controls.isAnimating()が実行中でないことを確認し、DEFAULT_POSITIONへアニメーション付きでカメラを戻す。

この構造により、「アニメーション→詳細表示→ホームへの復帰」という一連の体験が、シームレスに、かつバグなく実現されています。
## +2 バックエンド、フロントエンド両方でのフレームワークの使用（Web）
>Major: Use a framework for both the frontend and backend.
◦ Use a frontend framework (React, Vue, Angular, Svelte, etc.).
◦ Use a backend framework (Express, NestJS, Django, Flask, Ruby on Rails,
etc.).
◦ Full-stack frameworks (Next.js, Nuxt.js, SvelteKit) count as both if you use
both their frontend and backend capabilities.


主要タスク：フロントエンドとバックエンドの双方でフレームワークを使用すること。
◦ フロントエンドフレームワーク（React、Vue、Angular、Svelteなど）を使用する。
◦ バックエンドフレームワーク（Express、NestJS、Django、Flask、Ruby on Railsなど）を使用する。
◦ フルスタックフレームワーク（Next.js、Nuxt.js、SvelteKit）は、フロントエンドとバックエンドの機能を両方とも使用する場合、双方の要件を満たすものとみなされます。

## +2 WebSocketsなどのリアルタイム通信技術(Web)
>Major: Implement real-time features using WebSockets or similar technology.
◦ Real-time updates across clients.
◦ Handle connection/disconnection gracefully.
◦ Efficient message broadcasting.


主要タスク：WebSocketまたは類似の技術を用いたリアルタイム機能の実装。
◦ クライアント間でのリアルタイム更新。
◦ 接続・切断の適切な処理。
◦ 効率的なメッセージブロードキャスト。

## +2 ユーザー同士の交流
> • Major: Allow users to interact with other users. The minimum requirements are:
◦ A basic chat system (send/receive messages between users).
◦ A profile system (view user information).
◦ A friends system (add/remove friends, see friends list).


主要タスク：ユーザー同士が交流できるようにする。最低限必要な機能は以下の通りです。
◦ 基本的なチャット機能（ユーザー間でのメッセージの送受信）。
◦ プロフィール機能（ユーザー情報の閲覧）。
◦ フレンド機能（フレンドの追加・削除、フレンドリストの表示）。

## +2 ユーザー情報と認証情報、フレンド機能など
> Major: Standard user management and authentication.
◦ Users can update their profile information.
◦ Users can upload an avatar (with a default avatar if none provided).
◦ Users can add other users as friends and see their online status.
◦ Users have a profile page displaying their information.


主要タスク：標準的なユーザー管理および認証機能。
◦ ユーザーは自身のプロフィール情報を更新できる。
◦ ユーザーはアバターをアップロードできる（未設定の場合はデフォルトのアバターが適用される）。
◦ ユーザーは他のユーザーをフレンドとして追加し、オンライン状況を確認できる。
◦ ユーザーは自身の情報を表示するプロフィールページを持つ。

## +2 セキュリティ
> Major: Implement WAF/ModSecurity (hardened) + HashiCorp Vault for secrets:
◦ Configure strict ModSecurity/WAF.
◦ Manage secrets in Vault (API keys, credentials, environment variables), encrypted and isolated


主要タスク：WAF/ModSecurity（セキュリティ強化済み）およびシークレット管理用HashiCorp Vaultの導入
◦ ModSecurity/WAFを厳格な設定で構築する。
◦ APIキー、認証情報、環境変数などのシークレットをVaultで管理し、暗号化および隔離を行う。

<details><summary>WAF/ModSecurityとは</summary>

Webアプリケーションへの不正なアクセスや攻撃を検知・遮断し、Webサイトを保護するオープンソースのホスト型WAF（Web Application Firewall）エンジン
WAFとは：Webアプリケーションの脆弱性を突いた攻撃（SQLインジェクションやクロスサイトスクリプティングなど）を防ぐための仕組みです。
</details>

## +2 リアルタイムのリモート対戦
> Major: Remote players — Enable two players on separate computers to play the
same game in real-time.
◦ Handle network latency and disconnections gracefully.
◦ Provide a smooth user experience for remote gameplay.
◦ Implement reconnection logic.


主要タスク：リモートプレイ — 異なるコンピュータ上の2人のプレイヤーが、同じゲームをリアルタイムでプレイできるようにする。
◦ ネットワークの遅延や切断に適切に対処する。
◦ リモートプレイにおいて円滑なユーザーエクスペリエンスを提供する。
◦ 再接続のロジックを実装する。

## +2 マイクロサービスとしてのバックエンド構築（疎なシステムの実現）
> Major: Backend as microservices.
◦ Design loosely-coupled services with clear interfaces.
◦ Use REST APIs or message queues for communica


主要タスク：マイクロサービスとしてのバックエンド
◦明確なインターフェースを備えた疎結合サービスを設計する。
◦通信にはREST APIまたはメッセージキューを使用する。

## +2 データの可視化
> Major: Advanced analytics dashboard with data visualization.
◦ Interactive charts and graphs (line, bar, pie, etc.).
◦ Real-time data updates.
◦ Export functionality (PDF, CSV, etc.).
◦ Customizable date ranges and filters.


主要タスク：データ可視化機能を備えた高度な分析ダッシュボード
◦ インタラクティブなチャートやグラフ（折れ線、棒、円など）
◦ リアルタイムのデータ更新
◦ エクスポート機能（PDF、CSVなど）
◦ カスタマイズ可能な日付範囲およびフィルター

# これも点取れそうじゃない？ポイント
## +2 セキュアな公開API、レート制限、ドキュメント必須
> Major: A public API to interact with the database with a secured API key, rate
limiting, documentation, and at least 5 endpoints:
◦ GET /api/{something}
◦ POST /api/{something}
◦ PUT /api/{something}
◦ DELETE /api/{something}

## +1 ORMの使用
> Minor: Use an ORM for the database.

## +1 PWA対応
> Minor: Progressive Web App (PWA) with offline support and installability.

## +1 多言語対応
> Minor: Right-to-left (RTL) language support.
◦ Support for at least one RTL language (Arabic, Hebrew, etc.).
◦ Complete layout mirroring (not just text direction).
◦ RTL-specific UI adjustments where needed.
◦ Seamless switching between LTR and RTL.

## +1 複数ブラウザ対応
> Minor: Support for additional browsers.
◦ Full compatibility with at least 2 additional browsers (Firefox, Safari, Edge,
etc.).
◦ Test and fix all features in each browser.
◦ Document any browser-specific limitations.
◦ Consistent UI/UX across all supported browsers.

## +1 対戦履歴の表示
> Minor: Game statistics and match history (requires a game module).
◦ Track user game statistics (wins, losses, ranking, level, etc.).
◦ Display match history (1v1 games, dates, results, opponents).
◦ Show achievements and progression.
◦ Leaderboard integration.

## +2 ユーザーの権限の管理
> Major: Advanced permissions system:
◦ View, edit, and delete users (CRUD).
◦ Roles management (admin, user, guest, moderator, etc.).
◦ Different views and actions based on user role.

## +2 マルチプレイヤー対応
> Major: Multiplayer game (more than two players).
◦ Support for three or more players simultaneously.
◦ Fair gameplay mechanics for all participants.
◦ Proper synchronization across all clients.

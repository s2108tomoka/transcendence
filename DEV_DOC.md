# ドパガキSNS 開発者向けドキュメント

## 1. プロジェクト概要

**ドパガキSNS**は、一般的なSNSにゲーム要素を組み合わせたリアルタイムSNSアプリケーションです。

ユーザーは短い文章を投稿し、他のユーザーと交流できます。

一方で、通常のSNSに存在する「フォロワー」「いいね」「ランキング」などの概念を、ドパガキSNS独自のルールによってゲーム化しています。

主な独自要素は以下です。

* 投稿するとフォロワーが5,000増える
* 投稿の文節数が「総文節数」として蓄積される
* 「いいね」の代わりに「ドパ」が存在する
* ドパは何度でも送信でき、大量にインフレする
* ユーザー同士で「文節バトル」ができる
* バトルの勝敗によって「ドパレート」が変化する
* ドパ力によるランキングが存在する
* オンラインユーザーにリアルタイムバトルを仕掛けられる
* DM・チャットによる短文コミュニケーションができる
* サービスの利用状況をリアルタイムに分析できる

---

# 2. 開発方針

本プロジェクトでは、SNSとしての基本機能とリアルタイムゲーム機能を段階的に実装します。

機能を一度に実装するのではなく、以下の順番で開発します。

```text
Week 1
基本SNS
 ↓
Week 2
ドパガキ独自システム
 ↓
Week 3
バトル・ランキング・リアルタイム通信
 ↓
Week 4
セキュリティ・分析・品質向上
```

---

# 3. 技術スタック

## Frontend

* Next.js
* React
* TypeScript

## Backend

* NestJS
* TypeScript

## Database

* PostgreSQL
* Prisma

## Realtime / Cache

* Redis
* WebSocket

## Infrastructure

* Docker
* Docker Compose
* Nginx

## Security

* ModSecurity
* OWASP Core Rule Set
* HashiCorp Vault

## Analytics

* Next.js / Reactによるダッシュボード
* グラフライブラリ
* CSV / PDF出力

---

# 4. システム構成

全体構成は以下を基本とします。

```text
                         Internet
                            │
                            ▼
                  ┌─────────────────┐
                  │      Nginx      │
                  │ + ModSecurity   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   API Gateway   │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
      User Service   Social Service  Battle Service
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    └─────────────┘

                    ┌─────────────┐
                    │    Redis    │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       Realtime Service          Analytics Service


                    HashiCorp Vault
                           │
                           ▼
                Secrets / API Keys
```

---

# 5. サービス構成

マイクロサービス化を行うが、サービス数を必要以上に増やさない。

## User Service

ユーザーに関する機能を担当する。

### 主な責務

* ユーザー登録
* ログイン
* 認証
* プロフィール
* アバター
* フレンド
* オンライン状態

---

## Social Service

SNSとしての機能を担当する。

### 主な責務

* 投稿
* タイムライン
* フォロワー
* 総文節数
* ドパ
* 投稿関連イベント

---

## Battle Service

ゲーム部分を担当する。

### 主な責務

* 文節バトル
* マッチメイキング
* ドパレート
* ドパ力
* 勝敗
* 連勝記録
* 世界ランキング

---

## Realtime Service

リアルタイム通信を担当する。

### 主な責務

* WebSocket接続
* バトル状態同期
* オンライン状態
* リアルタイム通知
* 再接続
* 切断処理
* クライアント間のイベント配信

Redis Pub/Subなどを利用して、複数インスタンス間でもイベントを共有できる構成を想定する。

---

## Analytics Service

サービス内のデータを集計・分析する。

### 主な責務

* ユーザー数集計
* 投稿数集計
* ドパ数集計
* 総文節数集計
* バトル数集計
* 勝敗集計
* フォロワー数推移
* ドパ力推移
* 利用状況分析
* CSV出力
* PDF出力

---

# 6. データベース

PostgreSQLを主要データベースとして使用する。

PrismaをORMとして使用する。

主要なエンティティは以下を想定する。

```text
User
 ├── Profile
 ├── Post
 ├── Friend
 ├── Follow
 ├── Dopa
 ├── Battle
 └── DirectMessage
```

---

## User

ユーザーアカウントを管理する。

主な情報：

```text
id
username
email
passwordHash
avatarUrl
createdAt
updatedAt
```

---

## Profile

ユーザーのゲーム・SNS情報を管理する。

```text
userId
followerCount
totalClauses
dopaRate
wins
losses
maxWinStreak
dopaPower
```

---

## Post

投稿を管理する。

```text
id
userId
content
clauseCount
createdAt
updatedAt
```

投稿本文には20文字の制限がある。

---

## Friend

ユーザー間のフレンド関係を管理する。

```text
id
requesterId
receiverId
status
createdAt
updatedAt
```

---

## Follow

フォロー関係を管理する。

```text
id
followerId
followingId
createdAt
```

フォロー関係とゲーム上のフォロワー数は別概念として扱う。

---

## Dopa

投稿に対する「ドパ」を管理する。

```text
id
userId
postId
count
createdAt
updatedAt
```

ドパは通常のLikeと異なり、同一ユーザーから複数回送信可能。

---

## Battle

文節バトルの結果を管理する。

```text
id
player1Id
player2Id
winnerId
status
player1Power
player2Power
startedAt
finishedAt
```

---

## DirectMessage

ユーザー間のDMを管理する。

```text
id
senderId
receiverId
content
createdAt
```

DMには10〜20文字程度の短文制限を設ける。

---

# 7. 投稿仕様

投稿本文は最大20文字。

正常:
```text
こんにちはドパガキ
```

20文字を超えた場合：

```text
ドパガキには長すぎます
```

投稿成功時：

```text
followerCount += 5000
```

さらに投稿内容から文節数を算出し、

```text
totalClauses += clauseCount
```

とする。

---

# 8. ドパ仕様

「ドパ」はLikeの代替機能。

ユーザーは投稿に対して何度でもドパを送信できる。

例：

```text
User A
    ↓
Post
    ↓
ドパ
    ↓
ドパ
    ↓
ドパ
    ↓
ドパ
```

ドパ数は大量に増加することを前提とする。

将来的にはRedisを利用して高速なカウント処理を行うことも検討する。

---

# 9. ドパ力

ドパ力はユーザーの強さを表すゲーム上の指標。

ドパ力は以下のような情報を元に算出する。

* 総文節数
* ドパレート
* バトル成績
* 連勝数

正確な計算式はゲームバランス調整時に決定する。

---

# 10. ドパレート

文節バトルのレーティング値。

基本的には、

```text
勝利 → ドパレート上昇
敗北 → ドパレート下降
```

となる。

---

# 11. 文節バトル

ユーザーは他のユーザーのプロフィールから「文節バトル」を申し込める。

総文節数が多かったユーザーの勝利。

---

# 12. レスバ
オンラインユーザーには、

```text
レスバを仕掛ける
```

ボタンを表示する。

バトル開始後はWebSocketによって状態を同期する。

```text
Player A
    │
    │ WebSocket
    ▼
Realtime Service
    │
    │ WebSocket
    ▼
Player B
```

---

# 13. バトルの通信要件

リアルタイムバトルでは以下を考慮する。

* 通信遅延
* WebSocket切断
* 再接続
* 二重送信
* 不正なイベント
* バトル状態の不整合
* サーバー側での状態管理

クライアントだけで勝敗を決定せず、重要なゲーム状態はサーバー側を正とする。

---

# 14. ランキング

世界ランキングを提供する。

ランキングの主要指標はドパ力とする。

例：

```text
1位  ドパ太郎       98231
2位  超ドパガキ     98102
3位  ドパマスター   97981
```

ユーザー自身の順位も確認できる。

---

# 15. フォロワーシステム

SNSとしてのフォロー関係と、ゲーム上のフォロワー数を分離する。

実際のフォロー：

```text
User A → User B
```

ゲーム上のフォロワー：

```text
12,485,000 followers
```

投稿時にはゲーム上のフォロワー数が5,000増加する。

バトル勝利時には相手からフォロワーを奪う。

---

# 16. フレンド

ユーザー同士でフレンド関係を作成できる。

必要な機能：

* フレンド申請
* 申請承認
* 申請拒否
* フレンド削除
* フレンド一覧
* オンライン状態

---

# 17. オンライン状態

ユーザーのWebSocket接続状態などを利用してオンライン状態を管理する。

状態の例：

```text
ONLINE
OFFLINE
```

将来的には、

```text
ONLINE
IN_BATTLE
OFFLINE
```

などの状態も検討する。

---

# 18. DM / チャット

ユーザー同士で短いメッセージを送信できる。

メッセージは10〜20文字程度の短文。

リアルタイムチャットではWebSocketを利用する。

```text
User A
  ↓
WebSocket
  ↓
Realtime Service
  ↓
WebSocket
  ↓
User B
```

---

# 19. UI

UIはドパガキSNS独自の世界観を持つ。

全体的に七色のRGBグローを使用する。

ユーザーのレベルやドパ力が高くなるほど、発光を強くする。

ただし、重要な情報や操作状態は色だけに依存しない。

---

# 20. 主要画面

## Login

* ログイン
* 新規登録

## Home / Timeline

* 投稿一覧
* 投稿
* ドパ
* フォロー関連

## Profile

* アバター
* ユーザー名
* フォロワー数
* 総文節数
* ドパレート
* W/L
* 最大連勝
* ドパ力
* フレンド操作
* レスバを仕掛ける

## Friends

* フレンド一覧
* オンライン状態
* フレンド申請

## Battle

* 対戦相手
* ドパ力
* バトル状態
* 勝敗
* 再接続状態

## Ranking

* 世界ランキング
* 自分の順位

## Chat / DM

* 会話一覧
* メッセージ
* リアルタイム更新

## Analytics

* ユーザー数
* 投稿数
* ドパ数
* バトル数
* 総文節数
* 各種推移
* フィルター
* CSV/PDF出力

---

# 21. API設計

基本的な通信にはREST APIを使用する。

例：

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/users/:id
PATCH  /api/users/:id

POST   /api/users/:id/avatar

GET    /api/users/:id/friends
POST   /api/users/:id/friends
DELETE /api/users/:id/friends/:friendId

GET    /api/posts
POST   /api/posts
GET    /api/posts/:id

POST   /api/posts/:id/dopa

POST   /api/battles
GET    /api/battles/:id

GET    /api/ranking

GET    /api/analytics
```

リアルタイム通信はWebSocketを使用する。

---

# 22. イベント設計

サービス間のイベントとして以下を想定する。

```text
user_registered
user_updated

friend_added
friend_removed

post_created
dopa_created

battle_started
battle_finished

user_connected
user_disconnected
```

Analytics Serviceはこれらのイベントを利用して統計情報を作成する。

---

# 23. Redis

Redisは以下の用途で使用する。

* WebSocket関連情報
* オンラインユーザー管理
* キャッシュ
* Pub/Sub
* バトル状態
* マッチングキュー
* 高頻度なドパカウント

永続データの主要保存先はPostgreSQLとし、Redisを永続DBの代替として扱わない。

---

# 24. 認証・認可

ユーザー認証を実装する。

認証情報やセッション情報を適切に管理する。

APIでは、

```text
認証
 ↓
認可
 ↓
リソースアクセス
```

の順でアクセス制御を行う。

ユーザーが他人のプロフィールを閲覧することと、他人のプロフィールを変更することは明確に区別する。

---

# 25. セキュリティ

インターネット公開を想定した構成とする。

## WAF

Nginxの前段または統合構成でModSecurityを使用する。

OWASP Core Rule Setを利用して一般的なWeb攻撃を検知・防御する。

想定する攻撃：

* SQL Injection
* XSS
* Path Traversal
* Command Injection
* HTTP Request Smuggling
* 不正なHTTPリクエスト

---

# 26. Secrets Management

APIキー、DBパスワード、JWT秘密鍵などの秘密情報はHashiCorp Vaultで管理する。

```text
Application
    ↓
Vault
    ↓
Secret
```

ソースコードやGitリポジトリに秘密情報を直接保存しない。

`.env`についても、本番環境では秘密情報を直接保存する用途として使用しない。

---

# 27. アクセシビリティ

UIはアクセシビリティを考慮する。

特に以下を意識する。

* キーボード操作
* スクリーンリーダー
* 適切なHTMLセマンティクス
* フォーカス管理
* フォームのラベル
* エラーメッセージ
* コントラスト
* 色だけに依存しない情報伝達
* アニメーションへの配慮

七色のRGBグローを主要なUI演出として使用するが、情報を色だけで表現しない。

---

# 28. Analytics

Analytics Serviceではサービス全体のデータを可視化する。

例：

```text
ユーザー数
投稿数
ドパ数
バトル数
```

を時系列で表示する。

期間フィルター：

```text
今日
7日間
30日間
90日間
カスタム期間
```

などを想定する。

---

# 29. CSV / PDF

分析結果を外部ファイルとして出力できる。

CSV：

```text
date,user_count,post_count,dopa_count,battle_count
2026-09-01,100,520,10000,32
2026-09-02,130,640,14500,41
```

PDFではグラフや主要統計情報をまとめて出力する。

---

# 30. Docker

開発環境はDocker Composeを利用する。

想定されるコンテナ：

```text
frontend
backend
postgres
redis
nginx
modsecurity
vault
```

必要に応じてサービスを分割する。

---

# 31. 開発環境

基本的な開発環境：

```text
Node.js
Docker
Docker Compose
PostgreSQL
Redis
Git
```

フロントエンドとバックエンドはTypeScriptで統一する。

---

# 32. 開発フェーズ

## Week 1 — 基本SNS

最低限のSNSとして動作する状態を作る。

* プロジェクト基盤
* Docker環境
* PostgreSQL
* Prisma
* ユーザー登録
* ログイン
* プロフィール
* アバター
* フレンド
* 投稿
* タイムライン

---

## Week 2 — ドパガキシステム

SNS独自のゲーム要素を追加する。

* 20文字制限
* 総文節数
* フォロワー+5,000
* ドパ
* ドパ力
* ドパレート
* W/L
* 最大連勝
* プロフィールへのゲーム情報表示

---

## Week 3 — バトル

ゲームシステムを拡張する。

* 文節バトル
* マッチメイキング
* 世界ランキング
* フォロワー奪取
* 勝敗処理
* WebSocket
* オンライン状態

---

## Week 4 — 高度な機能

最終的なMajor要件を完成させる。

* リアルタイムバトル
* 再接続
* DM
* Analytics
* CSV
* PDF
* ModSecurity
* HashiCorp Vault
* アクセシビリティ
* テスト
* パフォーマンス改善
* UI/UX改善

---

# 33. Git

mainに直接マージは禁止．
基本的にはissuesからブランチを切って，PRを出すようにする．
コミットメッセージは変更内容を説明する明確なものにする．

---

# 34. 開発時の基本原則

### Backendを信頼しすぎない

クライアントから送られてきた値をそのまま信用しない。

特に以下はサーバー側で検証する。

* ユーザーID
* 投稿文字数
* ドパ数
* バトル結果
* ドパレート
* フォロワー数
* 権限

### ゲーム状態はServer Authoritative

重要なゲーム状態はサーバーを正とする。

```text
Client
  ↓ request
Server
  ↓ validate
Game State
  ↓
Client
```

### サービス間の責務を明確にする

User ServiceがBattleの内部ロジックを持つなど、サービス間の責務を混在させない。

### DBとRedisの役割を分ける

PostgreSQL：

```text
永続データ
```

Redis：

```text
高速アクセス
一時データ
Pub/Sub
Realtime
```

---

# 35. 完成時の状態

最終的なドパガキSNSは、以下を満たすWebアプリケーションを目指す。

```text
SNS
 ├── Login
 ├── Profile
 ├── Post
 ├── Timeline
 ├── Friend
 ├── DM
 │
 ├── ドパ
 ├── 文節
 ├── ドパ力
 ├── ドパレート
 ├── 文節バトル
 ├── 世界ランキング
 │
 ├── WebSocket
 ├── Real-time Battle
 │
 ├── Analytics
 ├── CSV / PDF
 │
 ├── ModSecurity
 └── HashiCorp Vault
```

SNS、リアルタイムゲーム、マイクロサービス、分析、セキュリティを組み合わせたフルスタックWebアプリケーションとして完成させる。

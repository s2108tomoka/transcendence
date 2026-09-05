<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

`transcendence` のバックエンドAPIです。NestJS、Prisma ORM、PostgreSQLを使用します。

## Requirements

- Node.js `20.19.5`
- PostgreSQL `16`
- npm

## Project setup

```bash
# リポジトリルートでNode.jsのバージョンを確認
node --version
# v20.19.5

# backendへ移動
cd backend

# 環境変数を用意
cp .env.example .env

# 依存関係をインストール
npm install
```

`.env` の `DATABASE_URL` は、起動するPostgreSQLのユーザー名、パスワード、データベース名と一致させてください。

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public
```

## PostgreSQL

PostgreSQL 16はリポジトリルートの `docker-compose.yml` で管理します。

```bash
# backendディレクトリから起動
docker compose -f ../docker-compose.yml up -d postgres

# 起動状態を確認
docker compose -f ../docker-compose.yml ps postgres

# 停止
docker compose -f ../docker-compose.yml stop postgres
```

## Prisma

Prisma CLIとPrisma Clientは、ともに `7.10.0` に固定しています。

主なファイルは次のとおりです。

- `prisma/schema.prisma`: モデルとリレーションの定義
- `prisma/migrations/`: データベースの変更履歴
- `prisma.config.ts`: スキーマ、マイグレーション、接続URLの設定
- `generated/prisma/`: 自動生成されるPrisma Client（Git管理対象外）

### Prisma Clientを生成する

`schema.prisma` を変更した場合や、依存関係をインストールした直後に実行します。

```bash
npx prisma generate
```

### 開発環境へマイグレーションを適用する

モデルを変更したら、変更内容を表す名前を付けてマイグレーションを作成・適用します。

```bash
npx prisma migrate dev --name add_example_field
```

既に作成済みのマイグレーションだけを適用する場合は、次を実行します。

```bash
npx prisma migrate deploy
```

現在のマイグレーション状態は次のコマンドで確認できます。

```bash
npx prisma migrate status
```

### 既存データベースからスキーマを取得する

PostgreSQL側に既存のテーブルがあり、その構造を `schema.prisma` に反映したい場合に使用します。

```bash
npx prisma db pull
npx prisma generate
```

> `prisma db pull` はデータベースの構造を基準に `schema.prisma` を更新します。手動で記述したモデルや属性がある場合は、実行前に差分をコミットするなどして退避してください。

### Prisma Studioでテーブルを確認する

PostgreSQLを起動した状態で次を実行します。

```bash
npx prisma studio
```

通常はブラウザで `http://localhost:5555` が開き、`users`、`posts`、`friendships`、`refresh_tokens` テーブルの内容を確認・編集できます。Prisma Studioはデータを書き換えられるため、特に本番データベースへ接続する場合は注意してください。

### スキーマを検証・整形する

```bash
npx prisma validate
npx prisma format
```

### 基本的な開発手順

```bash
# 1. PostgreSQLを起動
docker compose -f ../docker-compose.yml up -d postgres

# 2. マイグレーションを適用
npx prisma migrate deploy

# 3. Prisma Clientを生成
npx prisma generate

# 4. バックエンドを起動
npm run start:dev
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observer](https://observer.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

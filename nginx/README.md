# HTTPS開発環境（mkcert + Nginx）

ローカル開発環境をHTTPS化するための手順です。mkcertでローカル認証局（CA）と証明書を作成し、Docker Composeで起動するNginxをTLS終端およびリバースプロキシとして使用します。

## 構成

- `https://localhost/` → フロントエンド（ホストの `3000` 番ポート）
- `https://localhost/api/` → バックエンド（ホストの `4000` 番ポート）
- `http://localhost/` → `https://localhost/` へリダイレクト

Nginxコンテナからホスト上の開発サーバーへは `host.docker.internal` を使用して接続します。

## 必要なもの

- Docker Desktop
- Homebrew
- mkcert

## 1. mkcertをインストールする

macOSではHomebrewを使います。

```bash
brew install mkcert
```

Firefoxでも証明書を信頼させる場合は、NSSもインストールします。

```bash
brew install nss
```

インストールされたコマンドを確認します。

```bash
type -a mkcert
mkcert -version
```

`mkcert -install` で `unknown option` などが表示される場合は、npmなどで導入された同名コマンドを実行している可能性があります。`type -a mkcert` でHomebrew版（通常は `/opt/homebrew/bin/mkcert` または `/usr/local/bin/mkcert`）が選択されていることを確認してください。

## 2. ローカルCAを信頼する

通常は次のコマンドを、対話可能な通常ユーザーのターミナルで実行します。macOSのパスワード入力を求められる場合があります。

```bash
mkcert -install
```

`sudo mkcert -install` のようにmkcert自体をrootユーザーで起動しないでください。通常ユーザーとは別の場所にCAが作成され、後から証明書を生成するときにCAや権限が一致しなくなる可能性があります。mkcertは必要な処理だけ内部で `sudo` を呼び出します。

### `mkcert -install` のエラーを避ける

mkcertは標準では、検出したmacOS、Firefox/NSS、JavaのトラストストアへCAを登録しようとします。FirefoxやJavaを使用しない場合は、登録先をmacOSのシステムトラストストアだけに限定できます。

```bash
TRUST_STORES=system mkcert -install
```

これにより、未設定のNSSやJavaのトラストストアに対する処理を行わないため、`certutil` や `keytool` に関連する警告・エラーを避けられます。Firefoxも使用する場合は `brew install nss` の後に通常の `mkcert -install` を実行してください。

既にCAをインストール済みなら、毎回 `mkcert -install` を実行する必要はありません。状態と保存場所は次のコマンドで確認できます。

```bash
mkcert -CAROOT
ls -la "$(mkcert -CAROOT)"
```

> `rootCA-key.pem` はローカルCAの秘密鍵です。共有、コミット、またはプロジェクト内へのコピーをしないでください。

## 3. localhost証明書を生成する

リポジトリルートで実行します。

```bash
mkdir -p nginx/certs

mkcert \
  -cert-file nginx/certs/localhost.pem \
  -key-file nginx/certs/localhost-key.pem \
  localhost 127.0.0.1 ::1
```

生成されるファイルは次の2つです。

- `nginx/certs/localhost.pem`: サーバー証明書
- `nginx/certs/localhost-key.pem`: サーバー秘密鍵

これらは `.gitignore` の対象です。秘密鍵をGitへコミットしないでください。

## 4. フロントエンドとバックエンドを起動する

Nginxはホストの `3000`、`4000` 番ポートへ転送するため、先に両方の開発サーバーを起動します。

```bash
# ターミナル1
cd frontend
npm run dev
```

```bash
# ターミナル2
cd backend
npm run start:dev
```

## 5. Nginxを起動する

リポジトリルートで実行します。

```bash
# 設定ファイルを検証
docker compose run --rm nginx nginx -t

# Nginxを起動
docker compose up -d nginx

# 状態とログを確認
docker compose ps nginx
docker compose logs nginx
```

ブラウザで `https://localhost` を開きます。

```bash
# HTTPからHTTPSへのリダイレクトを確認
curl -I http://localhost

# HTTPSの応答を確認
curl -I https://localhost
```

## 停止と再起動

```bash
docker compose stop nginx
docker compose restart nginx
```

設定または証明書を変更した場合は、Nginxを再起動します。

```bash
docker compose restart nginx
```

## トラブルシューティング

### `bind: address already in use`（80番ポート）

ホストの80番ポートを別プロセスが使用しています。使用しているプロセスを確認します。

```bash
sudo lsof -nP -iTCP:80 -sTCP:LISTEN
```

macOSのApache（`/usr/sbin/httpd`）が使用している場合、Apacheが不要なら停止してからNginxを起動します。

```bash
sudo apachectl stop
docker compose up -d nginx
```

Apacheを停止しない場合は、`docker-compose.yml` のHTTP側だけ別ポートへ変更します。

```yaml
ports:
  - "443:443"
  - "80:80"
```

この場合、HTTP側は `http://localhost` へアクセスします。

### 443番ポートが使用中

```bash
sudo lsof -nP -iTCP:443 -sTCP:LISTEN
```

使用中のプロセスを停止するか、Composeのホスト側ポートを `8443:443` などへ変更してください。その場合のアクセス先は `https://localhost:8443` です。

### ブラウザに証明書警告が表示される

次を順番に確認します。

1. `mkcert -install` または `TRUST_STORES=system mkcert -install` が成功している
2. 証明書が `localhost` を含めて生成されている
3. Nginxを証明書生成後に再起動している
4. ブラウザを完全に終了して再起動している

証明書の対象名は次のコマンドで確認できます。

```bash
openssl x509 -in nginx/certs/localhost.pem -noout -subject -issuer -ext subjectAltName
```

### Nginxからフロントエンドまたはバックエンドへ接続できない

Nginxのログに `502 Bad Gateway` が表示される場合は、ホスト側の開発サーバーと待受ポートを確認します。

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
lsof -nP -iTCP:4000 -sTCP:LISTEN
docker compose logs nginx
```

フロントエンドは `3000`、バックエンドは `4000` 番ポートで待ち受ける必要があります。

## セキュリティ上の注意

- mkcertはローカル開発専用です。本番環境では使用しないでください。
- `localhost-key.pem` と `rootCA-key.pem` を共有・コミットしないでください。
- `rootCA-key.pem` が漏えいした場合は、そのCAを信頼解除して作り直してください。

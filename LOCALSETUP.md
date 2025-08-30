# ローカル環境でのデプロイ
Ubuntu 22.04を対象にサイトをデプロイする方法のメモ  
rootユーザにて作業する。ufwなどの設定は適宜行う。

## 1. 前提ソフトウェアのインストール
gitはaptよりインストールする。  
Node.jsは[Node.js公式](https://nodejs.org/ja/download)よりインストールする。
下記はnvmを使う場合の例。

```sh
# gitのインストール
apt install git
# nvmをダウンロードしてインストールする：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# シェルを再起動する代わりに実行する
\. "$HOME/.nvm/nvm.sh"
# Node.jsをダウンロードしてインストールする：
nvm install 22
```

## 2. リポジトリのクローン
```sh
# リポジトリをクローンするディレクトリに移動
cd /var/www/
# リポジトリのクローン
git clone https://github.com/chishige1217200/wol-app.git
# リポジトリのディレクトリに移動
cd wol-app
```

## 3. Webサイトのセットアップ
システム起動時に自動的にWebサーバーを起動するように設定する。デフォルトでは3000番ポートで起動する。
```sh
# npmパッケージのインストール
npm install
# pm2のインストール
npm install pm2 -g
# Webサイトのビルド
npm run build
# pm2でWebサーバーを起動する
pm2 start npm --name "wol-app" -- start
# 現在の状態を保存する（起動時のため）
pm2 save
# systemdにpm2の自動起動をトリガーする
pm2 startup
```

## 4. カスタム
pcs.jsonの内容を変更することで、Webページに表示されるプルダウンの内容を変更できる。  
Wake On Lanのマジックパケットは`mac`に指定されたMACアドレスに対して送信される。
```json
[
  { "name": "リビングPC", "mac": "00:11:22:33:44:55" },
  { "name": "書斎PC", "mac": "AA:BB:CC:DD:EE:FF" },
  { "name": "NASサーバ", "mac": "11:22:33:44:55:66" }
]
```

## 5. サイトの最新化
pm2のプロセスIDが`0`である場合の例。プロセスIDに合わせて変更する。
```sh
# プロセスを停止
pm2 stop 0
# リポジトリの最新化
git pull
# Webサイトのビルド
npm run build
# プロセスを再開
pm2 start 0
```

---
title: インストール
description: Backlog CLI のインストール方法
---

Backlog CLIはnpmパッケージとして配布されています。お使いのパッケージマネージャーでグローバルインストールしてください。

## nypm（推奨）

[nypm](https://github.com/unjs/nypm) を使うと、環境のパッケージマネージャーを自動検出してインストールできます。

```bash
npx nypm install -g @simochee/backlog-cli
```

## パッケージマネージャーごとのインストール

```bash
# npm
npm install -g @simochee/backlog-cli

# yarn
yarn global add @simochee/backlog-cli

# pnpm
pnpm add -g @simochee/backlog-cli

# bun
bun install -g @simochee/backlog-cli
```

## 動作確認

インストールが完了したら、バージョンが表示されることを確認します。

```bash
backlog --version
```

## アップデート

最新バージョンに更新するには、同じコマンドで再インストールします。

```bash
npm install -g @simochee/backlog-cli@latest
```

## 次のステップ

インストールが完了したら、[クイックスタート](/getting-started/quickstart/)に進んで認証を設定しましょう。

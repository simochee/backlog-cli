---
title: クイックスタート
description: Backlog CLI を使い始めるための基本的な手順
---

import { Steps } from "@astrojs/starlight/components";

このガイドでは、Backlog CLI のセットアップから基本的な操作までを説明します。

## セットアップ

<Steps>

1. **認証する**

   まず Backlog スペースに認証する。対話形式でホスト名と認証方式を選択できる。

   ```bash
   backlog auth login
   ```

   API キーを使う場合は、ホスト名と認証方式を直接指定できる。

   ```bash
   backlog auth login --space your-space.backlog.com --method api-key
   ```

2. **認証状態を確認する**

   認証が正しく設定されたことを確認する。

   ```bash
   backlog auth status
   ```

3. **ダッシュボードを表示する**

   ダッシュボードが表示されれば準備完了である。

   ```bash
   backlog status
   ```

</Steps>

## 基本操作

### 課題の一覧

プロジェクトの課題を一覧表示します。

```bash
backlog issue list --project YOUR_PROJECT
```

### 課題の作成

新しい課題を作成します。`--type` と `--priority` には日本語名をそのまま指定できます。

```bash
backlog issue create --project YOUR_PROJECT --title "新しい課題" --type バグ --priority 高
```

### 課題の詳細

課題キーを指定して詳細を表示します。プロジェクトキーが課題キーに含まれるため、`--project` の指定は不要です。

```bash
backlog issue view PROJECT-123
```

### プロジェクトの一覧

アクセス可能なプロジェクトを一覧表示します。

```bash
backlog project list
```

### 通知の確認

未読の通知を確認します。

```bash
backlog notification list
```

### ダッシュボード

自分に割り当てられた課題と未読通知の概要を一画面で確認できます。

```bash
backlog status
```

## 出力形式

デフォルトではテーブル形式で出力されます。`--json` フラグを付けると JSON 形式で取得できるため、他のツールとの連携に便利です。

```bash
# JSON で出力
backlog issue list --project YOUR_PROJECT --json

# 特定のフィールドだけを出力
backlog issue list --project YOUR_PROJECT --json issueKey,summary,status
```

詳しくは[出力形式ガイド](/guides/output-formatting/)を参照してください。

## ヘルプ

各コマンドの詳しい使い方は `--help` フラグで確認できます。

```bash
backlog --help
backlog issue --help
backlog issue create --help
```

## 次のステップ

- [認証ガイド](/guides/authentication/) — 複数スペースの管理や OAuth 認証について
- [設定ガイド](/guides/configuration/) — 環境変数やデフォルトプロジェクトの設定
- [CI での利用](/guides/ci/) — CI/CD パイプラインへの組み込み方
- [AI エージェント連携](/guides/ai-agent/) — Claude Code や Cursor からの操作

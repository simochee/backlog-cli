---
title: クイックスタート
description: Backlog CLI を使い始めるための基本的な手順
---

## 認証

まず Backlog スペースに認証します。

```bash
backlog auth login
```

対話形式でホスト名と認証方式を選択できます。API キーを使う場合は以下のように指定します。

```bash
backlog auth login --hostname your-space.backlog.com --method api-key
```

認証状態を確認するには:

```bash
backlog auth status
```

## 基本操作

### 課題の一覧

```bash
backlog issue list --project YOUR_PROJECT
```

### 課題の作成

```bash
backlog issue create --project YOUR_PROJECT --title "新しい課題" --type バグ --priority 高
```

### 課題の詳細

```bash
backlog issue view PROJECT-123
```

### プロジェクトの一覧

```bash
backlog project list
```

### 通知の確認

```bash
backlog notification list
```

### ダッシュボード

自分に割り当てられた課題や未読通知の概要を表示します。

```bash
backlog status
```

## 出力形式

デフォルトではテーブル形式で出力されます。JSON 形式で取得する場合は `--json` フラグを使用します。

```bash
backlog issue list --project YOUR_PROJECT --json
```

詳しくは[出力形式](/backlog-cli/guides/output-formatting/)を参照してください。

## ヘルプ

各コマンドのヘルプは `--help` フラグで表示できます。

```bash
backlog issue --help
backlog issue create --help
```

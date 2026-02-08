---
title: 出力形式
description: Backlog CLI の出力形式のカスタマイズ方法
---

Backlog CLI はさまざまな出力形式をサポートしています。

## テーブル形式（デフォルト）

フラグを指定しない場合、人間が読みやすいテーブル形式で出力されます。

```bash
backlog issue list --project PROJ
```

## JSON 形式

`--json` フラグで JSON 形式の出力を取得できます。

```bash
# 全フィールドを JSON で出力
backlog issue list --project PROJ --json

# 特定のフィールドのみ出力
backlog issue list --project PROJ --json issueKey,summary,status
```

TTY（ターミナル）接続時は整形された JSON が出力され、パイプ時はコンパクトな JSON が出力されます。

## スクリプトでの利用

JSON 出力とシェルのパイプを組み合わせることで、スクリプトから活用できます。

```bash
# jq で課題キーだけを抽出
backlog issue list --project PROJ --json | jq '.[].issueKey'

# 条件付きフィルタ
backlog issue list --project PROJ --json | jq '[.[] | select(.priority.name == "高")]'

# 課題キーの一覧を取得してループ処理
backlog issue list --project PROJ --json | jq -r '.[].issueKey' | while read key; do
  echo "Processing $key"
done
```

## 対応コマンド

`--json` フラグは以下のコマンドカテゴリで利用できます。

- **一覧系コマンド** (`list`): 配列として出力
- **詳細表示コマンド** (`view`): オブジェクトとして出力
- **カウントコマンド** (`count`): `{ count: number }` として出力
- **ダッシュボード** (`status`): ユーザー情報・課題・通知をまとめたオブジェクトとして出力

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

## jq フィルタ

`--jq` フラグで jq 式を使って出力をフィルタリングできます。

```bash
# 課題キーだけを抽出
backlog issue list --project PROJ --jq '.[].issueKey'

# 条件付きフィルタ
backlog issue list --project PROJ --jq '[.[] | select(.priority.name == "高")]'
```

## Go テンプレート

`--template` フラグで Go テンプレート形式のカスタムフォーマットを指定できます。

```bash
backlog issue list --project PROJ --template '{{.Key}} {{.Summary}}'
```

## スクリプトでの利用

JSON 出力とシェルのパイプを組み合わせることで、スクリプトから活用できます。

```bash
# 課題キーの一覧を取得
backlog issue list --project PROJ --jq '.[].issueKey' | while read key; do
  echo "Processing $key"
done
```

---
title: 出力形式
description: Backlog CLI の出力形式とスクリプトでの活用方法
---

Backlog CLI は用途に応じて出力形式を切り替えられます。ターミナルでの確認にはテーブル形式、スクリプトや CI での連携には JSON 形式が便利です。

## テーブル形式（デフォルト）

フラグを指定しない場合、人間が読みやすいテーブル形式で出力されます。

```bash
backlog issue list --project PROJ
```

```
#    種別    優先度  担当者   件名
123  タスク  中      yamada   API エンドポイントの設計
124  バグ    高      tanaka   ログインページの表示崩れ
```

## JSON 形式

`--json` フラグを付けると JSON 形式で出力されます。

```bash
# 全フィールドを JSON で出力
backlog issue list --project PROJ --json

# 特定のフィールドのみ出力
backlog issue list --project PROJ --json issueKey,summary,status
```

ターミナル（TTY）に接続されている場合はインデント付きの整形 JSON が、パイプに接続されている場合はコンパクトな 1 行 JSON が出力されます。

## スクリプトでの活用

JSON 出力と `jq` を組み合わせることで、さまざまなデータ加工が可能です。

```bash
# 課題キーだけを抽出
backlog issue list --project PROJ --json | jq '.[].issueKey'

# 高優先度の課題だけをフィルタ
backlog issue list --project PROJ --json | jq '[.[] | select(.priority.name == "高")]'

# 課題キーの一覧を取得してループ処理
backlog issue list --project PROJ --json | jq -r '.[].issueKey' | while read key; do
  backlog issue close "$key"
done
```

## 対応コマンド

`--json` フラグは以下のカテゴリのコマンドで利用できます。

| コマンドの種類      | `--json` の出力形式                            | 例                           |
| ------------------- | ---------------------------------------------- | ---------------------------- |
| 一覧系（`list`）    | 配列                                           | `backlog issue list`         |
| 詳細表示（`view`）  | オブジェクト                                   | `backlog issue view PROJ-1`  |
| カウント（`count`） | `{ count: number }`                            | `backlog notification count` |
| ダッシュボード      | ユーザー情報・課題・通知をまとめたオブジェクト | `backlog status`             |

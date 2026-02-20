---
title: backlog document create
description: ドキュメントを作成する
---

```
backlog document create [flags]
```

新しいドキュメントを作成します。本文は `--body` オプションまたは標準入力（`--body -`）から指定できます。

対応するBacklog APIについては「[ドキュメントの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-document/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-t`, `--title <string>`
: ドキュメントのタイトル

`-b`, `--body <string>`
: ドキュメントの本文（Markdown）。`-` を指定すると標準入力から読み込む

`--emoji <string>`
: タイトル横に表示する絵文字

`--parent-id <string>`
: 親ドキュメントID

`--add-last`
: 兄弟ドキュメントの末尾に追加（デフォルトは先頭）

## 使用例

```bash
backlog document create --project PROJ --title "設計ドキュメント" --body "# 概要"
backlog document create --project PROJ --title "議事録" --emoji "📝"
cat draft.md | backlog document create --project PROJ --title "下書き" --body -
backlog document create --project PROJ --title "子ドキュメント" --parent-id abc-123 --add-last
```

---
title: backlog document view
description: ドキュメントの詳細を表示する
---

```
backlog document view <document-id> [flags]
```

ドキュメントの詳細情報を表示します。

対応するBacklog APIについては「[ドキュメント情報の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-document/)」を参照してください。

## 引数

`<document-id> <string>`
: ドキュメントID

## オプション

`--web`
: ブラウザで開く

`-p`, `--project <string>`
: プロジェクトキー（`--web` 時に必須）

## 使用例

```bash
backlog document view abc-123
backlog document view abc-123 --web --project PROJ
backlog document view abc-123 --json
```

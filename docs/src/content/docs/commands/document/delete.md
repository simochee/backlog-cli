---
title: backlog document delete
description: ドキュメントを削除する
---

```
backlog document delete <document-id> [flags]
```

ドキュメントを削除します。デフォルトでは確認プロンプトが表示されます。

対応するBacklog APIについては「[ドキュメントの削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-document/)」を参照してください。

## 引数

`<document-id> <string>`
: ドキュメントID

## オプション

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog document delete abc-123
backlog document delete abc-123 --yes
```

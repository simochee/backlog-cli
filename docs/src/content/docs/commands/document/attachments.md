---
title: backlog document attachments
description: ドキュメントの添付ファイル一覧を表示する
---

```
backlog document attachments <document-id>
```

ドキュメントに添付されたファイルの一覧を表示します。

対応するBacklog APIについては「[ドキュメント情報の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-document/)」を参照してください。

## 引数

`<document-id> <string>`
: ドキュメントID

## 使用例

```bash
backlog document attachments abc-123
backlog document attachments abc-123 --json
```

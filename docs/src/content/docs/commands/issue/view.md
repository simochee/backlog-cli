---
title: backlog issue view
description: 課題の詳細を表示する
---

```
backlog issue view <issue-key> [flags]
```

指定した課題の詳細情報を表示します。

対応する Backlog API については「[課題情報の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-issue/)」を参照してください。

## 引数

`<issue-key> <string>`
: 課題キー（例: `PROJECT-123`）

## オプション

`--comments`
: コメントも表示する

`--web`
: ブラウザで開く

## 使用例

```bash
# 課題の詳細を表示
backlog issue view PROJECT-123

# コメント付きで表示
backlog issue view PROJECT-123 --comments

# ブラウザで開く
backlog issue view PROJECT-123 --web
```

## 関連コマンド

- [issue list](/commands/issue/list/)
- [issue edit](/commands/issue/edit/)

---
title: backlog pr status
description: 自分のプルリクエストの状態を表示する
---

```
backlog pr status [flags]
```

自分に割り当てられたプルリクエストの状態を表示します。

対応する Backlog API については「[プルリクエスト一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-pull-request-list/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

## 使用例

```bash
backlog pr status --project PROJ --repo my-repo
```

## 関連コマンド

- [pr list](/commands/pr/list/)
- [status](/commands/status/)

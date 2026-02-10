---
title: backlog issue delete
description: 課題を削除する
---

```
backlog issue delete <issue-key> [flags]
```

課題を削除します。この操作は元に戻せません。

対応するBacklog APIについては「[課題の削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-issue/)」を参照してください。

## 引数

`<issue-key> <string>`
: 課題キー（例: `PROJECT-123`）

## オプション

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
# 課題を削除する（確認プロンプトあり）
backlog issue delete PROJECT-123

# 確認をスキップして削除
backlog issue delete PROJECT-123 --yes
```

## 関連コマンド

- [issue view](/commands/issue/view/)
- [issue close](/commands/issue/close/)

---
title: backlog issue reopen
description: 課題を再オープンする
---

```
backlog issue reopen <issue-key> [flags]
```

完了した課題を「未対応」ステータスに戻します。

対応する Backlog API については「[課題情報の更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-issue/)」を参照してください。

## 引数

`<issue-key> <string>`
: 課題キー（例: `PROJECT-123`）

## オプション

`-c`, `--comment <string>`
: 再オープンコメント

## 使用例

```bash
# 課題を再オープン
backlog issue reopen PROJECT-123

# コメント付きで再オープン
backlog issue reopen PROJECT-123 --comment "再現しました"
```

## 関連コマンド

- [issue close](/commands/issue/close/)
- [issue edit](/commands/issue/edit/)

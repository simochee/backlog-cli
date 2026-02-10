---
title: backlog auth switch
description: アクティブなスペースを切り替える
---

```
backlog auth switch [flags]
```

デフォルトのアクティブスペースを切り替えます。複数のスペースに認証している場合に使用します。

## オプション

`--space <string>`
: 切り替え先のスペースホスト名

## 使用例

```bash
# 対話的にスペースを選択
backlog auth switch

# 特定のスペースに切り替え
backlog auth switch --space other-space.backlog.com
```

## 関連コマンド

- [auth status](/backlog-cli/commands/auth/status/)
- [auth login](/backlog-cli/commands/auth/login/)

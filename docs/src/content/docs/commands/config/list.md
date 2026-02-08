---
title: backlog config list
description: すべての設定を一覧表示する
---

```
backlog config list [flags]
```

すべての設定値を一覧表示します。

## オプション

| フラグ       | 型     | 説明                       |
| ------------ | ------ | -------------------------- |
| `--hostname` | string | スペース固有の設定のみ表示 |

## 使用例

```bash
# すべての設定を表示
backlog config list

# スペース固有の設定のみ表示
backlog config list --hostname your-space.backlog.com
```

## 関連コマンド

- [config get](/backlog-cli/commands/config/get/)
- [config set](/backlog-cli/commands/config/set/)

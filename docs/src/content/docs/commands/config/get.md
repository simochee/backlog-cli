---
title: backlog config get
description: 設定値を取得する
---

```
backlog config get <key> [flags]
```

指定したキーの設定値を表示します。

## 引数

`<key> <string>`
: 設定キー（例: `default_space`）

## オプション

`--hostname <string>`
: スペース固有の設定を取得

## 使用例

```bash
# グローバル設定を取得
backlog config get default_space

# スペース固有の設定を取得
backlog config get pager --hostname your-space.backlog.com
```

## 関連コマンド

- [config set](/commands/config/set/)
- [config list](/commands/config/list/)

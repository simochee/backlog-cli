---
title: backlog config set
description: 設定値を変更する
---

```
backlog config set <key> <value> [flags]
```

指定したキーの設定値を変更します。

## 引数

`<key> <string>`
: 設定キー

`<value> <string>`
: 設定値

## オプション

`-s`, `--space <string>`
: スペース固有の設定を変更

## 使用例

```bash
# デフォルトスペースを設定
backlog config set default_space your-space.backlog.com

# スペース固有の設定を変更
backlog config set pager less --space your-space.backlog.com
```

## 関連コマンド

- [config get](/backlog-cli/commands/config/get/)
- [config list](/backlog-cli/commands/config/list/)

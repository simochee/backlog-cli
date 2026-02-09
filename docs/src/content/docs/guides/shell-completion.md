---
title: シェル補完
description: Backlog CLI のシェル補完の設定方法
---

Backlog CLI はシェル補完に対応しています。コマンドやフラグをタブキーで補完できるようになるため、入力の手間を大幅に減らせます。

Bash、Zsh、Fish の 3 つのシェルに対応しています。

## Bash

```bash
# 補完スクリプトを生成してシステムに配置
backlog completion bash > /etc/bash_completion.d/backlog

# または現在のシェルに直接読み込み
eval "$(backlog completion bash)"
```

`~/.bashrc` に追加して永続化できます。

```bash
echo 'eval "$(backlog completion bash)"' >> ~/.bashrc
```

## Zsh

```bash
# 補完スクリプトを生成して fpath に配置
backlog completion zsh > "${fpath[1]}/_backlog"

# または現在のシェルに直接読み込み
eval "$(backlog completion zsh)"
```

`~/.zshrc` に追加して永続化できます。

```bash
echo 'eval "$(backlog completion zsh)"' >> ~/.zshrc
```

## Fish

```bash
# 補完スクリプトを生成して Fish の補完ディレクトリに配置
backlog completion fish > ~/.config/fish/completions/backlog.fish

# または現在のシェルに直接読み込み
backlog completion fish | source
```

Fish の場合、`~/.config/fish/completions/` に配置すれば自動的に読み込まれます。

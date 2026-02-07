---
title: シェル補完
description: Backlog CLI のシェル補完の設定方法
---

Backlog CLI は Bash、Zsh、Fish のシェル補完をサポートしています。

## Bash

```bash
# 補完スクリプトを生成
backlog completion bash > /etc/bash_completion.d/backlog

# または現在のシェルに直接読み込み
eval "$(backlog completion bash)"
```

`~/.bashrc` に追加して永続化する場合:

```bash
echo 'eval "$(backlog completion bash)"' >> ~/.bashrc
```

## Zsh

```bash
# 補完スクリプトを生成
backlog completion zsh > "${fpath[1]}/_backlog"

# または現在のシェルに直接読み込み
eval "$(backlog completion zsh)"
```

`~/.zshrc` に追加して永続化する場合:

```bash
echo 'eval "$(backlog completion zsh)"' >> ~/.zshrc
```

## Fish

```bash
# 補完スクリプトを生成
backlog completion fish > ~/.config/fish/completions/backlog.fish

# または現在のシェルに直接読み込み
backlog completion fish | source
```

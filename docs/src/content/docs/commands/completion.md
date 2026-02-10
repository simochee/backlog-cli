---
title: backlog completion
description: シェル補完スクリプトを生成する
---

```
backlog completion <shell>
```

指定したシェル向けの補完スクリプトを生成します。

## 引数

`<shell> <string>`
: シェル種別: {bash|zsh|fish}

## 使用例

```bash
# Bash
backlog completion bash > /etc/bash_completion.d/backlog

# Zsh
backlog completion zsh > "${fpath[1]}/_backlog"

# Fish
backlog completion fish > ~/.config/fish/completions/backlog.fish
```

詳しいセットアップ方法は[シェル補完ガイド](/guides/shell-completion/)を参照してください。

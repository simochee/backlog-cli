---
title: CI での利用
description: CI/CD パイプラインで Backlog CLI を使用する方法
---

Backlog CLIは環境変数による認証に対応しているため、CI/CDパイプラインに組み込めます。デプロイ後の課題クローズやコメント追加など、Backlogの操作を自動化できます。

## 必要な環境変数

CI環境では次の環境変数を設定してください。

| 環境変数          | 必須 | 説明                                                       |
| ----------------- | ---- | ---------------------------------------------------------- |
| `BACKLOG_SPACE`   | Yes  | Backlog スペースのホスト名（例: `your-space.backlog.com`） |
| `BACKLOG_API_KEY` | Yes  | Backlog の API キー                                        |
| `BACKLOG_PROJECT` | No   | デフォルトのプロジェクトキー                               |

APIキーはBacklogの「個人設定 > API」ページから発行できます。認証の詳細は[認証ガイド](/guides/authentication/)を参照してください。

:::caution
APIキーをソースコードに直接記述しないでください。各CIサービスのシークレット管理機能を使って安全に設定してください。
:::

## 前提条件

Backlog CLIはnpmパッケージとして配布されているため、CI環境に **Node.js ランタイム**が必要です。Node.jsのセットアップ後に `npm install -g @simochee/backlog-cli` でインストールしてください。

## CI サービス別のセットアップ

### GitHub Actions

```yaml
# .github/workflows/backlog.yml
name: Backlog
on:
  push:
    branches: [main]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "24"

      - name: Install Backlog CLI
        run: npm install -g @simochee/backlog-cli

      - name: Update issue status
        env:
          BACKLOG_SPACE: ${{ secrets.BACKLOG_SPACE }}
          BACKLOG_API_KEY: ${{ secrets.BACKLOG_API_KEY }}
          BACKLOG_PROJECT: ${{ secrets.BACKLOG_PROJECT }}
        run: backlog issue close PROJ-123
```

**Settings > Secrets and variables > Actions** からシークレット変数を設定できます。

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
notify:
  image: node:24
  variables:
    BACKLOG_SPACE: ${BACKLOG_SPACE}
    BACKLOG_API_KEY: ${BACKLOG_API_KEY}
    BACKLOG_PROJECT: ${BACKLOG_PROJECT}
  script:
    - npm install -g @simochee/backlog-cli
    - backlog issue close PROJ-123
```

**Settings > CI/CD > Variables** からシークレット変数を設定できます。

### CircleCI

```yaml
# .circleci/config.yml
version: 2.1
jobs:
  notify:
    docker:
      - image: cimg/node:24.0
    steps:
      - checkout
      - run:
          name: Install Backlog CLI
          command: npm install -g @simochee/backlog-cli
      - run:
          name: Update issue status
          command: backlog issue close PROJ-123
          environment:
            BACKLOG_SPACE: ${BACKLOG_SPACE}
            BACKLOG_API_KEY: ${BACKLOG_API_KEY}
            BACKLOG_PROJECT: ${BACKLOG_PROJECT}

workflows:
  main:
    jobs:
      - notify
```

**Project Settings > Environment Variables** からシークレット変数を設定できます。

### Bitbucket Pipelines

```yaml
# bitbucket-pipelines.yml
image: node:24

pipelines:
  default:
    - step:
        name: Notify Backlog
        script:
          - npm install -g @simochee/backlog-cli
          - backlog issue close PROJ-123
```

**Repository settings > Pipelines > Repository variables** から環境変数を設定できます。`BACKLOG_SPACE`、`BACKLOG_API_KEY`、`BACKLOG_PROJECT` を追加してください。

### AWS CodeBuild

```yaml
# buildspec.yml
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 24
    commands:
      - npm install -g @simochee/backlog-cli
  build:
    commands:
      - backlog issue close PROJ-123
```

環境変数のセクションまたはAWS Systems Manager Parameter Storeからシークレット変数を設定できます。

## 活用例

CIパイプラインでの代表的なユースケースを紹介します。

### デプロイ後に課題をクローズする

```bash
backlog issue close PROJ-123
```

### 課題にコメントを追加する

```bash
backlog issue comment PROJ-123 --content "デプロイが完了しました (build: #${BUILD_NUMBER})"
```

### 課題のステータスを変更する

```bash
backlog issue status PROJ-123 --status 処理中
```

### JSON 出力でスクリプトと連携する

```bash
# 未完了の課題一覧を JSON で取得して後続処理に使う
backlog issue list --project PROJ --json | jq -r '.[].issueKey'
```

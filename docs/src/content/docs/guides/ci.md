---
title: CI での利用
description: CI/CD パイプラインで Backlog CLI を使用する方法
---

Backlog CLI は環境変数による認証に対応しているため、CI/CD パイプラインに組み込めます。`backlog auth login` を実行できない非インタラクティブ環境でも、環境変数を設定するだけで利用できます。

## 必要な環境変数

CI 環境では次の環境変数を設定してください。

| 環境変数          | 必須 | 説明                                                       |
| ----------------- | ---- | ---------------------------------------------------------- |
| `BACKLOG_SPACE`   | Yes  | Backlog スペースのホスト名（例: `your-space.backlog.com`） |
| `BACKLOG_API_KEY` | Yes  | Backlog の API キー                                        |
| `BACKLOG_PROJECT` | No   | デフォルトのプロジェクトキー                               |

API キーは Backlog の個人設定ページから発行できます。認証の詳細は[認証ガイド](/guides/authentication/)を参照してください。

:::caution
API キーをソースコードに直接記述しないでください。各 CI サービスのシークレット管理機能を使って安全に設定してください。
:::

## 前提条件

Backlog CLI は npm パッケージとして配布されているため、**Node.js ランタイム**が必要です。各 CI 環境で Node.js のセットアップを行ったうえで `npm install` してください。

## GitHub Actions

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

## GitLab CI/CD

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

GitLab では **Settings > CI/CD > Variables** からシークレット変数を設定できます。

## CircleCI

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

CircleCI では **Project Settings > Environment Variables** からシークレット変数を設定できます。

## Bitbucket Pipelines

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

Bitbucket では **Repository settings > Pipelines > Repository variables** からシークレット変数を設定できます。`BACKLOG_SPACE`、`BACKLOG_API_KEY`、`BACKLOG_PROJECT` を登録してください。

## AWS CodeBuild

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

AWS CodeBuild では環境変数のセクションからシークレット変数を設定できます。AWS Systems Manager Parameter Store の利用も可能です。

## 活用例

CI パイプラインで Backlog CLI を使う代表的なユースケースを紹介します。

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
# 未完了の課題一覧を JSON で取得
backlog issue list --project PROJ --json
```

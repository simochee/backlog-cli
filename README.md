<div align="center">

# backlog-cli

[![CI](https://github.com/simochee/backlog-cli/actions/workflows/ci.yaml/badge.svg)](https://github.com/simochee/backlog-cli/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/simochee/backlog-cli/branch/main/graph/badge.svg)](https://codecov.io/gh/simochee/backlog-cli)
[![npm version](https://img.shields.io/npm/v/@simochee/backlog-cli)](https://www.npmjs.com/package/@simochee/backlog-cli)
[![npm downloads](https://img.shields.io/npm/dm/@simochee/backlog-cli)](https://www.npmjs.com/package/@simochee/backlog-cli)
[![License: MIT](https://img.shields.io/github/license/simochee/backlog-cli)](./LICENSE)
[![Open in Visual Studio Code](https://img.shields.io/badge/Open_in-VSCode-007ACC?logo=visualstudiocode)](https://vscode.dev/github/simochee/backlog-cli)

**Backlog on the command line.**

ターミナルから離れずに [Backlog](https://backlog.com/) を操作する CLI ツール。
<br>
課題、プルリクエスト、Wiki、通知 ── すべてをコマンドラインで。

[ドキュメント](https://simochee.github.io/backlog-cli) · [npm](https://www.npmjs.com/package/@simochee/backlog-cli) · [Issues](https://github.com/simochee/backlog-cli/issues)

</div>

---

```bash
$ backlog issue list --project MYAPP --assignee @me
ID          種別    優先度  件名
MYAPP-142   タスク  高      API レスポンスのキャッシュ戦略を検討する
MYAPP-138   バグ    中      ログイン画面でエラーメッセージが表示されない
MYAPP-135   タスク  低      依存パッケージのアップデート

$ backlog issue view MYAPP-142
MYAPP-142: API レスポンスのキャッシュ戦略を検討する
状態: 処理中  優先度: 高  担当者: @simochee

$ backlog browse MYAPP-142
# => ブラウザで課題を開く
```

## ハイライト

- **99 コマンド** -- 課題、PR、Wiki、通知、Webhook まで Backlog API をフルカバー
- **柔軟な出力** -- テーブル / `--json` / `--jq` / `--template` でパイプラインに組み込める
- **対話 & 非対話** -- 引数を省略すればプロンプト、CI ではフラグ指定でそのまま動く
- **複数スペース** -- `backlog auth switch` でスペースを瞬時に切り替え
- **シェル補完** -- Bash / Zsh / Fish 対応

## インストール

```bash
npm install -g @simochee/backlog-cli
```

> yarn / pnpm / bun でのインストールは[ドキュメント](https://simochee.github.io/backlog-cli/getting-started/installation/)を参照。

## セットアップ

```bash
backlog auth login
```

ホスト名と認証方式を対話形式で設定。すぐに使い始められる。

```bash
backlog status
```

ダッシュボードが表示されれば準備完了。

> 認証方式やトークン管理の詳細は[認証ガイド](https://simochee.github.io/backlog-cli/guides/authentication/)へ。

## 使い方

```bash
# 課題を作成
backlog issue create --project MYAPP --title "検索機能の実装" --type タスク --priority 高

# プルリクエストを確認してマージ
backlog pr view MYAPP/main-repo/1
backlog pr merge MYAPP/main-repo/1

# 通知をチェック
backlog notification list

# JSON で取得してパイプ
backlog issue list --project MYAPP --json key,summary | jq '.[].summary'

# API を直接叩く
backlog api /api/v2/space
```

各コマンドの詳細は `backlog <command> --help` または[コマンドリファレンス](https://simochee.github.io/backlog-cli/commands/issue/)で。

## AI エージェント連携

backlog-cli は [Agent Skill](https://github.com/vercel-labs/skills) に対応しています。インストールすると、AI コーディングエージェントが Backlog の操作方法を自動的に理解します。

```bash
npx skills add simochee/backlog-cli
```

> スキルをインストールすると、エージェントに backlog-cli の全コマンド・オプション・データモデルが提供され、ハウトゥーの説明なしに課題管理や PR 操作を指示できるようになります。

## ドキュメント

**https://simochee.github.io/backlog-cli**

- [クイックスタート](https://simochee.github.io/backlog-cli/getting-started/quickstart/)
- [出力形式](https://simochee.github.io/backlog-cli/guides/output-formatting/)
- [シェル補完](https://simochee.github.io/backlog-cli/guides/shell-completion/)
- [設定](https://simochee.github.io/backlog-cli/guides/configuration/)

## コントリビュート

```bash
git clone https://github.com/simochee/backlog-cli.git
cd backlog-cli
bun install
bun run dev
```

| コマンド             | 内容                |
| -------------------- | ------------------- |
| `bun run dev`        | 開発モードで実行    |
| `bun run build`      | ビルド              |
| `bun run test`       | テスト実行          |
| `bun run lint`       | oxlint によるリント |
| `bun run type-check` | 型チェック          |

## ライセンス

[MIT](./LICENSE)

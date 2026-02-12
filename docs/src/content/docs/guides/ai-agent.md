---
title: AI エージェント連携
description: Claude Code や Cursor 等の AI コーディングエージェントから Backlog CLI を使う方法
---

Backlog CLIは [Agent Skill](https://github.com/vercel-labs/skills) を同梱しており、AIコーディングエージェントにBacklog CLIの操作方法を自動的に教えることができます。

スキルをインストールすると、コマンドの説明なしにエージェントへ直接「PROJ-123の課題を処理中にして」「PRを作成して」といった指示を出せるようになります。

## 対応エージェント

[skills CLI](https://www.npmjs.com/package/skills) は35以上のエージェントに対応しています。主な対応エージェントは以下のとおりです。

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor](https://cursor.sh/)
- [OpenAI Codex](https://openai.com/index/openai-codex/)
- [Windsurf](https://codeium.com/windsurf)
- その他（Gemini CLI、GitHub Copilot、Roo、OpenCodeなど）

## インストール

### skills CLI を使う（推奨）

```bash
npx skills add simochee/backlog-cli
```

インタラクティブにインストール先のエージェントを選択できます。特定のエージェントを指定できます。

```bash
# Claude Code にインストール
npx skills add simochee/backlog-cli -a claude-code -y

# Cursor にインストール
npx skills add simochee/backlog-cli -a cursor -y
```

全プロジェクトで利用する場合は、グローバルにインストールします。

```bash
npx skills add simochee/backlog-cli -g
```

### 手動インストール

リポジトリの `skills/backlog-cli/` ディレクトリを、エージェントのスキルディレクトリにコピーします。

```bash
# Claude Code の場合（グローバル）
cp -r skills/backlog-cli/ ~/.claude/skills/backlog-cli/

# Claude Code の場合（プロジェクトローカル）
cp -r skills/backlog-cli/ .claude/skills/backlog-cli/
```

## スキルの内容

インストールされるスキルには、エージェントがBacklog CLIを正しく使うための情報が含まれています。

| ファイル                 | 内容                                                     |
| ------------------------ | -------------------------------------------------------- |
| `SKILL.md`               | コマンドの使い方、認証、名前解決、主要ワークフローの説明 |
| `references/commands.md` | 全 99 コマンドのフラグ・オプション一覧                   |
| `references/schema.md`   | `--json` 出力のデータモデル定義（Issue、PR、Project 等） |

## 使い方の例

スキルのインストール後、エージェントに自然言語でBacklog操作を指示できます。

- 「PROJ-123の詳細を見せて」
- 「自分に割り当てられた未完了の課題を一覧して」
- 「この変更をPRにしてPROJ-456に紐づけて」
- 「PROJ-789を処理中にしてコメントを追加して」
- 「プロジェクトMYAPPの課題種別一覧を確認して」

エージェントはスキルの情報をもとに、必要な `backlog` コマンドを組み立てて実行します。

## 前提条件

エージェントがBacklog CLIを利用するには、事前に次の準備が必要です。

1. **Backlog CLI のインストール**: `npm install -g @simochee/backlog-cli`
2. **認証の設定**: `backlog auth login` で認証済み、または環境変数（`BACKLOG_SPACE` + `BACKLOG_API_KEY`）を設定済み

認証方法の詳細は [認証ガイド](/guides/authentication/) を参照してください。

## Backlog MCP Server との違い

Nulab が公式に提供する [Backlog MCP Server](https://github.com/nulab/backlog-mcp-server) は、[Model Context Protocol（MCP）](https://modelcontextprotocol.io/)を通じて AI エージェントに Backlog API のツールを直接公開するサーバーです。

Backlog CLI + Agent Skills も AI エージェントから Backlog を操作できますが、アーキテクチャや特性が異なります。用途に応じて選択してください。

|  | Backlog CLI + Skills | Backlog MCP Server |
| --- | --- | --- |
| **アーキテクチャ** | エージェントが CLI コマンドをシェル経由で実行 | エージェントが MCP プロトコル経由でツールを呼び出し |
| **提供元** | コミュニティ（[@simochee](https://github.com/simochee)） | Nulab 公式 |
| **対応エージェント** | 35 以上（Claude Code、Cursor、Codex、Windsurf 等） | MCP 対応クライアント（Claude Desktop、Cursor、Cline 等） |
| **セットアップ** | CLI インストール + スキルファイル配置 | MCP サーバープロセスの起動（Docker / npx） |
| **API カバレッジ** | 99 コマンド（19 カテゴリ） | 7 ツールセット（space / project / issue / wiki / git / notifications / document） |
| **人間の利用** | CLI として直接利用可能 | AI エージェント専用 |
| **シェル連携** | パイプ、`jq`、スクリプト、エイリアス等が利用可能 | 不可 |
| **認証方式** | API Key + OAuth 2.0（トークン自動更新） | API Key のみ |
| **レスポンス最適化** | `--json field1,field2` でフィールド選択 | GraphQL スタイルのフィールド選択 + トークン上限制御 |

### Backlog CLI + Skills が向いているケース

- **コーディングエージェント**（Claude Code、Cursor、Codex 等）のワークフローに組み込みたい
- シェルのパイプやスクリプトと組み合わせて柔軟に操作したい
- CI/CD パイプラインでも同じコマンドを使いたい
- OAuth 2.0 認証が必要
- 人間と AI エージェントが同じツールを共有したい

### Backlog MCP Server が向いているケース

- **チャット型エージェント**（Claude Desktop 等）から Backlog を操作したい
- MCP エコシステムの他のサーバーと統合したい
- レスポンスのトークン数を細かく制御したい

### 併用について

両者は競合せず、併用できます。たとえば、Claude Desktop では MCP Server を使い、Claude Code や CI 環境では Backlog CLI + Skills を使うといった構成が可能です。

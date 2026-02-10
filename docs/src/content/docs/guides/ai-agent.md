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

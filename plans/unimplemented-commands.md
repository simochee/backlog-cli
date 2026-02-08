# 未実装コマンドの検討

当初検討されていた 7 コマンドについて、gh CLI に対応するコマンドがあるかを調査し、実装判断を行った。

## 最終判断結果

| backlog-cli コマンド     | gh CLI 対応コマンド | 実装状況     |
| ------------------------ | ------------------- | ------------ |
| `issue delete`           | `gh issue delete`   | ✅ **実装完了** |
| `issue comments`         | なし                | 見送り       |
| `issue count`            | なし                | 見送り       |
| `issue attachments`      | なし                | 見送り       |
| `issue participants`     | なし                | 見送り       |
| `pr count`               | なし                | 見送り       |
| `pr attachments`         | なし                | 見送り       |

## 判断基準

gh CLI に対応するコマンドが存在するものを実装対象とする。

## 実装完了: `issue delete`

- **対応 API**: `DELETE /api/v2/issues/:issueIdOrKey`
- **gh CLI の仕様**: `gh issue delete {<number> | <url>} [--yes]`
  - `--yes` フラグで確認プロンプトをスキップ
- **backlog-cli での実装**:
  - 引数: `issueKey`（positional、例: `PROJECT-123`）
  - オプション: `--yes` / `-y`（確認スキップ）
  - デフォルトでは確認プロンプトを表示（破壊的操作のため）
- **実装場所**: `packages/cli/src/commands/issue/delete.ts`

## 見送りコマンドの理由

| コマンド             | 見送り理由                                                             |
| -------------------- | ---------------------------------------------------------------------- |
| `issue comments`     | `issue view --comments` で代替可能。gh CLI にも専用コマンドなし        |
| `issue count`        | `issue list` で件数確認可能。gh CLI にもカウント専用コマンドなし       |
| `issue attachments`  | ファイル I/O が絡み実装が複雑。gh CLI にも対応なし                     |
| `issue participants` | `issue view` で参加者情報は確認可能。gh CLI にも対応なし               |
| `pr count`           | `pr list` で件数確認可能。gh CLI にもカウント専用コマンドなし          |
| `pr attachments`     | ファイル I/O が絡み実装が複雑。gh CLI にも対応なし                     |

## 参考

- [gh issue - subcommands](https://cli.github.com/manual/gh_issue)
- [gh issue delete](https://cli.github.com/manual/gh_issue_delete)
- [gh pr - subcommands](https://cli.github.com/manual/gh_pr)

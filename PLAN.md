# backlog-cli 実装計画

> gh CLI のインターフェースを基準に、Backlog API を操作する CLI ツール。
>
> Phase 1〜4 の全 99 コマンド + `issue delete` の実装が完了。詳細な仕様は `plans/` 配下を参照。

---

## 未実装（バックログ）

`plans/command-overview.md` に構想として記載されているが、実装スコープ外としたコマンド:

| コマンド             | 対応 API                                        | 備考                |
| -------------------- | ----------------------------------------------- | ------------------- |
| `issue comments`     | `GET /api/v2/issues/:issueIdOrKey/comments`     | コメント一覧表示    |
| `issue count`        | `GET /api/v2/issues/count`                      | 課題件数取得        |
| `issue attachments`  | `GET /api/v2/issues/:issueIdOrKey/attachments`  | 添付ファイル一覧    |
| `issue participants` | `GET /api/v2/issues/:issueIdOrKey/participants` | 参加者一覧          |
| `pr count`           | `GET .../pullRequests/count`                    | PR 件数取得         |
| `pr attachments`     | `GET .../pullRequests/:number/attachments`      | PR 添付ファイル一覧 |

---

## 関連ドキュメント

| ファイル                          | 内容                                             |
| --------------------------------- | ------------------------------------------------ |
| `CLAUDE.md`                       | 開発ガイドライン・設計原則・テストルール         |
| `plans/command-specifications.md` | 全コマンドの引数・オプション・API マッピング詳細 |
| `plans/command-overview.md`       | コマンドツリーと設計方針                         |
| `plans/gh-backlog-mapping.md`     | gh CLI → backlog CLI のマッピング                |
| `plans/backlog-api-reference.md`  | Backlog API エンドポイントリファレンス           |
| `plans/agent-skills.md`           | Agent Skills の設計構想                          |

# gh CLI ↔ Backlog API マッピング

> gh CLI のコマンド体系を基準に、対応する Backlog API エンドポイントをマッピングする。
> Backlog 固有の機能で gh CLI に直接対応がないものは `backlog api` コマンド経由で呼び出す設計とする。

---

## 凡例

| 記号    | 意味                                              |
| ------- | ------------------------------------------------- |
| **CLI** | `backlog <group> <subcommand>` として実装するもの |
| **API** | `backlog api` 経由のみ（専用コマンドなし）        |
| **N/A** | Backlog に該当機能がない                          |
| **--**  | gh CLI に該当コマンドがない（Backlog 固有）       |

---

## 1. `auth` — 認証

| gh CLI              | backlog CLI            | Backlog API                | 備考                                    |
| ------------------- | ---------------------- | -------------------------- | --------------------------------------- |
| `gh auth login`     | `backlog auth login`   | OAuth 2.0 / API Key        | Backlog は API Key と OAuth 2.0 の2方式 |
| `gh auth logout`    | `backlog auth logout`  | —                          | ローカル設定の削除                      |
| `gh auth status`    | `backlog auth status`  | `GET /api/v2/users/myself` | 認証状態の確認                          |
| `gh auth token`     | `backlog auth token`   | —                          | 保存済みトークンの表示                  |
| `gh auth refresh`   | `backlog auth refresh` | OAuth 2.0 refresh          | OAuth 利用時のみ                        |
| `gh auth switch`    | `backlog auth switch`  | —                          | 複数スペース切り替え                    |
| `gh auth setup-git` | N/A                    | —                          | Backlog Git は別途認証                  |

---

## 2. `issue` — 課題

| gh CLI                  | backlog CLI                   | Backlog API                                  | 備考                         |
| ----------------------- | ----------------------------- | -------------------------------------------- | ---------------------------- |
| `gh issue list`         | `backlog issue list`          | `GET /api/v2/issues`                         |                              |
| `gh issue view <id>`    | `backlog issue view <key>`    | `GET /api/v2/issues/:issueIdOrKey`           | `PROJECT-123` 形式           |
| `gh issue create`       | `backlog issue create`        | `POST /api/v2/issues`                        |                              |
| `gh issue edit <id>`    | `backlog issue edit <key>`    | `PATCH /api/v2/issues/:issueIdOrKey`         |                              |
| `gh issue close <id>`   | `backlog issue close <key>`   | `PATCH /api/v2/issues/:issueIdOrKey`         | statusId を変更              |
| `gh issue reopen <id>`  | `backlog issue reopen <key>`  | `PATCH /api/v2/issues/:issueIdOrKey`         | statusId を変更              |
| `gh issue delete <id>`  | `backlog issue delete <key>`  | `DELETE /api/v2/issues/:issueIdOrKey`        |                              |
| `gh issue comment <id>` | `backlog issue comment <key>` | `POST /api/v2/issues/:issueIdOrKey/comments` |                              |
| `gh issue status`       | `backlog issue status`        | `GET /api/v2/issues` + フィルタ              | 自分に関連する課題一覧       |
| `gh issue lock`         | N/A                           | —                                            | Backlog に課題ロック機能なし |
| `gh issue unlock`       | N/A                           | —                                            |                              |
| `gh issue pin`          | N/A                           | —                                            |                              |
| `gh issue unpin`        | N/A                           | —                                            |                              |
| `gh issue transfer`     | N/A                           | —                                            |                              |
| `gh issue develop`      | N/A                           | —                                            |                              |

### Issue 関連の追加サブコマンド候補

| backlog CLI                        | Backlog API                                     | 備考             |
| ---------------------------------- | ----------------------------------------------- | ---------------- |
| `backlog issue comments <key>`     | `GET /api/v2/issues/:issueIdOrKey/comments`     | コメント一覧表示 |
| `backlog issue count`              | `GET /api/v2/issues/count`                      | 課題数のカウント |
| `backlog issue attachments <key>`  | `GET /api/v2/issues/:issueIdOrKey/attachments`  | 添付ファイル一覧 |
| `backlog issue participants <key>` | `GET /api/v2/issues/:issueIdOrKey/participants` | 参加者一覧       |

---

## 3. `pr` — プルリクエスト

| gh CLI                 | backlog CLI                | Backlog API                              | 備考                          |
| ---------------------- | -------------------------- | ---------------------------------------- | ----------------------------- |
| `gh pr list`           | `backlog pr list`          | `GET .../pullRequests`                   | パスに project/repo が必要    |
| `gh pr view <num>`     | `backlog pr view <num>`    | `GET .../pullRequests/:number`           |                               |
| `gh pr create`         | `backlog pr create`        | `POST .../pullRequests`                  |                               |
| `gh pr edit <num>`     | `backlog pr edit <num>`    | `PATCH .../pullRequests/:number`         |                               |
| `gh pr comment <num>`  | `backlog pr comment <num>` | `POST .../pullRequests/:number/comments` |                               |
| `gh pr close <num>`    | `backlog pr close <num>`   | `PATCH .../pullRequests/:number`         | status 変更                   |
| `gh pr merge <num>`    | `backlog pr merge <num>`   | `PATCH .../pullRequests/:number`         | status 変更                   |
| `gh pr status`         | `backlog pr status`        | `GET .../pullRequests` + フィルタ        |                               |
| `gh pr diff <num>`     | N/A                        | —                                        | Backlog API にdiff取得なし    |
| `gh pr checkout <num>` | N/A                        | —                                        | ローカルgit操作で代替可能     |
| `gh pr ready <num>`    | N/A                        | —                                        | Backlog にドラフトPR概念なし  |
| `gh pr review <num>`   | N/A                        | —                                        | Backlog にレビュー承認APIなし |
| `gh pr reopen <num>`   | `backlog pr reopen <num>`  | `PATCH .../pullRequests/:number`         | status 変更                   |
| `gh pr revert <num>`   | N/A                        | —                                        |                               |
| `gh pr checks <num>`   | N/A                        | —                                        |                               |
| `gh pr lock`           | N/A                        | —                                        |                               |
| `gh pr unlock`         | N/A                        | —                                        |                               |
| `gh pr update-branch`  | N/A                        | —                                        |                               |

> **PR APIパスのフルパターン:** `/api/v2/projects/:projectIdOrKey/git/repositories/:repoIdOrName/pullRequests`

### PR 関連の追加サブコマンド候補

| backlog CLI                    | Backlog API                                | 備考             |
| ------------------------------ | ------------------------------------------ | ---------------- |
| `backlog pr comments <num>`    | `GET .../pullRequests/:number/comments`    | コメント一覧     |
| `backlog pr count`             | `GET .../pullRequests/count`               | PR数のカウント   |
| `backlog pr attachments <num>` | `GET .../pullRequests/:number/attachments` | 添付ファイル一覧 |

---

## 4. `project` — プロジェクト

gh CLI の `project` は GitHub Projects (タスクボード) だが、Backlog の「プロジェクト」はリポジトリのようなトップレベル概念。gh CLI の `repo` に近い。

| gh CLI (repo 相当) | backlog CLI              | Backlog API                               | 備考                         |
| ------------------ | ------------------------ | ----------------------------------------- | ---------------------------- |
| `gh repo list`     | `backlog project list`   | `GET /api/v2/projects`                    |                              |
| `gh repo view`     | `backlog project view`   | `GET /api/v2/projects/:projectIdOrKey`    |                              |
| `gh repo create`   | `backlog project create` | `POST /api/v2/projects`                   |                              |
| `gh repo edit`     | `backlog project edit`   | `PATCH /api/v2/projects/:projectIdOrKey`  |                              |
| `gh repo delete`   | `backlog project delete` | `DELETE /api/v2/projects/:projectIdOrKey` |                              |
| `gh repo archive`  | N/A                      | —                                         | Backlog にアーカイブ機能なし |

### Project 管理サブコマンド候補

| backlog CLI                         | Backlog API                            | 備考           |
| ----------------------------------- | -------------------------------------- | -------------- |
| `backlog project users <key>`       | `GET /api/v2/projects/:key/users`      | メンバー一覧   |
| `backlog project add-user <key>`    | `POST /api/v2/projects/:key/users`     | メンバー追加   |
| `backlog project remove-user <key>` | `DELETE /api/v2/projects/:key/users`   | メンバー削除   |
| `backlog project activities <key>`  | `GET /api/v2/projects/:key/activities` | 更新履歴       |
| `backlog project disk-usage <key>`  | `GET /api/v2/projects/:key/diskUsage`  | ディスク使用量 |

---

## 5. `repo` — Git リポジトリ

Backlog ではプロジェクト配下に Git リポジトリがある。

| gh CLI           | backlog CLI          | Backlog API                                        | 備考                                           |
| ---------------- | -------------------- | -------------------------------------------------- | ---------------------------------------------- |
| `gh repo list`   | `backlog repo list`  | `GET /api/v2/projects/:key/git/repositories`       | プロジェクト内リポジトリ一覧                   |
| `gh repo view`   | `backlog repo view`  | `GET /api/v2/projects/:key/git/repositories/:name` |                                                |
| `gh repo clone`  | `backlog repo clone` | —                                                  | ローカル git clone で実装                      |
| `gh repo create` | N/A                  | —                                                  | Backlog API にリポジトリ作成なし（Web UIのみ） |

---

## 6. `wiki` — Wiki（Backlog 固有）

gh CLI には Wiki 専用コマンドがない（`gh browse --wiki` のみ）。Backlog では Wiki は重要な機能。

| backlog CLI                     | Backlog API                             | gh CLI 相当 |
| ------------------------------- | --------------------------------------- | ----------- |
| `backlog wiki list`             | `GET /api/v2/wikis`                     | --          |
| `backlog wiki view <id>`        | `GET /api/v2/wikis/:wikiId`             | --          |
| `backlog wiki create`           | `POST /api/v2/wikis`                    | --          |
| `backlog wiki edit <id>`        | `PATCH /api/v2/wikis/:wikiId`           | --          |
| `backlog wiki delete <id>`      | `DELETE /api/v2/wikis/:wikiId`          | --          |
| `backlog wiki count`            | `GET /api/v2/wikis/count`               | --          |
| `backlog wiki tags`             | `GET /api/v2/wikis/tags`                | --          |
| `backlog wiki history <id>`     | `GET /api/v2/wikis/:wikiId/history`     | --          |
| `backlog wiki attachments <id>` | `GET /api/v2/wikis/:wikiId/attachments` | --          |

---

## 7. `config` — 設定

| gh CLI           | backlog CLI           | 備考                   |
| ---------------- | --------------------- | ---------------------- |
| `gh config get`  | `backlog config get`  | ローカル設定の取得     |
| `gh config set`  | `backlog config set`  | ローカル設定の書き込み |
| `gh config list` | `backlog config list` | 設定一覧表示           |

---

## 8. `status` — ステータス概要

| gh CLI      | backlog CLI      | Backlog API         | 備考                                       |
| ----------- | ---------------- | ------------------- | ------------------------------------------ |
| `gh status` | `backlog status` | 複数APIの組み合わせ | 自分の課題・通知・最近の更新をまとめて表示 |

使用する API:

- `GET /api/v2/users/myself`
- `GET /api/v2/notifications`
- `GET /api/v2/users/myself/recentlyViewedIssues`
- `GET /api/v2/issues` (assigneeId=自分)

---

## 9. `notification` — 通知（Backlog 固有拡張）

| backlog CLI                     | Backlog API                                 | gh CLI 相当        |
| ------------------------------- | ------------------------------------------- | ------------------ |
| `backlog notification list`     | `GET /api/v2/notifications`                 | `gh status` の一部 |
| `backlog notification count`    | `GET /api/v2/notifications/count`           | --                 |
| `backlog notification read`     | `POST /api/v2/notifications/:id/markAsRead` | --                 |
| `backlog notification read-all` | `POST /api/v2/notifications/markAsRead`     | --                 |

---

## 10. `user` — ユーザー管理

| backlog CLI                    | Backlog API                            | gh CLI 相当             |
| ------------------------------ | -------------------------------------- | ----------------------- |
| `backlog user list`            | `GET /api/v2/users`                    | --                      |
| `backlog user view <id>`       | `GET /api/v2/users/:userId`            | --                      |
| `backlog user me`              | `GET /api/v2/users/myself`             | `gh auth status` の一部 |
| `backlog user activities <id>` | `GET /api/v2/users/:userId/activities` | --                      |

---

## 11. `team` — チーム管理

| backlog CLI                | Backlog API                    | gh CLI 相当          |
| -------------------------- | ------------------------------ | -------------------- |
| `backlog team list`        | `GET /api/v2/teams`            | `gh org list` に類似 |
| `backlog team view <id>`   | `GET /api/v2/teams/:teamId`    | --                   |
| `backlog team create`      | `POST /api/v2/teams`           | --                   |
| `backlog team edit <id>`   | `PATCH /api/v2/teams/:teamId`  | --                   |
| `backlog team delete <id>` | `DELETE /api/v2/teams/:teamId` | --                   |

---

## 12. `space` — スペース管理（Backlog 固有）

| backlog CLI                  | Backlog API                      | gh CLI 相当 |
| ---------------------------- | -------------------------------- | ----------- |
| `backlog space info`         | `GET /api/v2/space`              | --          |
| `backlog space activities`   | `GET /api/v2/space/activities`   | --          |
| `backlog space disk-usage`   | `GET /api/v2/space/diskUsage`    | --          |
| `backlog space notification` | `GET /api/v2/space/notification` | --          |

---

## 13. `label` — ラベル（→ Backlog ではカテゴリ・マイルストーン・種別）

gh CLI の `label` に対応する Backlog の概念は3種類ある。

### カテゴリ

| backlog CLI                    | Backlog API                                   |
| ------------------------------ | --------------------------------------------- |
| `backlog category list`        | `GET /api/v2/projects/:key/categories`        |
| `backlog category create`      | `POST /api/v2/projects/:key/categories`       |
| `backlog category edit <id>`   | `PATCH /api/v2/projects/:key/categories/:id`  |
| `backlog category delete <id>` | `DELETE /api/v2/projects/:key/categories/:id` |

### マイルストーン / バージョン

| backlog CLI                     | Backlog API                                 |
| ------------------------------- | ------------------------------------------- |
| `backlog milestone list`        | `GET /api/v2/projects/:key/versions`        |
| `backlog milestone create`      | `POST /api/v2/projects/:key/versions`       |
| `backlog milestone edit <id>`   | `PATCH /api/v2/projects/:key/versions/:id`  |
| `backlog milestone delete <id>` | `DELETE /api/v2/projects/:key/versions/:id` |

### 課題種別

| backlog CLI                      | Backlog API                                   |
| -------------------------------- | --------------------------------------------- |
| `backlog issue-type list`        | `GET /api/v2/projects/:key/issueTypes`        |
| `backlog issue-type create`      | `POST /api/v2/projects/:key/issueTypes`       |
| `backlog issue-type edit <id>`   | `PATCH /api/v2/projects/:key/issueTypes/:id`  |
| `backlog issue-type delete <id>` | `DELETE /api/v2/projects/:key/issueTypes/:id` |

### ステータス

| backlog CLI                       | Backlog API                                 |
| --------------------------------- | ------------------------------------------- |
| `backlog status-type list`        | `GET /api/v2/projects/:key/statuses`        |
| `backlog status-type create`      | `POST /api/v2/projects/:key/statuses`       |
| `backlog status-type edit <id>`   | `PATCH /api/v2/projects/:key/statuses/:id`  |
| `backlog status-type delete <id>` | `DELETE /api/v2/projects/:key/statuses/:id` |

---

## 14. `webhook` — Webhook 管理

| backlog CLI                   | Backlog API                                 | gh CLI 相当                |
| ----------------------------- | ------------------------------------------- | -------------------------- |
| `backlog webhook list`        | `GET /api/v2/projects/:key/webhooks`        | -- (gh は `secret` で近い) |
| `backlog webhook view <id>`   | `GET /api/v2/projects/:key/webhooks/:id`    | --                         |
| `backlog webhook create`      | `POST /api/v2/projects/:key/webhooks`       | --                         |
| `backlog webhook edit <id>`   | `PATCH /api/v2/projects/:key/webhooks/:id`  | --                         |
| `backlog webhook delete <id>` | `DELETE /api/v2/projects/:key/webhooks/:id` | --                         |

---

## 15. `star` — スター（Backlog 固有）

| backlog CLI          | Backlog API                             | gh CLI 相当           |
| -------------------- | --------------------------------------- | --------------------- |
| `backlog star add`   | `POST /api/v2/stars`                    | `gh repo star` に類似 |
| `backlog star list`  | `GET /api/v2/users/:userId/stars`       | --                    |
| `backlog star count` | `GET /api/v2/users/:userId/stars/count` | --                    |

---

## 16. `watching` — ウォッチ

| backlog CLI                    | Backlog API                             | gh CLI 相当 |
| ------------------------------ | --------------------------------------- | ----------- |
| `backlog watching list`        | `GET /api/v2/users/:userId/watchings`   | --          |
| `backlog watching add`         | `POST /api/v2/watchings`                | --          |
| `backlog watching view <id>`   | `GET /api/v2/watchings/:watchingId`     | --          |
| `backlog watching delete <id>` | `DELETE /api/v2/watchings/:watchingId`  | --          |
| `backlog watching read <id>`   | `POST /api/v2/watchings/:id/markAsRead` | --          |

---

## 17. `api` — 汎用 API リクエスト

| gh CLI              | backlog CLI              | 備考                              |
| ------------------- | ------------------------ | --------------------------------- |
| `gh api <endpoint>` | `backlog api <endpoint>` | 任意の Backlog API を直接呼び出し |

`backlog api` でカバーする主な用途:

- カスタムフィールド操作 (`/api/v2/projects/:key/customFields/...`)
- 共有ファイル操作 (`/api/v2/projects/:key/files/...`)
- プロジェクト管理者操作 (`/api/v2/projects/:key/administrators/...`)
- 添付ファイルのアップロード (`POST /api/v2/space/attachment`)
- ライセンス情報 (`GET /api/v2/space/licence`)
- レートリミット確認 (`GET /api/v2/rateLimit`)
- 優先度/完了理由マスタ (`GET /api/v2/priorities`, `GET /api/v2/resolutions`)
- 最近閲覧した項目 (`GET /api/v2/users/myself/recentlyViewed*`)

---

## 18. `browse` — ブラウザで開く

| gh CLI               | backlog CLI               | 備考                     |
| -------------------- | ------------------------- | ------------------------ |
| `gh browse`          | `backlog browse`          | プロジェクトページを開く |
| `gh browse --issues` | `backlog browse --issues` | 課題一覧を開く           |
| `gh browse --wiki`   | `backlog browse --wiki`   | Wikiを開く               |

---

## 19. `completion` — シェル補完

| gh CLI          | backlog CLI          | 備考                             |
| --------------- | -------------------- | -------------------------------- |
| `gh completion` | `backlog completion` | bash/zsh/fish 補完スクリプト生成 |

---

## 20. `alias` — エイリアス

| gh CLI            | backlog CLI            | 備考                       |
| ----------------- | ---------------------- | -------------------------- |
| `gh alias set`    | `backlog alias set`    | コマンドショートカット作成 |
| `gh alias list`   | `backlog alias list`   | エイリアス一覧             |
| `gh alias delete` | `backlog alias delete` | エイリアス削除             |

---

## gh CLI 機能で Backlog に対応がないもの

以下の gh CLI コマンドグループは Backlog に該当概念がなく、実装対象外とする。

| gh CLI コマンド             | 理由                                               |
| --------------------------- | -------------------------------------------------- |
| `gh codespace`              | Backlog にクラウド開発環境なし                     |
| `gh gist`                   | Backlog にスニペット共有機能なし                   |
| `gh run` / `gh workflow`    | Backlog に CI/CD なし                              |
| `gh cache`                  | GitHub Actions 専用                                |
| `gh secret` / `gh variable` | GitHub Actions 専用                                |
| `gh ssh-key` / `gh gpg-key` | Backlog の鍵管理は Web UI のみ                     |
| `gh release`                | Backlog にリリース管理なし（マイルストーンで代替） |
| `gh search`                 | Backlog に横断検索 API なし（課題フィルタで代替）  |
| `gh attestation`            | GitHub 固有                                        |
| `gh ruleset`                | GitHub 固有                                        |
| `gh extension`              | 将来的に実装可能だが初期スコープ外                 |
| `gh org`                    | Backlog はスペース単位（`space` コマンドで代替）   |

# Backlog API v2 エンドポイント一覧

> 参照: https://developer.nulab.com/docs/backlog/

**Base URL:** `https://{spaceKey}.backlog.com/api/v2` or `https://{spaceKey}.backlog.jp/api/v2`
**認証:** API Key (`?apiKey=xxx`) / OAuth 2.0 (`Authorization: Bearer xxx`)

---

## 1. Space（7 件）

| Method | Path                  | 説明                     |
| ------ | --------------------- | ------------------------ |
| GET    | `/space`              | スペース情報取得         |
| GET    | `/space/activities`   | 最近の更新               |
| GET    | `/space/logo`         | スペースロゴ画像         |
| GET    | `/space/notification` | スペース通知取得         |
| PUT    | `/space/notification` | スペース通知更新         |
| GET    | `/space/diskUsage`    | ディスク使用量           |
| POST   | `/space/attachment`   | 添付ファイルアップロード |

## 2. Users（10 件）

| Method | Path                         | 説明                 |
| ------ | ---------------------------- | -------------------- |
| GET    | `/users`                     | ユーザー一覧         |
| GET    | `/users/:userId`             | ユーザー情報         |
| POST   | `/users`                     | ユーザー追加         |
| PATCH  | `/users/:userId`             | ユーザー更新         |
| DELETE | `/users/:userId`             | ユーザー削除         |
| GET    | `/users/myself`              | 自分のユーザー情報   |
| GET    | `/users/:userId/icon`        | ユーザーアイコン     |
| GET    | `/users/:userId/activities`  | ユーザーの最近の更新 |
| GET    | `/users/:userId/stars`       | 受け取ったスター一覧 |
| GET    | `/users/:userId/stars/count` | 受け取ったスター数   |

## 3. Teams（11 件）

| Method | Path                           | 説明                   |
| ------ | ------------------------------ | ---------------------- |
| GET    | `/teams`                       | チーム一覧             |
| POST   | `/teams`                       | チーム追加             |
| GET    | `/teams/:teamId`               | チーム情報             |
| PATCH  | `/teams/:teamId`               | チーム更新             |
| DELETE | `/teams/:teamId`               | チーム削除             |
| GET    | `/teams/:teamId/icon`          | チームアイコン         |
| GET    | `/projects/:key/teams`         | プロジェクトチーム一覧 |
| POST   | `/projects/:key/teams`         | プロジェクトチーム追加 |
| DELETE | `/projects/:key/teams/:teamId` | プロジェクトチーム削除 |
| GET    | `/groups`                      | グループ一覧（非推奨） |
| GET    | `/groups/:groupId`             | グループ情報（非推奨） |

## 4. Projects（10 件）

| Method | Path                        | 説明                     |
| ------ | --------------------------- | ------------------------ |
| GET    | `/projects`                 | プロジェクト一覧         |
| POST   | `/projects`                 | プロジェクト追加         |
| GET    | `/projects/:key`            | プロジェクト情報         |
| PATCH  | `/projects/:key`            | プロジェクト更新         |
| DELETE | `/projects/:key`            | プロジェクト削除         |
| GET    | `/projects/:key/image`      | プロジェクトアイコン     |
| GET    | `/projects/:key/activities` | プロジェクトの最近の更新 |
| GET    | `/projects/:key/users`      | プロジェクトメンバー一覧 |
| POST   | `/projects/:key/users`      | プロジェクトメンバー追加 |
| DELETE | `/projects/:key/users`      | プロジェクトメンバー削除 |

## 5. Project Administrators（3 件）

| Method | Path                            | 説明       |
| ------ | ------------------------------- | ---------- |
| GET    | `/projects/:key/administrators` | 管理者一覧 |
| POST   | `/projects/:key/administrators` | 管理者追加 |
| DELETE | `/projects/:key/administrators` | 管理者削除 |

## 6. Statuses（5 件）

| Method | Path                                         | 説明           |
| ------ | -------------------------------------------- | -------------- |
| GET    | `/projects/:key/statuses`                    | ステータス一覧 |
| POST   | `/projects/:key/statuses`                    | ステータス追加 |
| PATCH  | `/projects/:key/statuses/:statusId`          | ステータス更新 |
| DELETE | `/projects/:key/statuses/:statusId`          | ステータス削除 |
| PATCH  | `/projects/:key/statuses/updateDisplayOrder` | 表示順更新     |

## 7. Issue Types（4 件）

| Method | Path                            | 説明         |
| ------ | ------------------------------- | ------------ |
| GET    | `/projects/:key/issueTypes`     | 課題種別一覧 |
| POST   | `/projects/:key/issueTypes`     | 課題種別追加 |
| PATCH  | `/projects/:key/issueTypes/:id` | 課題種別更新 |
| DELETE | `/projects/:key/issueTypes/:id` | 課題種別削除 |

## 8. Categories（4 件）

| Method | Path                            | 説明         |
| ------ | ------------------------------- | ------------ |
| GET    | `/projects/:key/categories`     | カテゴリ一覧 |
| POST   | `/projects/:key/categories`     | カテゴリ追加 |
| PATCH  | `/projects/:key/categories/:id` | カテゴリ更新 |
| DELETE | `/projects/:key/categories/:id` | カテゴリ削除 |

## 9. Versions / Milestones（4 件）

| Method | Path                          | 説明                          |
| ------ | ----------------------------- | ----------------------------- |
| GET    | `/projects/:key/versions`     | バージョン/マイルストーン一覧 |
| POST   | `/projects/:key/versions`     | バージョン/マイルストーン追加 |
| PATCH  | `/projects/:key/versions/:id` | バージョン/マイルストーン更新 |
| DELETE | `/projects/:key/versions/:id` | バージョン/マイルストーン削除 |

## 10. Custom Fields（7 件）

| Method | Path                                            | 説明                   |
| ------ | ----------------------------------------------- | ---------------------- |
| GET    | `/projects/:key/customFields`                   | カスタムフィールド一覧 |
| POST   | `/projects/:key/customFields`                   | カスタムフィールド追加 |
| PATCH  | `/projects/:key/customFields/:id`               | カスタムフィールド更新 |
| DELETE | `/projects/:key/customFields/:id`               | カスタムフィールド削除 |
| POST   | `/projects/:key/customFields/:id/items`         | リスト項目追加         |
| PATCH  | `/projects/:key/customFields/:id/items/:itemId` | リスト項目更新         |
| DELETE | `/projects/:key/customFields/:id/items/:itemId` | リスト項目削除         |

## 11. Shared Files（3 件）

| Method | Path                                  | 説明                       |
| ------ | ------------------------------------- | -------------------------- |
| GET    | `/projects/:key/files/metadata/:path` | 共有ファイル一覧           |
| GET    | `/projects/:key/files/:sharedFileId`  | 共有ファイルダウンロード   |
| GET    | `/projects/:key/diskUsage`            | プロジェクトディスク使用量 |

## 12. Issues（6 件）

| Method | Path                    | 説明           |
| ------ | ----------------------- | -------------- |
| GET    | `/issues`               | 課題一覧       |
| GET    | `/issues/count`         | 課題数カウント |
| POST   | `/issues`               | 課題追加       |
| GET    | `/issues/:issueIdOrKey` | 課題情報       |
| PATCH  | `/issues/:issueIdOrKey` | 課題更新       |
| DELETE | `/issues/:issueIdOrKey` | 課題削除       |

## 13. Issue Comments（8 件）

| Method | Path                                             | 説明               |
| ------ | ------------------------------------------------ | ------------------ |
| GET    | `/issues/:key/comments`                          | コメント一覧       |
| POST   | `/issues/:key/comments`                          | コメント追加       |
| GET    | `/issues/:key/comments/count`                    | コメント数カウント |
| GET    | `/issues/:key/comments/:commentId`               | コメント情報       |
| PATCH  | `/issues/:key/comments/:commentId`               | コメント更新       |
| DELETE | `/issues/:key/comments/:commentId`               | コメント削除       |
| GET    | `/issues/:key/comments/:commentId/notifications` | コメント通知一覧   |
| POST   | `/issues/:key/comments/:commentId/notifications` | コメント通知追加   |

## 14. Issue Attachments（3 件）

| Method | Path                                     | 説明                     |
| ------ | ---------------------------------------- | ------------------------ |
| GET    | `/issues/:key/attachments`               | 添付ファイル一覧         |
| GET    | `/issues/:key/attachments/:attachmentId` | 添付ファイルダウンロード |
| DELETE | `/issues/:key/attachments/:attachmentId` | 添付ファイル削除         |

## 15. Issue Participants（1 件）

| Method | Path                        | 説明       |
| ------ | --------------------------- | ---------- |
| GET    | `/issues/:key/participants` | 参加者一覧 |

## 16. Issue Shared Files（3 件）

| Method | Path                           | 説明                         |
| ------ | ------------------------------ | ---------------------------- |
| GET    | `/issues/:key/sharedFiles`     | リンクされた共有ファイル一覧 |
| POST   | `/issues/:key/sharedFiles`     | 共有ファイルをリンク         |
| DELETE | `/issues/:key/sharedFiles/:id` | 共有ファイルのリンク解除     |

## 17. Priorities & Resolutions（2 件）

| Method | Path           | 説明         |
| ------ | -------------- | ------------ |
| GET    | `/priorities`  | 優先度一覧   |
| GET    | `/resolutions` | 完了理由一覧 |

## 18. Wiki（7 件）

| Method | Path             | 説明                 |
| ------ | ---------------- | -------------------- |
| GET    | `/wikis`         | Wikiページ一覧       |
| GET    | `/wikis/count`   | Wikiページ数カウント |
| GET    | `/wikis/tags`    | Wikiタグ一覧         |
| POST   | `/wikis`         | Wikiページ追加       |
| GET    | `/wikis/:wikiId` | Wikiページ情報       |
| PATCH  | `/wikis/:wikiId` | Wikiページ更新       |
| DELETE | `/wikis/:wikiId` | Wikiページ削除       |

## 19. Wiki Attachments（4 件）

| Method | Path                                       | 説明                         |
| ------ | ------------------------------------------ | ---------------------------- |
| GET    | `/wikis/:wikiId/attachments`               | Wiki添付ファイル一覧         |
| POST   | `/wikis/:wikiId/attachments`               | Wiki添付ファイル追加         |
| GET    | `/wikis/:wikiId/attachments/:attachmentId` | Wiki添付ファイルダウンロード |
| DELETE | `/wikis/:wikiId/attachments/:attachmentId` | Wiki添付ファイル削除         |

## 20. Wiki Shared Files（3 件）

| Method | Path                             | 説明                       |
| ------ | -------------------------------- | -------------------------- |
| GET    | `/wikis/:wikiId/sharedFiles`     | Wiki共有ファイル一覧       |
| POST   | `/wikis/:wikiId/sharedFiles`     | Wiki共有ファイルリンク     |
| DELETE | `/wikis/:wikiId/sharedFiles/:id` | Wiki共有ファイルリンク解除 |

## 21. Wiki History（1 件）

| Method | Path                     | 説明               |
| ------ | ------------------------ | ------------------ |
| GET    | `/wikis/:wikiId/history` | Wikiページ更新履歴 |

## 22. Stars（2 件）

| Method | Path                   | 説明                 |
| ------ | ---------------------- | -------------------- |
| POST   | `/stars`               | スター追加           |
| GET    | `/wikis/:wikiId/stars` | Wikiページスター一覧 |

## 23. Notifications（4 件）

| Method | Path                            | 説明             |
| ------ | ------------------------------- | ---------------- |
| GET    | `/notifications`                | 通知一覧         |
| GET    | `/notifications/count`          | 通知数カウント   |
| POST   | `/notifications/markAsRead`     | 全通知を既読に   |
| POST   | `/notifications/:id/markAsRead` | 特定通知を既読に |

## 24. Git Repositories（2 件）

| Method | Path                                            | 説明              |
| ------ | ----------------------------------------------- | ----------------- |
| GET    | `/projects/:key/git/repositories`               | Gitリポジトリ一覧 |
| GET    | `/projects/:key/git/repositories/:repoIdOrName` | Gitリポジトリ情報 |

## 25. Pull Requests（5 件）

| Method | Path                       | 説明         |
| ------ | -------------------------- | ------------ |
| GET    | `.../pullRequests`         | PR一覧       |
| GET    | `.../pullRequests/count`   | PR数カウント |
| POST   | `.../pullRequests`         | PR追加       |
| GET    | `.../pullRequests/:number` | PR情報       |
| PATCH  | `.../pullRequests/:number` | PR更新       |

> パス: `/projects/:key/git/repositories/:repo/pullRequests`

## 26. Pull Request Comments（4 件）

| Method | Path                                           | 説明           |
| ------ | ---------------------------------------------- | -------------- |
| GET    | `.../pullRequests/:number/comments`            | PRコメント一覧 |
| POST   | `.../pullRequests/:number/comments`            | PRコメント追加 |
| GET    | `.../pullRequests/:number/comments/count`      | PRコメント数   |
| PATCH  | `.../pullRequests/:number/comments/:commentId` | PRコメント更新 |

## 27. Pull Request Attachments（3 件）

| Method | Path                                                 | 説明               |
| ------ | ---------------------------------------------------- | ------------------ |
| GET    | `.../pullRequests/:number/attachments`               | PR添付ファイル一覧 |
| GET    | `.../pullRequests/:number/attachments/:attachmentId` | PR添付ファイルDL   |
| DELETE | `.../pullRequests/:number/attachments/:attachmentId` | PR添付ファイル削除 |

## 28. Watching（7 件）

| Method | Path                                | 説明               |
| ------ | ----------------------------------- | ------------------ |
| GET    | `/users/:userId/watchings`          | ウォッチ一覧       |
| GET    | `/watchings/count`                  | ウォッチ数カウント |
| GET    | `/watchings/:watchingId`            | ウォッチ情報       |
| POST   | `/watchings`                        | ウォッチ追加       |
| PATCH  | `/watchings/:watchingId`            | ウォッチ更新       |
| DELETE | `/watchings/:watchingId`            | ウォッチ削除       |
| POST   | `/watchings/:watchingId/markAsRead` | ウォッチ既読       |

## 29. Webhooks（5 件）

| Method | Path                                 | 説明        |
| ------ | ------------------------------------ | ----------- |
| GET    | `/projects/:key/webhooks`            | Webhook一覧 |
| POST   | `/projects/:key/webhooks`            | Webhook追加 |
| GET    | `/projects/:key/webhooks/:webhookId` | Webhook情報 |
| PATCH  | `/projects/:key/webhooks/:webhookId` | Webhook更新 |
| DELETE | `/projects/:key/webhooks/:webhookId` | Webhook削除 |

## 30. Recently Viewed（3 件）

| Method | Path                                   | 説明                     |
| ------ | -------------------------------------- | ------------------------ |
| GET    | `/users/myself/recentlyViewedIssues`   | 最近閲覧した課題         |
| GET    | `/users/myself/recentlyViewedProjects` | 最近閲覧したプロジェクト |
| GET    | `/users/myself/recentlyViewedWikis`    | 最近閲覧したWiki         |

## 31. Licence & Rate Limiting（2 件）

| Method | Path             | 説明           |
| ------ | ---------------- | -------------- |
| GET    | `/space/licence` | ライセンス情報 |
| GET    | `/rateLimit`     | レートリミット |

---

## 合計: 約 140 エンドポイント

| カテゴリ               | 件数 |
| ---------------------- | ---- |
| Space                  | 7    |
| Users                  | 10   |
| Teams                  | 11   |
| Projects               | 10   |
| Project Admin          | 3    |
| Statuses               | 5    |
| Issue Types            | 4    |
| Categories             | 4    |
| Versions/Milestones    | 4    |
| Custom Fields          | 7    |
| Shared Files           | 3    |
| Issues                 | 6    |
| Issue Comments         | 8    |
| Issue Attachments      | 3    |
| Issue Participants     | 1    |
| Issue Shared Files     | 3    |
| Priorities/Resolutions | 2    |
| Wiki                   | 7    |
| Wiki Attachments       | 4    |
| Wiki Shared Files      | 3    |
| Wiki History           | 1    |
| Stars                  | 2    |
| Notifications          | 4    |
| Git Repositories       | 2    |
| Pull Requests          | 5    |
| PR Comments            | 4    |
| PR Attachments         | 3    |
| Watching               | 7    |
| Webhooks               | 5    |
| Recently Viewed        | 3    |
| Licence/Rate Limit     | 2    |

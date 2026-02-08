# データモデル（スキーマ型参照）

`--json` 出力や `backlog api` レスポンスで返されるデータ構造。

## Issue（課題）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | 課題ID |
| `projectId` | number | プロジェクトID |
| `issueKey` | string | 課題キー（例: `PROJ-123`） |
| `keyId` | number | 課題番号 |
| `issueType` | IssueType | 課題種別 |
| `summary` | string | タイトル |
| `description` | string | 説明 |
| `priority` | Priority | 優先度 |
| `status` | Status | ステータス |
| `assignee` | User \| null | 担当者 |
| `category` | {id, name}[] | カテゴリ |
| `versions` | {id, name}[] | 発生バージョン |
| `milestone` | {id, name}[] | マイルストーン |
| `startDate` | string \| null | 開始日 |
| `dueDate` | string \| null | 期限日 |
| `estimatedHours` | number \| null | 予定時間 |
| `actualHours` | number \| null | 実績時間 |
| `parentIssueId` | number \| null | 親課題ID |
| `createdUser` | User | 作成者 |
| `created` | string | 作成日時 |
| `updatedUser` | User | 更新者 |
| `updated` | string | 更新日時 |

## PullRequest

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | PR ID |
| `projectId` | number | プロジェクトID |
| `repositoryId` | number | リポジトリID |
| `number` | number | PR番号 |
| `summary` | string | タイトル |
| `description` | string | 説明 |
| `base` | string | ベースブランチ |
| `branch` | string | ソースブランチ |
| `status` | {id, name} | ステータス（1: Open, 2: Closed, 3: Merged） |
| `assignee` | User \| null | 担当者 |
| `issue` | Issue \| null | 関連課題 |
| `baseCommit` | string \| null | ベースコミットSHA |
| `branchCommit` | string \| null | ブランチコミットSHA |
| `mergeCommit` | string \| null | マージコミットSHA |
| `closeAt` | string \| null | クローズ日時 |
| `mergeAt` | string \| null | マージ日時 |
| `createdUser` | User | 作成者 |
| `created` | string | 作成日時 |
| `updatedUser` | User | 更新者 |
| `updated` | string | 更新日時 |

## Project

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | プロジェクトID |
| `projectKey` | string | プロジェクトキー |
| `name` | string | プロジェクト名 |
| `chartEnabled` | boolean | チャート有効 |
| `subtaskingEnabled` | boolean | サブタスク有効 |
| `textFormattingRule` | `"backlog"` \| `"markdown"` | テキスト書式 |
| `archived` | boolean | アーカイブ済み |

## User

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | ユーザーID |
| `userId` | string | ログインID |
| `name` | string | 表示名 |
| `roleType` | number | 権限（1: Admin, 2: 一般, 3: レポーター, 4: ビューアー, 5: ゲストレポーター, 6: ゲストビューアー） |
| `lang` | string \| null | 言語 |
| `mailAddress` | string | メールアドレス |

## Comment

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | コメントID |
| `content` | string | 本文 |
| `changeLog` | ChangeLog[] | 変更履歴 |
| `createdUser` | User | 作成者 |
| `created` | string | 作成日時 |
| `updated` | string | 更新日時 |

## Status

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | ステータスID |
| `projectId` | number | プロジェクトID |
| `name` | string | ステータス名 |
| `color` | string | 表示色 |
| `displayOrder` | number | 表示順 |

## IssueType（課題種別）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | 種別ID |
| `projectId` | number | プロジェクトID |
| `name` | string | 種別名 |
| `color` | string | 表示色 |
| `displayOrder` | number | 表示順 |

## Priority（優先度）

| フィールド | 型 |
|-----------|-----|
| `id` | number |
| `name` | string |

標準値: `高`, `中`, `低`

## Wiki

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | ページID |
| `projectId` | number | プロジェクトID |
| `name` | string | ページ名 |
| `content` | string | 本文 |
| `tags` | {id, name}[] | タグ |
| `attachments` | Attachment[] | 添付ファイル |
| `createdUser` | User | 作成者 |
| `created` | string | 作成日時 |
| `updatedUser` | User | 更新者 |
| `updated` | string | 更新日時 |

## Milestone

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | マイルストーンID |
| `projectId` | number | プロジェクトID |
| `name` | string | 名前 |
| `description` | string | 説明 |
| `startDate` | string \| null | 開始日 |
| `releaseDueDate` | string \| null | リリース期限日 |
| `archived` | boolean | アーカイブ済み |

## Notification

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | 通知ID |
| `alreadyRead` | boolean | 既読 |
| `reason` | number | 通知理由 |
| `project` | Project | プロジェクト |
| `issue` | Issue? | 関連課題 |
| `comment` | Comment? | 関連コメント |
| `pullRequest` | PullRequest? | 関連PR |
| `sender` | User | 送信者 |
| `created` | string | 作成日時 |

## Repository

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | リポジトリID |
| `projectId` | number | プロジェクトID |
| `name` | string | リポジトリ名 |
| `description` | string \| null | 説明 |
| `httpUrl` | string | HTTP URL |
| `sshUrl` | string | SSH URL |
| `pushedAt` | string \| null | 最終プッシュ日時 |

## Category

| フィールド | 型 |
|-----------|-----|
| `id` | number |
| `name` | string |
| `displayOrder` | number |

## Team

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | チームID |
| `name` | string | チーム名 |
| `members` | User[] | メンバー |
| `createdUser` | User | 作成者 |
| `created` | string | 作成日時 |

## Webhook

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | Webhook ID |
| `name` | string | 名前 |
| `hookUrl` | string | 通知URL |
| `allEvent` | boolean | 全イベント対象 |
| `activityTypeIds` | number[] | アクティビティタイプID |

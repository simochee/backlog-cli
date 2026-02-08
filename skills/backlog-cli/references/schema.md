# Data Model Schema

Structures returned by `--json` output and `backlog api` responses.

## Issue

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Issue ID |
| `projectId` | number | Project ID |
| `issueKey` | string | Issue key (e.g., `PROJ-123`) |
| `keyId` | number | Issue number |
| `issueType` | IssueType | Issue type |
| `summary` | string | Title |
| `description` | string | Description |
| `priority` | Priority | Priority |
| `status` | Status | Status |
| `assignee` | User \| null | Assignee |
| `category` | {id, name}[] | Categories |
| `versions` | {id, name}[] | Affected versions |
| `milestone` | {id, name}[] | Milestones |
| `startDate` | string \| null | Start date |
| `dueDate` | string \| null | Due date |
| `estimatedHours` | number \| null | Estimated hours |
| `actualHours` | number \| null | Actual hours |
| `parentIssueId` | number \| null | Parent issue ID |
| `createdUser` | User | Creator |
| `created` | string | Created at |
| `updatedUser` | User | Last updater |
| `updated` | string | Updated at |

## PullRequest

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | PR ID |
| `projectId` | number | Project ID |
| `repositoryId` | number | Repository ID |
| `number` | number | PR number |
| `summary` | string | Title |
| `description` | string | Description |
| `base` | string | Base branch |
| `branch` | string | Source branch |
| `status` | {id, name} | Status (1: Open, 2: Closed, 3: Merged) |
| `assignee` | User \| null | Assignee |
| `issue` | Issue \| null | Related issue |
| `baseCommit` | string \| null | Base commit SHA |
| `branchCommit` | string \| null | Branch commit SHA |
| `mergeCommit` | string \| null | Merge commit SHA |
| `closeAt` | string \| null | Closed at |
| `mergeAt` | string \| null | Merged at |
| `createdUser` | User | Creator |
| `created` | string | Created at |
| `updatedUser` | User | Last updater |
| `updated` | string | Updated at |

## Project

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Project ID |
| `projectKey` | string | Project key |
| `name` | string | Project name |
| `chartEnabled` | boolean | Chart enabled |
| `subtaskingEnabled` | boolean | Subtasking enabled |
| `textFormattingRule` | `"backlog"` \| `"markdown"` | Text formatting |
| `archived` | boolean | Archived |

## User

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | User ID |
| `userId` | string | Login ID |
| `name` | string | Display name |
| `roleType` | number | Role (1: Admin, 2: Normal, 3: Reporter, 4: Viewer, 5: Guest Reporter, 6: Guest Viewer) |
| `lang` | string \| null | Language |
| `mailAddress` | string | Email |

## Comment

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Comment ID |
| `content` | string | Body |
| `changeLog` | ChangeLog[] | Change history |
| `createdUser` | User | Author |
| `created` | string | Created at |
| `updated` | string | Updated at |

## Status

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Status ID |
| `projectId` | number | Project ID |
| `name` | string | Status name |
| `color` | string | Display color |
| `displayOrder` | number | Display order |

## IssueType

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Issue type ID |
| `projectId` | number | Project ID |
| `name` | string | Type name |
| `color` | string | Display color |
| `displayOrder` | number | Display order |

## Priority

| Field | Type |
|-------|------|
| `id` | number |
| `name` | string |

Built-in values: `高` (High), `中` (Normal), `低` (Low)

## Wiki

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Page ID |
| `projectId` | number | Project ID |
| `name` | string | Page name |
| `content` | string | Body |
| `tags` | {id, name}[] | Tags |
| `attachments` | Attachment[] | Attachments |
| `createdUser` | User | Creator |
| `created` | string | Created at |
| `updatedUser` | User | Last updater |
| `updated` | string | Updated at |

## Milestone

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Milestone ID |
| `projectId` | number | Project ID |
| `name` | string | Name |
| `description` | string | Description |
| `startDate` | string \| null | Start date |
| `releaseDueDate` | string \| null | Release due date |
| `archived` | boolean | Archived |

## Notification

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Notification ID |
| `alreadyRead` | boolean | Read |
| `reason` | number | Reason code |
| `project` | Project | Project |
| `issue` | Issue? | Related issue |
| `comment` | Comment? | Related comment |
| `pullRequest` | PullRequest? | Related PR |
| `sender` | User | Sender |
| `created` | string | Created at |

## Repository

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Repository ID |
| `projectId` | number | Project ID |
| `name` | string | Repository name |
| `description` | string \| null | Description |
| `httpUrl` | string | HTTP URL |
| `sshUrl` | string | SSH URL |
| `pushedAt` | string \| null | Last pushed at |

## Category

| Field | Type |
|-------|------|
| `id` | number |
| `name` | string |
| `displayOrder` | number |

## Team

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Team ID |
| `name` | string | Team name |
| `members` | User[] | Members |
| `createdUser` | User | Creator |
| `created` | string | Created at |

## Webhook

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Webhook ID |
| `name` | string | Name |
| `hookUrl` | string | Notification URL |
| `allEvent` | boolean | All events targeted |
| `activityTypeIds` | number[] | Activity type IDs |

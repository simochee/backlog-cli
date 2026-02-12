# Data Model Schema

Structures returned by `--json` output and `backlog api` responses.

> **Note:** This schema is written in TypeScript-compatible type notation for clarity and ease of understanding. While the syntax is TypeScript, it serves as a language-agnostic representation of the data structures. Non-TypeScript users can interpret this as pseudo-code describing the shape of JSON objects.

## Issue

```typescript
type Issue = {
  id: number;                    // Issue ID
  projectId: number;             // Project ID
  issueKey: string;              // Issue key (e.g., "PROJ-123")
  keyId: number;                 // Issue number
  issueType: IssueType;          // Issue type
  summary: string;               // Title
  description: string;           // Description
  priority: Priority;            // Priority
  status: Status;                // Status
  assignee: User | null;         // Assignee
  category: Array<{id: number; name: string}>;   // Categories
  versions: Array<{id: number; name: string}>;   // Affected versions
  milestone: Array<{id: number; name: string}>;  // Milestones
  startDate: string | null;      // Start date (yyyy-MM-dd)
  dueDate: string | null;        // Due date (yyyy-MM-dd)
  estimatedHours: number | null; // Estimated hours
  actualHours: number | null;    // Actual hours
  parentIssueId: number | null;  // Parent issue ID
  createdUser: User;             // Creator
  created: string;               // Created at (ISO 8601)
  updatedUser: User;             // Last updater
  updated: string;               // Updated at (ISO 8601)
};
```

## PullRequest

```typescript
type PullRequest = {
  id: number;                    // PR ID
  projectId: number;             // Project ID
  repositoryId: number;          // Repository ID
  number: number;                // PR number
  summary: string;               // Title
  description: string;           // Description
  base: string;                  // Base branch
  branch: string;                // Source branch
  status: {                      // Status (1: Open, 2: Closed, 3: Merged)
    id: number;
    name: string;
  };
  assignee: User | null;         // Assignee
  issue: Issue | null;           // Related issue
  baseCommit: string | null;     // Base commit SHA
  branchCommit: string | null;   // Branch commit SHA
  mergeCommit: string | null;    // Merge commit SHA
  closeAt: string | null;        // Closed at (ISO 8601)
  mergeAt: string | null;        // Merged at (ISO 8601)
  createdUser: User;             // Creator
  created: string;               // Created at (ISO 8601)
  updatedUser: User;             // Last updater
  updated: string;               // Updated at (ISO 8601)
};
```

## Project

```typescript
type Project = {
  id: number;                    // Project ID
  projectKey: string;            // Project key
  name: string;                  // Project name
  chartEnabled: boolean;         // Chart enabled
  subtaskingEnabled: boolean;    // Subtasking enabled
  textFormattingRule: "backlog" | "markdown";  // Text formatting
  archived: boolean;             // Archived
};
```

## User

```typescript
type User = {
  id: number;                    // User ID
  userId: string;                // Login ID
  name: string;                  // Display name
  roleType: number;              // Role (1: Admin, 2: Normal, 3: Reporter, 4: Viewer, 5: Guest Reporter, 6: Guest Viewer)
  lang: string | null;           // Language
  mailAddress: string;           // Email
};
```

## Comment

```typescript
type Comment = {
  id: number;                    // Comment ID
  content: string;               // Body
  changeLog: ChangeLog[];        // Change history
  createdUser: User;             // Author
  created: string;               // Created at (ISO 8601)
  updated: string;               // Updated at (ISO 8601)
};
```

## Status

```typescript
type Status = {
  id: number;                    // Status ID
  projectId: number;             // Project ID
  name: string;                  // Status name
  color: string;                 // Display color (hex code)
  displayOrder: number;          // Display order
};
```

## IssueType

```typescript
type IssueType = {
  id: number;                    // Issue type ID
  projectId: number;             // Project ID
  name: string;                  // Type name
  color: string;                 // Display color (hex code)
  displayOrder: number;          // Display order
};
```

## Priority

```typescript
type Priority = {
  id: number;
  name: string;                  // Built-in values: "高" (High), "中" (Normal), "低" (Low)
};
```

## Wiki

```typescript
type Wiki = {
  id: number;                    // Page ID
  projectId: number;             // Project ID
  name: string;                  // Page name
  content: string;               // Body
  tags: Array<{id: number; name: string}>;  // Tags
  attachments: Attachment[];     // Attachments
  createdUser: User;             // Creator
  created: string;               // Created at (ISO 8601)
  updatedUser: User;             // Last updater
  updated: string;               // Updated at (ISO 8601)
};
```

## Document

```typescript
// Lightweight response (from create/delete)
type Document = {
  id: string;                    // Document ID
  projectId: number;             // Project ID
  title: string;                 // Title
  json: unknown | null;          // Structured content
  plain: string | null;          // Plain text content
  statusId: number;              // Status ID
  emoji: string;                 // Emoji
  createdUserId: number;         // Creator user ID
  created: string;               // Created at (ISO 8601)
  updatedUserId: number;         // Last updater user ID
  updated: string;               // Updated at (ISO 8601)
};

// Full response (from list/get)
type DocumentDetail = {
  id: string;                    // Document ID
  projectId: number;             // Project ID
  title: string;                 // Title
  json: unknown | null;          // Structured content
  plain: string | null;          // Plain text content
  statusId: number;              // Status ID
  emoji: string;                 // Emoji
  attachments: Attachment[];     // Attachments
  tags: Array<{id: number; name: string}>;  // Tags
  createdUser: User;             // Creator
  created: string;               // Created at (ISO 8601)
  updatedUser: User;             // Last updater
  updated: string;               // Updated at (ISO 8601)
};
```

## DocumentTree

```typescript
type DocumentTree = {
  projectId: number;
  activeTree: { id: string; children: DocumentTreeNode[] };
  trashTree: { id: string; children: DocumentTreeNode[] };
};

type DocumentTreeNode = {
  id: string;                    // Document ID
  name: string;                  // Document title
  emoji: string;                 // Emoji
  children: DocumentTreeNode[];  // Nested children
};
```

## Milestone

```typescript
type Milestone = {
  id: number;                    // Milestone ID
  projectId: number;             // Project ID
  name: string;                  // Name
  description: string;           // Description
  startDate: string | null;      // Start date (yyyy-MM-dd)
  releaseDueDate: string | null; // Release due date (yyyy-MM-dd)
  archived: boolean;             // Archived
};
```

## Notification

```typescript
type Notification = {
  id: number;                    // Notification ID
  alreadyRead: boolean;          // Read
  reason: number;                // Reason code
  project: Project;              // Project
  issue?: Issue;                 // Related issue
  comment?: Comment;             // Related comment
  pullRequest?: PullRequest;     // Related PR
  sender: User;                  // Sender
  created: string;               // Created at (ISO 8601)
};
```

## Repository

```typescript
type Repository = {
  id: number;                    // Repository ID
  projectId: number;             // Project ID
  name: string;                  // Repository name
  description: string | null;    // Description
  httpUrl: string;               // HTTP URL
  sshUrl: string;                // SSH URL
  pushedAt: string | null;       // Last pushed at (ISO 8601)
};
```

## Category

```typescript
type Category = {
  id: number;
  name: string;
  displayOrder: number;
};
```

## Team

```typescript
type Team = {
  id: number;                    // Team ID
  name: string;                  // Team name
  members: User[];               // Members
  createdUser: User;             // Creator
  created: string;               // Created at (ISO 8601)
};
```

## Webhook

```typescript
type Webhook = {
  id: number;                    // Webhook ID
  name: string;                  // Name
  hookUrl: string;               // Notification URL
  allEvent: boolean;             // All events targeted
  activityTypeIds: number[];     // Activity type IDs
};
```

## ChangeLog

```typescript
type ChangeLog = {
  field: string;                 // Changed field name
  originalValue: string | null;  // Old value
  newValue: string | null;       // New value
};
```

## Attachment

```typescript
type Attachment = {
  id: number;                    // Attachment ID
  name: string;                  // File name
  size: number;                  // File size (bytes)
  createdUser: User;             // Uploader
  created: string;               // Created at (ISO 8601)
};
```

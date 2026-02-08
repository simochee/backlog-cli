using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Git repository. */
model GitRepository {
  id: int64;
  projectId: int64;
  name: string;
  description: string;
  hookUrl: string | null;
  httpUrl: string;
  sshUrl: string;
  displayOrder: int32;
  pushedAt: utcDateTime | null;
  createdUser: User;
  created: utcDateTime;
  updatedUser: User;
  updated: utcDateTime;
}

/** Pull request status. */
model PullRequestStatus {
  id: int64;
  name: string;
}

/** Pull request. */
model PullRequest {
  id: int64;
  projectId: int64;
  repositoryId: int64;
  number: int64;
  summary: string;
  description: string;
  base: string;
  branch: string;
  status: PullRequestStatus;
  assignee: User | null;
  issue: Issue | null;
  baseCommit: string | null;
  branchCommit: string | null;
  mergeCommit: string | null;
  closeAt: utcDateTime | null;
  mergeAt: utcDateTime | null;
  createdUser: User;
  created: utcDateTime;
  updatedUser: User;
  updated: utcDateTime;
  attachments: AttachmentInfo[];
  stars: Star[];
}

/** Pull request comment. */
model PullRequestComment {
  id: int64;
  content: string;
  changeLog: ChangeLog[];
  createdUser: User;
  created: utcDateTime;
  updated: utcDateTime;
  stars: Star[];
  notifications: CommentNotification[];
}

/** Sort field for pull request list. */
enum PullRequestSortField {
  created,
  updated,
}

/** Pull request status filter. */
enum PullRequestStatusType {
  Open: 1,
  Closed: 2,
  Merged: 3,
}

// ────────────────────────────────────────────
// Git Repository Operations
// ────────────────────────────────────────────

@route("/projects/{projectIdOrKey}/git/repositories")
@tag("Git Repositories")
interface GitRepositories {
  /** Get list of Git repositories in a project. */
  @get op list(@path projectIdOrKey: string): GitRepository[] | BacklogErrorResponse;

  /** Get a Git repository. */
  @get
  @route("/{repoIdOrName}")
  op get(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
  ): GitRepository | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Pull Request Operations
// ────────────────────────────────────────────

@route("/projects/{projectIdOrKey}/git/repositories/{repoIdOrName}/pullRequests")
@tag("Pull Requests")
interface PullRequests {
  /** Get list of pull requests. */
  @get op list(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @query("statusId[]") statusId?: PullRequestStatusType[],
    @query assigneeId?: int64,
    @query issueId?: int64,
    @query createdUserId?: int64,
    @query offset?: int32,
    @query
    @minValue(1)
    @maxValue(100)
    count?: int32 = 20,
  ): PullRequest[] | BacklogErrorResponse;

  /** Get count of pull requests. */
  @get
  @route("/count")
  op count(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @query("statusId[]") statusId?: PullRequestStatusType[],
    @query assigneeId?: int64,
    @query issueId?: int64,
    @query createdUserId?: int64,
  ): {
    count: int32;
  } | BacklogErrorResponse;

  /** Create a pull request. */
  @post op create(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      summary: string;
      description: string;
      base: string;
      branch: string;
      issueId?: int64;
      assigneeId?: int64;
      @encodedName("application/x-www-form-urlencoded", "notifiedUserId[]")
      notifiedUserId?: int64[];
      @encodedName("application/x-www-form-urlencoded", "attachmentId[]")
      attachmentId?: int64[];
    },
  ): {
    @statusCode statusCode: 201;
    @body pullRequest: PullRequest;
  } | BacklogErrorResponse;

  /** Get a pull request. */
  @get
  @route("/{number}")
  op get(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @path number: int64,
  ): PullRequest | BacklogErrorResponse;

  /** Update a pull request. */
  @patch(#{implicitOptionality: false})
  @route("/{number}")
  op update(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @path number: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      summary?: string;
      description?: string;
      issueId?: int64;
      assigneeId?: int64;
      @encodedName("application/x-www-form-urlencoded", "notifiedUserId[]")
      notifiedUserId?: int64[];
      comment?: string;
    },
  ): PullRequest | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Pull Request Comment Operations
// ────────────────────────────────────────────

@route("/projects/{projectIdOrKey}/git/repositories/{repoIdOrName}/pullRequests/{number}/comments")
@tag("Pull Request Comments")
interface PullRequestComments {
  /** Get list of comments on a pull request. */
  @get op list(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @path number: int64,
    ...PaginationQuery,
    @query minId?: int64,
    @query maxId?: int64,
  ): PullRequestComment[] | BacklogErrorResponse;

  /** Add a comment to a pull request. */
  @post op create(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @path number: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      content: string;
      @encodedName("application/x-www-form-urlencoded", "notifiedUserId[]")
      notifiedUserId?: int64[];
      @encodedName("application/x-www-form-urlencoded", "attachmentId[]")
      attachmentId?: int64[];
    },
  ): {
    @statusCode statusCode: 201;
    @body comment: PullRequestComment;
  } | BacklogErrorResponse;

  /** Get count of comments on a pull request. */
  @get
  @route("/count")
  op count(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @path number: int64,
  ): {
    count: int32;
  } | BacklogErrorResponse;

  /** Update a pull request comment. */
  @patch(#{implicitOptionality: false})
  @route("/{commentId}")
  op update(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @path number: int64,
    @path commentId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      content: string;
    },
  ): PullRequestComment | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Pull Request Attachment Operations
// ────────────────────────────────────────────

@route("/projects/{projectIdOrKey}/git/repositories/{repoIdOrName}/pullRequests/{number}/attachments")
@tag("Pull Request Attachments")
interface PullRequestAttachments {
  /** Get list of attachments on a pull request. */
  @get op list(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @path number: int64,
  ): AttachmentInfo[] | BacklogErrorResponse;

  /** Download a pull request attachment. */
  @get
  @route("/{attachmentId}")
  op download(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @path number: int64,
    @path attachmentId: int64,
  ): {
    @header contentType: "application/octet-stream";
    @body file: bytes;
  } | BacklogErrorResponse;

  /** Delete a pull request attachment. */
  @delete
  @route("/{attachmentId}")
  op delete(
    @path projectIdOrKey: string,
    @path repoIdOrName: string,
    @path number: int64,
    @path attachmentId: int64,
  ): AttachmentInfo | BacklogErrorResponse;
}

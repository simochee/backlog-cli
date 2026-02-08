using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/**
 * Notification reason code.
 * - 1: Assigned
 * - 2: Commented
 * - 3: Issue Created
 * - 4: Issue Updated
 * - 5: File Attached
 * - 6: User Added to Project
 * - 9: Other
 * - 10: Pull Request Assigned
 * - 11: Pull Request Commented
 * - 12: Pull Request Added
 * - 13: Pull Request Updated
 */
model Notification {
  id: int64;
  alreadyRead: boolean;
  reason: int32;
  resourceAlreadyRead: boolean;
  project: Project;
  issue: Issue | null;
  comment: Comment | null;
  pullRequest: PullRequest | null;
  pullRequestComment: PullRequestComment | null;
  sender: User;
  created: utcDateTime;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/notifications")
@tag("Notifications")
interface Notifications {
  /** Get list of notifications. */
  @get op list(
    @query minId?: int64,
    @query maxId?: int64,
    @query
    @minValue(1)
    @maxValue(100)
    count?: int32 = 20,
    @query order?: Order,
    @query resourceAlreadyRead?: boolean,
  ): Notification[] | BacklogErrorResponse;

  /** Get count of unread notifications. */
  @get
  @route("/count")
  op count(
    @query alreadyRead?: boolean,
    @query resourceAlreadyRead?: boolean,
  ): {
    count: int32;
  } | BacklogErrorResponse;

  /** Mark all notifications as read. */
  @post
  @route("/markAsRead")
  op markAllAsRead(): {
    count: int32;
  } | BacklogErrorResponse;

  /** Mark a specific notification as read. */
  @post
  @route("/{notificationId}/markAsRead")
  op markAsRead(@path notificationId: int64): void | BacklogErrorResponse;
}

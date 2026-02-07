using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Notification attached to a comment. */
model CommentNotification {
  id: int64;
  alreadyRead: boolean;
  reason: int32;
  user: User;
  resourceAlreadyRead: boolean;
}

/** Issue comment. */
model Comment {
  id: int64;
  content: string;
  changeLog: ChangeLog[];
  createdUser: User;
  created: utcDateTime;
  updated: utcDateTime;
  stars: Star[];
  notifications: CommentNotification[];
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/issues/{issueIdOrKey}/comments")
@tag("Issue Comments")
interface IssueComments {
  /** Get list of comments on an issue. */
  @get op list(
    @path issueIdOrKey: string,
    ...PaginationQuery,
    @query minId?: int64,
    @query maxId?: int64,
  ): Comment[] | BacklogErrorResponse;

  /** Add a comment to an issue. */
  @post op create(
    @path issueIdOrKey: string,
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
    @body comment: Comment;
  } | BacklogErrorResponse;

  /** Get count of comments on an issue. */
  @get
  @route("/count")
  op count(@path issueIdOrKey: string): {
    count: int32;
  } | BacklogErrorResponse;

  /** Get a specific comment. */
  @get
  @route("/{commentId}")
  op get(
    @path issueIdOrKey: string,
    @path commentId: int64,
  ): Comment | BacklogErrorResponse;

  /** Update a comment. */
  @patch(#{implicitOptionality: false})
  @route("/{commentId}")
  op update(
    @path issueIdOrKey: string,
    @path commentId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      content: string;
    },
  ): Comment | BacklogErrorResponse;

  /** Delete a comment. */
  @delete
  @route("/{commentId}")
  op delete(
    @path issueIdOrKey: string,
    @path commentId: int64,
  ): Comment | BacklogErrorResponse;

  /** Get list of notifications for a comment. */
  @get
  @route("/{commentId}/notifications")
  op getNotifications(
    @path issueIdOrKey: string,
    @path commentId: int64,
  ): CommentNotification[] | BacklogErrorResponse;

  /** Add notifications to a comment. */
  @post
  @route("/{commentId}/notifications")
  op addNotification(
    @path issueIdOrKey: string,
    @path commentId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      @encodedName("application/x-www-form-urlencoded", "notifiedUserId[]")
      notifiedUserId: int64[];
    },
  ): Comment | BacklogErrorResponse;
}

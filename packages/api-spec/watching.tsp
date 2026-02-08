using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Watching entry. */
model Watching {
  id: int64;
  resourceAlreadyRead: boolean;
  note: string;
  type: string;
  issue: Issue;
  lastContentUpdated: utcDateTime | null;
  created: utcDateTime;
  updated: utcDateTime;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@tag("Watching")
interface WatchingOps {
  /** Get list of watchings for a user. */
  @get
  @route("/users/{userId}/watchings")
  op listByUser(
    @path userId: int64,
    ...PaginationQuery,
    @query("resourceAlreadyRead") resourceAlreadyRead?: boolean,
    @query sort?: "created" | "updated" | "issueUpdated",
  ): Watching[] | BacklogErrorResponse;

  /** Get count of watchings. */
  @get
  @route("/watchings/count")
  op count(
    @query alreadyRead?: boolean,
    @query resourceAlreadyRead?: boolean,
  ): {
    count: int32;
  } | BacklogErrorResponse;

  /** Get a watching. */
  @get
  @route("/watchings/{watchingId}")
  op get(@path watchingId: int64): Watching | BacklogErrorResponse;

  /** Add a watching. */
  @post
  @route("/watchings")
  op create(
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      issueIdOrKey: string;
      note?: string;
    },
  ): {
    @statusCode statusCode: 201;
    @body watching: Watching;
  } | BacklogErrorResponse;

  /** Update a watching. */
  @patch(#{implicitOptionality: false})
  @route("/watchings/{watchingId}")
  op update(
    @path watchingId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      note?: string;
    },
  ): Watching | BacklogErrorResponse;

  /** Delete a watching. */
  @delete
  @route("/watchings/{watchingId}")
  op delete(@path watchingId: int64): Watching | BacklogErrorResponse;

  /** Mark a watching as read. */
  @post
  @route("/watchings/{watchingId}/markAsRead")
  op markAsRead(@path watchingId: int64): void | BacklogErrorResponse;
}

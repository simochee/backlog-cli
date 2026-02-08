using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Error models
// ────────────────────────────────────────────

/** Individual error detail returned by the Backlog API. */
model BacklogErrorDetail {
  /** Error message. */
  message: string;

  /**
   * Error code.
   * - 1: InternalError
   * - 2: LicenceError
   * - 3: LicenceExpiredError
   * - 4: AccessDeniedError
   * - 5: UnauthorizedOperationError
   * - 6: NoResourceError
   * - 7: InvalidRequestError
   * - 8: SpaceOverCapacityError
   * - 9: ResourceOverflowError
   * - 10: TooLargeFileError
   * - 11: AuthenticationError
   * - 12: RequiredMFAError
   * - 13: TooManyRequestsError
   */
  code: int32;

  /** Additional information about the error. */
  moreInfo: string;
}

/** Error response wrapper returned by all Backlog API error responses. */
@error
model BacklogErrorResponse {
  errors: BacklogErrorDetail[];
}

// ────────────────────────────────────────────
// Pagination
// ────────────────────────────────────────────

/** Sort order direction. */
enum Order {
  asc,
  desc,
}

/** Common pagination query parameters used by list endpoints. */
model PaginationQuery {
  /** Number of records to return (1–100, default: 20). */
  @query
  @minValue(1)
  @maxValue(100)
  count?: int32 = 20;

  /** Number of records to skip. */
  @query
  @minValue(0)
  offset?: int32;

  /** Sort order. */
  @query
  order?: Order;
}

/** Pagination query parameters using minId/maxId instead of offset. */
model ActivityPaginationQuery {
  /** Minimum activity ID (exclusive). */
  @query minId?: int64;

  /** Maximum activity ID (exclusive). */
  @query maxId?: int64;

  /** Number of records to return (1–100, default: 20). */
  @query
  @minValue(1)
  @maxValue(100)
  count?: int32 = 20;

  /** Sort order. */
  @query
  order?: Order;
}

// ────────────────────────────────────────────
// Shared enums
// ────────────────────────────────────────────

/** Text formatting rule for spaces and projects. */
enum TextFormattingRule {
  backlog,
  markdown,
}

/**
 * User role type.
 * - 1: Administrator
 * - 2: Normal User
 * - 3: Reporter
 * - 4: Viewer
 * - 5: Guest Reporter
 * - 6: Guest Viewer
 */
enum UserRoleType {
  Administrator: 1,
  NormalUser: 2,
  Reporter: 3,
  Viewer: 4,
  GuestReporter: 5,
  GuestViewer: 6,
}

// ────────────────────────────────────────────
// Shared models
// ────────────────────────────────────────────

/** Nulab account information. */
model NulabAccount {
  nulabId: string;
  name: string;
  uniqueId: string;
}

/** Lightweight ID + name reference. */
model IdName {
  id: int64;
  name: string;
}

/** Star object. */
model Star {
  id: int64;
  comment: string | null;
  url: string;
  title: string;
  presenter: User;
  created: utcDateTime;
}

/** Change log entry in a comment. */
model ChangeLog {
  field: string;
  newValue: string | null;
  originalValue: string | null;
  attachmentInfo: {
    id: int64;
    name: string;
  } | null;
  attributeInfo: {
    id: int64;
    typeId: string;
  } | null;
  notificationInfo: {
    type: string;
  } | null;
}

/** Attachment summary (used in various list responses). */
model AttachmentInfo {
  id: int64;
  name: string;
  size: int64;
}

/** Shared file information. */
model SharedFile {
  id: int64;
  type: string;
  dir: string;
  name: string;
  size: int64;
  createdUser: User;
  created: utcDateTime;
  updatedUser: User;
  updated: utcDateTime;
}

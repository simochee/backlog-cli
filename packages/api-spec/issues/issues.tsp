using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Resolution for an issue. */
model Resolution {
  id: int64;
  name: string;
}

/** Backlog issue. */
model Issue {
  id: int64;
  projectId: int64;
  issueKey: string;
  keyId: int64;
  issueType: IssueType;
  summary: string;
  description: string;
  resolution: Resolution | null;
  priority: Priority;
  status: Status;
  assignee: User | null;
  category: Category[];
  versions: Version[];
  milestone: Version[];
  startDate: utcDateTime | null;
  dueDate: utcDateTime | null;
  estimatedHours: float64 | null;
  actualHours: float64 | null;
  parentIssueId: int64 | null;
  createdUser: User;
  created: utcDateTime;
  updatedUser: User;
  updated: utcDateTime;
  customFields: CustomFieldValue[];
  attachments: AttachmentInfo[];
  sharedFiles: SharedFile[];
  stars: Star[];
}

/** Custom field value as returned in an issue. */
model CustomFieldValue {
  id: int64;
  fieldTypeId: CustomFieldType;
  name: string;
  value: unknown;
}

/** Sort field for issue list. */
enum IssueSortField {
  issueType,
  category,
  version,
  milestone,
  summary,
  status,
  priority,
  attachment,
  sharedFile,
  created,
  createdUser,
  updated,
  updatedUser,
  assignee,
  startDate,
  dueDate,
  estimatedHours,
  actualHours,
  childIssue,
}

/**
 * Parent/child issue filter.
 * - 0: All
 * - 1: Exclude child issues
 * - 2: Only child issues
 * - 3: Neither parent nor child
 * - 4: Only parent issues
 */
enum ParentChildType {
  All: 0,
  ExcludeChild: 1,
  OnlyChild: 2,
  NeitherParentNorChild: 3,
  OnlyParent: 4,
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/issues")
@tag("Issues")
interface Issues {
  /** Get list of issues. */
  @get op list(
    @query("projectId[]") projectId?: int64[],
    @query("issueTypeId[]") issueTypeId?: int64[],
    @query("categoryId[]") categoryId?: int64[],
    @query("versionId[]") versionId?: int64[],
    @query("milestoneId[]") milestoneId?: int64[],
    @query("statusId[]") statusId?: int64[],
    @query("priorityId[]") priorityId?: int64[],
    @query("assigneeId[]") assigneeId?: int64[],
    @query("createdUserId[]") createdUserId?: int64[],
    @query("resolutionId[]") resolutionId?: int64[],
    @query parentChild?: ParentChildType,
    @query attachment?: boolean,
    @query sharedFile?: boolean,
    @query sort?: IssueSortField,
    @query order?: Order,
    @query
    @minValue(0)
    offset?: int32,
    @query
    @minValue(1)
    @maxValue(100)
    count?: int32 = 20,
    @query createdSince?: plainDate,
    @query createdUntil?: plainDate,
    @query updatedSince?: plainDate,
    @query updatedUntil?: plainDate,
    @query startDateSince?: plainDate,
    @query startDateUntil?: plainDate,
    @query dueDateSince?: plainDate,
    @query dueDateUntil?: plainDate,
    @query("id[]") id?: int64[],
    @query("parentIssueId[]") parentIssueId?: int64[],
    @query keyword?: string,
  ): Issue[] | BacklogErrorResponse;

  /** Get count of issues. */
  @get
  @route("/count")
  op count(
    @query("projectId[]") projectId?: int64[],
    @query("issueTypeId[]") issueTypeId?: int64[],
    @query("categoryId[]") categoryId?: int64[],
    @query("versionId[]") versionId?: int64[],
    @query("milestoneId[]") milestoneId?: int64[],
    @query("statusId[]") statusId?: int64[],
    @query("priorityId[]") priorityId?: int64[],
    @query("assigneeId[]") assigneeId?: int64[],
    @query("createdUserId[]") createdUserId?: int64[],
    @query("resolutionId[]") resolutionId?: int64[],
    @query parentChild?: ParentChildType,
    @query attachment?: boolean,
    @query sharedFile?: boolean,
    @query createdSince?: plainDate,
    @query createdUntil?: plainDate,
    @query updatedSince?: plainDate,
    @query updatedUntil?: plainDate,
    @query startDateSince?: plainDate,
    @query startDateUntil?: plainDate,
    @query dueDateSince?: plainDate,
    @query dueDateUntil?: plainDate,
    @query("id[]") id?: int64[],
    @query("parentIssueId[]") parentIssueId?: int64[],
    @query keyword?: string,
  ): {
    count: int32;
  } | BacklogErrorResponse;

  /** Create a new issue. */
  @post op create(
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      projectId: int64;
      summary: string;
      parentIssueId?: int64;
      description?: string;
      startDate?: plainDate;
      dueDate?: plainDate;
      estimatedHours?: float64;
      actualHours?: float64;
      issueTypeId: int64;
      @encodedName("application/x-www-form-urlencoded", "categoryId[]")
      categoryId?: int64[];
      @encodedName("application/x-www-form-urlencoded", "versionId[]")
      versionId?: int64[];
      @encodedName("application/x-www-form-urlencoded", "milestoneId[]")
      milestoneId?: int64[];
      priorityId: int64;
      assigneeId?: int64;
      @encodedName("application/x-www-form-urlencoded", "notifiedUserId[]")
      notifiedUserId?: int64[];
      @encodedName("application/x-www-form-urlencoded", "attachmentId[]")
      attachmentId?: int64[];
    },
  ): {
    @statusCode statusCode: 201;
    @body issue: Issue;
  } | BacklogErrorResponse;

  /** Get issue information. */
  @get
  @route("/{issueIdOrKey}")
  op get(@path issueIdOrKey: string): Issue | BacklogErrorResponse;

  /** Update an issue. */
  @patch(#{implicitOptionality: false})
  @route("/{issueIdOrKey}")
  op update(
    @path issueIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      summary?: string;
      parentIssueId?: int64;
      description?: string;
      statusId?: int64;
      resolutionId?: int64;
      startDate?: plainDate;
      dueDate?: plainDate;
      estimatedHours?: float64;
      actualHours?: float64;
      issueTypeId?: int64;
      @encodedName("application/x-www-form-urlencoded", "categoryId[]")
      categoryId?: int64[];
      @encodedName("application/x-www-form-urlencoded", "versionId[]")
      versionId?: int64[];
      @encodedName("application/x-www-form-urlencoded", "milestoneId[]")
      milestoneId?: int64[];
      priorityId?: int64;
      assigneeId?: int64;
      @encodedName("application/x-www-form-urlencoded", "notifiedUserId[]")
      notifiedUserId?: int64[];
      @encodedName("application/x-www-form-urlencoded", "attachmentId[]")
      attachmentId?: int64[];
      comment?: string;
    },
  ): Issue | BacklogErrorResponse;

  /** Delete an issue. */
  @delete
  @route("/{issueIdOrKey}")
  op delete(@path issueIdOrKey: string): Issue | BacklogErrorResponse;
}

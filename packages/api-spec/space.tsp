using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Backlog space information. */
model Space {
  spaceKey: string;
  name: string;
  ownerId: int64;
  lang: string;
  timezone: string;
  reportSendTime: string;
  textFormattingRule: TextFormattingRule;
  created: utcDateTime;
  updated: utcDateTime;
}

/** Space notification body content. */
model SpaceNotification {
  content: string;
  updated: utcDateTime;
}

/** Disk usage information. */
model DiskUsage {
  capacity: int64;
  issue: int64;
  wiki: int64;
  file: int64;
  subversion: int64;
  git: int64;
  gitLFS: int64;
  pullRequest: int64;
  details: DiskUsageDetail[] | null;
}

/** Per-project disk usage detail. */
model DiskUsageDetail {
  projectId: int64;
  issue: int64;
  wiki: int64;
  file: int64;
  subversion: int64;
  git: int64;
  gitLFS: int64;
  pullRequest: int64;
}

/** Activity entry for space or project. */
model Activity {
  id: int64;
  project: Project;

  /**
   * Activity type code.
   * - 1: Issue Created
   * - 2: Issue Updated
   * - 3: Issue Commented
   * - 4: Issue Deleted
   * - 5: Wiki Created
   * - 6: Wiki Updated
   * - 7: Wiki Deleted
   * - 8: File Added
   * - 9: File Updated
   * - 10: File Deleted
   * - 11: SVN Committed
   * - 12: Git Pushed
   * - 13: Git Repo Created
   * - 14: Issue Multi-Updated
   * - 15: Project User Added
   * - 16: Project User Removed
   * - 17: Comment Notification Added
   * - 18: Pull Request Added
   * - 19: Pull Request Updated
   * - 20: Pull Request Commented
   * - 21: Pull Request Merged
   * - 22: Milestone Added
   * - 23: Milestone Updated
   * - 24: Milestone Deleted
   * - 25: Group Added
   * - 26: Group Deleted
   */
  type: int32;

  content: unknown;
  notifications: unknown[];
  createdUser: User;
  created: utcDateTime;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/space")
@tag("Space")
interface Spaces {
  @summary("Get space information")
  @get op getSpace(): Space | BacklogErrorResponse;

  @summary("Get recent space activities")
  @get
  @route("/activities")
  op getActivities(...ActivityPaginationQuery): Activity[] | BacklogErrorResponse;

  @summary("Get space logo image")
  @get
  @route("/logo")
  op getLogo(): {
    @header contentType: "image/png" | "image/gif" | "image/jpeg";
    @body image: bytes;
  } | BacklogErrorResponse;

  @summary("Get space notification")
  @get
  @route("/notification")
  op getNotification(): SpaceNotification | BacklogErrorResponse;

  @summary("Update space notification")
  @put
  @route("/notification")
  op updateNotification(
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      content: string;
    },
  ): SpaceNotification | BacklogErrorResponse;

  @summary("Get disk usage information")
  @get
  @route("/diskUsage")
  op getDiskUsage(): DiskUsage | BacklogErrorResponse;

  @summary("Upload an attachment file")
  @post
  @route("/attachment")
  op postAttachment(
    @multipartBody body: {
      file: HttpPart<bytes>;
    },
  ): {
    id: int64;
    name: string;
    size: int64;
  } | BacklogErrorResponse;
}

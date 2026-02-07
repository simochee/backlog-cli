using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Priority level. */
model Priority {
  id: int64;
  name: string;
}

/** Rate limit category status. */
model RateLimitCategory {
  limit: int32;
  remaining: int32;
  reset: int64;
}

/** Rate limit information. */
model RateLimit {
  rateLimit: {
    read: RateLimitCategory;
    update: RateLimitCategory;
    search: RateLimitCategory;
    icon: RateLimitCategory;
  };
}

/** Space licence information. */
model Licence {
  active: boolean;
  attachmentLimit: int64;
  attachmentLimitPerFile: int64;
  attachmentNumLimit: int32;
  attribute: boolean;
  attributeLimit: int32;
  burndown: boolean;
  commentLimit: int32;
  componentLimit: int32;
  fileSharing: boolean;
  gantt: boolean;
  git: boolean;
  issueLimit: int32;
  licenceTypeId: int32;
  limitDate: plainDate;
  nulabAccount: boolean;
  parentChildIssue: boolean;
  postIssueByMail: boolean;
  projectGroup: boolean;
  projectLimit: int32;
  pullRequestAttachmentLimitPerFile: int64;
  pullRequestAttachmentNumLimit: int32;
  remoteAddress: boolean;
  startedOn: plainDate;
  storageLimit: int64;
  subversion: boolean;
  subversionExternal: boolean;
  userLimit: int32;
  versionLimit: int32;
  wikiAttachment: boolean;
  wikiAttachmentLimitPerFile: int64;
  wikiAttachmentNumLimit: int32;
}

/** Recently viewed issue wrapper. */
model RecentlyViewedIssue {
  issue: Issue;
  updated: utcDateTime;
}

/** Recently viewed project wrapper. */
model RecentlyViewedProject {
  project: Project;
  updated: utcDateTime;
}

/** Recently viewed wiki wrapper. */
model RecentlyViewedWiki {
  page: Wiki;
  updated: utcDateTime;
}

// ────────────────────────────────────────────
// Priority & Resolution Operations
// ────────────────────────────────────────────

@tag("Priorities & Resolutions")
interface PrioritiesAndResolutions {
  /** Get list of priorities. */
  @get
  @route("/priorities")
  op listPriorities(): Priority[] | BacklogErrorResponse;

  /** Get list of resolutions. */
  @get
  @route("/resolutions")
  op listResolutions(): Resolution[] | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Recently Viewed Operations
// ────────────────────────────────────────────

@route("/users/myself")
@tag("Recently Viewed")
interface RecentlyViewed {
  /** Get recently viewed issues. */
  @get
  @route("/recentlyViewedIssues")
  op listIssues(
    ...PaginationQuery,
  ): RecentlyViewedIssue[] | BacklogErrorResponse;

  /** Get recently viewed projects. */
  @get
  @route("/recentlyViewedProjects")
  op listProjects(
    ...PaginationQuery,
  ): RecentlyViewedProject[] | BacklogErrorResponse;

  /** Get recently viewed wiki pages. */
  @get
  @route("/recentlyViewedWikis")
  op listWikis(
    ...PaginationQuery,
  ): RecentlyViewedWiki[] | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Licence & Rate Limit Operations
// ────────────────────────────────────────────

@tag("Licence & Rate Limit")
interface LicenceAndRateLimit {
  /** Get space licence information. */
  @get
  @route("/space/licence")
  op getLicence(): Licence | BacklogErrorResponse;

  /** Get rate limit information. */
  @get
  @route("/rateLimit")
  op getRateLimit(): RateLimit | BacklogErrorResponse;
}

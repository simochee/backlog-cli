using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Backlog project. */
model Project {
  id: int64;
  projectKey: string;
  name: string;
  chartEnabled: boolean;
  useResolvedForChart: boolean;
  subtaskingEnabled: boolean;
  projectLeaderCanEditProjectLeader: boolean;
  useWiki: boolean;
  useFileSharing: boolean;
  useWikiTreeView: boolean;
  useOriginalImageSizeAtWiki: boolean;
  useSubversion: boolean;
  useGit: boolean;
  textFormattingRule: TextFormattingRule;
  archived: boolean;
  displayOrder: int32;
  useDevAttributes: boolean;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/projects")
@tag("Projects")
interface Projects {
  /** Get list of projects. */
  @get op list(
    @query archived?: boolean,
    @query all?: boolean,
  ): Project[] | BacklogErrorResponse;

  /** Add a new project. */
  @post op create(
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name: string;
      key: string;
      chartEnabled?: boolean;
      subtaskingEnabled?: boolean;
      projectLeaderCanEditProjectLeader?: boolean;
      useWiki?: boolean;
      useFileSharing?: boolean;
      useDevAttributes?: boolean;
      textFormattingRule?: TextFormattingRule;
      useWikiTreeView?: boolean;
      useOriginalImageSizeAtWiki?: boolean;
    },
  ): {
    @statusCode statusCode: 201;
    @body project: Project;
  } | BacklogErrorResponse;

  /** Get project information. */
  @get
  @route("/{projectIdOrKey}")
  op get(@path projectIdOrKey: string): Project | BacklogErrorResponse;

  /** Update project information. */
  @patch(#{implicitOptionality: false})
  @route("/{projectIdOrKey}")
  op update(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
      key?: string;
      chartEnabled?: boolean;
      subtaskingEnabled?: boolean;
      projectLeaderCanEditProjectLeader?: boolean;
      useWiki?: boolean;
      useFileSharing?: boolean;
      useDevAttributes?: boolean;
      textFormattingRule?: TextFormattingRule;
      archived?: boolean;
      useWikiTreeView?: boolean;
      useOriginalImageSizeAtWiki?: boolean;
    },
  ): Project | BacklogErrorResponse;

  /** Delete a project. */
  @delete
  @route("/{projectIdOrKey}")
  op delete(@path projectIdOrKey: string): Project | BacklogErrorResponse;

  /** Get project icon image. */
  @get
  @route("/{projectIdOrKey}/image")
  op getImage(@path projectIdOrKey: string): {
    @header contentType: "image/png" | "image/gif" | "image/jpeg";
    @body image: bytes;
  } | BacklogErrorResponse;

  /** Get project activities. */
  @get
  @route("/{projectIdOrKey}/activities")
  op getActivities(
    @path projectIdOrKey: string,
    ...ActivityPaginationQuery,
    @query("activityTypeId[]") activityTypeId?: int32[],
  ): Activity[] | BacklogErrorResponse;

  /** Get project disk usage. */
  @get
  @route("/{projectIdOrKey}/diskUsage")
  op getDiskUsage(@path projectIdOrKey: string): DiskUsageDetail | BacklogErrorResponse;
}

@route("/projects/{projectIdOrKey}/users")
@tag("Project Members")
interface ProjectMembers {
  /** Get list of project members. */
  @get op list(
    @path projectIdOrKey: string,
    @query excludeGroupMembers?: boolean,
  ): User[] | BacklogErrorResponse;

  /** Add a user to the project. */
  @post op add(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      userId: int64;
    },
  ): {
    @statusCode statusCode: 201;
    @body user: User;
  } | BacklogErrorResponse;

  /** Remove a user from the project. */
  @delete op remove(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      userId: int64;
    },
  ): User | BacklogErrorResponse;
}

@route("/projects/{projectIdOrKey}/administrators")
@tag("Project Administrators")
interface ProjectAdministrators {
  /** Get list of project administrators. */
  @get op list(@path projectIdOrKey: string): User[] | BacklogErrorResponse;

  /** Add a project administrator. */
  @post op add(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      userId: int64;
    },
  ): {
    @statusCode statusCode: 201;
    @body user: User;
  } | BacklogErrorResponse;

  /** Remove a project administrator. */
  @delete op remove(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      userId: int64;
    },
  ): User | BacklogErrorResponse;
}

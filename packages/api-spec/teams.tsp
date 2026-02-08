using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Backlog team. */
model Team {
  id: int64;
  name: string;
  members: User[];
  displayOrder: int32 | null;
  createdUser: User | null;
  created: utcDateTime;
  updatedUser: User | null;
  updated: utcDateTime;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/teams")
@tag("Teams")
interface Teams {
  /** Get list of teams. */
  @get op list(
    ...PaginationQuery,
  ): Team[] | BacklogErrorResponse;

  /** Create a new team. */
  @post op create(
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name: string;
      @encodedName("application/x-www-form-urlencoded", "members[]")
      members?: int64[];
    },
  ): {
    @statusCode statusCode: 201;
    @body team: Team;
  } | BacklogErrorResponse;

  /** Get team information. */
  @get
  @route("/{teamId}")
  op get(@path teamId: int64): Team | BacklogErrorResponse;

  /** Update a team. */
  @patch(#{implicitOptionality: false})
  @route("/{teamId}")
  op update(
    @path teamId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
      @encodedName("application/x-www-form-urlencoded", "members[]")
      members?: int64[];
    },
  ): Team | BacklogErrorResponse;

  /** Delete a team. */
  @delete
  @route("/{teamId}")
  op delete(@path teamId: int64): Team | BacklogErrorResponse;

  /** Get team icon image. */
  @get
  @route("/{teamId}/icon")
  op getIcon(@path teamId: int64): {
    @header contentType: "image/png" | "image/gif" | "image/jpeg";
    @body image: bytes;
  } | BacklogErrorResponse;
}

@route("/projects/{projectIdOrKey}/teams")
@tag("Project Teams")
interface ProjectTeams {
  /** Get list of project teams. */
  @get op list(@path projectIdOrKey: string): Team[] | BacklogErrorResponse;

  /** Add a team to the project. */
  @post op add(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      teamId: int64;
    },
  ): {
    @statusCode statusCode: 201;
    @body team: Team;
  } | BacklogErrorResponse;

  /** Remove a team from the project. */
  @delete
  @route("/{teamId}")
  op remove(
    @path projectIdOrKey: string,
    @path teamId: int64,
  ): Team | BacklogErrorResponse;
}

@route("/groups")
@tag("Groups (Deprecated)")
interface Groups {
  /** Get list of groups (deprecated, use Teams). */
  @get op list(
    ...PaginationQuery,
  ): Team[] | BacklogErrorResponse;

  /** Get group information (deprecated, use Teams). */
  @get
  @route("/{groupId}")
  op get(@path groupId: int64): Team | BacklogErrorResponse;
}

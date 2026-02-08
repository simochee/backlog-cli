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
  @summary("Get list of teams")
  @get op list(
    ...PaginationQuery,
  ): Team[] | BacklogErrorResponse;

  @summary("Create a new team")
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

  @summary("Get team information")
  @get
  @route("/{teamId}")
  op get(@path teamId: int64): Team | BacklogErrorResponse;

  @summary("Update a team")
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

  @summary("Delete a team")
  @delete
  @route("/{teamId}")
  op delete(@path teamId: int64): Team | BacklogErrorResponse;

  @summary("Get team icon image")
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
  @summary("Get list of project teams")
  @get op list(@path projectIdOrKey: string): Team[] | BacklogErrorResponse;

  @summary("Add a team to the project")
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

  @summary("Remove a team from the project")
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
  @summary("Get list of groups")
  @doc("Deprecated: use Teams instead.")
  @get op list(
    ...PaginationQuery,
  ): Team[] | BacklogErrorResponse;

  @summary("Get group information")
  @doc("Deprecated: use Teams instead.")
  @get
  @route("/{groupId}")
  op get(@path groupId: int64): Team | BacklogErrorResponse;
}

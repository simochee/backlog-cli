using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Backlog user. */
model User {
  id: int64;
  userId: string;
  name: string;
  roleType: UserRoleType;
  lang: string | null;
  mailAddress: string;
  lastLoginTime: utcDateTime | null;
  nulabAccount: NulabAccount | null;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/users")
@tag("Users")
interface Users {
  @summary("Get list of users in the space")
  @get op list(): User[] | BacklogErrorResponse;

  @summary("Get user information")
  @get
  @route("/{userId}")
  op get(@path userId: int64): User | BacklogErrorResponse;

  @summary("Add a new user to the space")
  @post op create(
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      userId: string;
      password: string;
      name: string;
      mailAddress: string;
      roleType: UserRoleType;
    },
  ): {
    @statusCode statusCode: 201;
    @body user: User;
  } | BacklogErrorResponse;

  @summary("Update user information")
  @patch(#{implicitOptionality: false})
  @route("/{userId}")
  op update(
    @path userId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      password?: string;
      name?: string;
      mailAddress?: string;
      roleType?: UserRoleType;
    },
  ): User | BacklogErrorResponse;

  @summary("Delete a user from the space")
  @delete
  @route("/{userId}")
  op delete(@path userId: int64): User | BacklogErrorResponse;

  @summary("Get own user information")
  @get
  @route("/myself")
  op getMyself(): User | BacklogErrorResponse;

  @summary("Get user icon image")
  @get
  @route("/{userId}/icon")
  op getIcon(@path userId: int64): {
    @header contentType: "image/png" | "image/gif" | "image/jpeg";
    @body image: bytes;
  } | BacklogErrorResponse;

  @summary("Get user's recent activities")
  @get
  @route("/{userId}/activities")
  op getActivities(
    @path userId: int64,
    ...ActivityPaginationQuery,
  ): Activity[] | BacklogErrorResponse;

  @summary("Get list of stars the user received")
  @get
  @route("/{userId}/stars")
  op getStars(
    @path userId: int64,
    ...PaginationQuery,
    @query minId?: int64,
    @query maxId?: int64,
  ): Star[] | BacklogErrorResponse;

  @summary("Get count of stars the user received")
  @get
  @route("/{userId}/stars/count")
  op getStarsCount(
    @path userId: int64,
    @query since?: plainDate,
    @query until?: plainDate,
  ): {
    count: int32;
  } | BacklogErrorResponse;
}

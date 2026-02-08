using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Wiki tag. */
model WikiTag {
  id: int64;
  name: string;
}

/** Wiki page. */
model Wiki {
  id: int64;
  projectId: int64;
  name: string;
  content: string;
  tags: WikiTag[];
  attachments: AttachmentInfo[];
  sharedFiles: SharedFile[];
  stars: Star[];
  createdUser: User;
  created: utcDateTime;
  updatedUser: User;
  updated: utcDateTime;
}

/** Wiki history entry. */
model WikiHistory {
  pageId: int64;
  version: int32;
  name: string;
  content: string;
  createdUser: User;
  created: utcDateTime;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/wikis")
@tag("Wikis")
interface Wikis {
  @summary("Get list of wiki pages")
  @get op list(
    @query projectIdOrKey?: string,
    @query keyword?: string,
  ): Wiki[] | BacklogErrorResponse;

  @summary("Get count of wiki pages")
  @get
  @route("/count")
  op count(@query projectIdOrKey?: string): {
    count: int32;
  } | BacklogErrorResponse;

  @summary("Get list of wiki tags")
  @get
  @route("/tags")
  op getTags(@query projectIdOrKey?: string): WikiTag[] | BacklogErrorResponse;

  @summary("Create a new wiki page")
  @post op create(
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      projectId: int64;
      name: string;
      content: string;
      mailNotify?: boolean;
    },
  ): {
    @statusCode statusCode: 201;
    @body wiki: Wiki;
  } | BacklogErrorResponse;

  @summary("Get wiki page information")
  @get
  @route("/{wikiId}")
  op get(@path wikiId: int64): Wiki | BacklogErrorResponse;

  @summary("Update a wiki page")
  @patch(#{implicitOptionality: false})
  @route("/{wikiId}")
  op update(
    @path wikiId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
      content?: string;
      mailNotify?: boolean;
    },
  ): Wiki | BacklogErrorResponse;

  @summary("Delete a wiki page")
  @delete
  @route("/{wikiId}")
  op delete(
    @path wikiId: int64,
    @query mailNotify?: boolean,
  ): Wiki | BacklogErrorResponse;

  @summary("Get wiki page update history")
  @get
  @route("/{wikiId}/history")
  op getHistory(
    @path wikiId: int64,
    ...PaginationQuery,
    @query minId?: int64,
    @query maxId?: int64,
  ): WikiHistory[] | BacklogErrorResponse;

  @summary("Get list of stars on a wiki page")
  @get
  @route("/{wikiId}/stars")
  op getStars(@path wikiId: int64): Star[] | BacklogErrorResponse;
}

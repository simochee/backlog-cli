using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Document (lightweight response from create/delete). */
model Document {
  id: string;
  projectId: int64;
  title: string;
  json: unknown | null;
  plain: string | null;
  statusId: int64;
  emoji: string | null;
  createdUserId: int64;
  created: utcDateTime;
  updatedUserId: int64;
  updated: utcDateTime;
}

/** Attachment info with creator details (used in document responses). */
model DocumentAttachmentInfo {
  id: int64;
  name: string;
  size: int64;
  createdUser: User;
  created: utcDateTime;
}

/** Document detail (full response from list/get). */
model DocumentDetail {
  id: string;
  projectId: int64;
  title: string;
  json: unknown | null;
  plain: string | null;
  statusId: int64;
  emoji: string | null;
  attachments: DocumentAttachmentInfo[];
  tags: IdName[];
  createdUser: User;
  created: utcDateTime;
  updatedUser: User;
  updated: utcDateTime;
}

/** Document tree node. */
model DocumentTreeNode {
  id: string;
  name: string;
  emoji: string | null;
  children: DocumentTreeNode[];
}

/** Document tree container (Active or Trash). */
model DocumentTreeContainer {
  id: string;
  children: DocumentTreeNode[];
}

/** Document tree response. */
model DocumentTree {
  projectId: int64;
  activeTree: DocumentTreeContainer;
  trashTree: DocumentTreeContainer;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/documents")
@tag("Documents")
interface Documents {
  @summary("Get list of documents")
  @get op list(
    @query("projectId[]") projectId?: int64[],
    @query keyword?: string,
    @query sort?: "created" | "updated",
    @query order?: Order,
    @query offset?: int32,
    @query count?: int32,
  ): DocumentDetail[] | BacklogErrorResponse;

  @summary("Get document tree")
  @get
  @route("/tree")
  op getTree(
    @query projectIdOrKey: string,
  ): DocumentTree | BacklogErrorResponse;

  @summary("Add a document")
  @post op create(
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      projectId: int64;
      title?: string;
      content?: string;
      emoji?: string;
      parentId?: string;
      addLast?: boolean;
    },
  ): {
    @statusCode statusCode: 201;
    @body document: Document;
  } | BacklogErrorResponse;

  @summary("Get a document")
  @get
  @route("/{documentId}")
  op get(@path documentId: string): DocumentDetail | BacklogErrorResponse;

  @summary("Delete a document")
  @delete
  @route("/{documentId}")
  op delete(@path documentId: string): Document | BacklogErrorResponse;

  @summary("Download a document attachment")
  @get
  @route("/{documentId}/attachments/{attachmentId}")
  op getAttachment(
    @path documentId: string,
    @path attachmentId: int64,
  ): bytes | BacklogErrorResponse;
}

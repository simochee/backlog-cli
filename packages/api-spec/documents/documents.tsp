using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Document. */
model Document {
  id: string;
  projectId: int64;
  title: string;
  json: unknown | null;
  plain: string | null;
  statusId: int64;
  emoji: string;
  createdUserId: int64;
  created: utcDateTime;
  updatedUserId: int64;
  updated: utcDateTime;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/documents")
@tag("Documents")
interface Documents {
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

  @summary("Delete a document")
  @delete
  @route("/{documentId}")
  op delete(@path documentId: string): Document | BacklogErrorResponse;
}

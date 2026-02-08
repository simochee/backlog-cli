using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Wiki Attachments
// ────────────────────────────────────────────

@route("/wikis/{wikiId}/attachments")
@tag("Wiki Attachments")
interface WikiAttachments {
  /** Get list of wiki page attachments. */
  @get op list(@path wikiId: int64): AttachmentInfo[] | BacklogErrorResponse;

  /** Attach files to a wiki page. */
  @post op attach(
    @path wikiId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      @encodedName("application/x-www-form-urlencoded", "attachmentId[]")
      attachmentId: int64[];
    },
  ): AttachmentInfo[] | BacklogErrorResponse;

  /** Download a wiki page attachment. */
  @get
  @route("/{attachmentId}")
  op download(
    @path wikiId: int64,
    @path attachmentId: int64,
  ): {
    @header contentType: "application/octet-stream";
    @body file: bytes;
  } | BacklogErrorResponse;

  /** Delete a wiki page attachment. */
  @delete
  @route("/{attachmentId}")
  op delete(
    @path wikiId: int64,
    @path attachmentId: int64,
  ): AttachmentInfo | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Wiki Shared Files
// ────────────────────────────────────────────

@route("/wikis/{wikiId}/sharedFiles")
@tag("Wiki Shared Files")
interface WikiSharedFiles {
  /** Get list of shared files linked to a wiki page. */
  @get op list(@path wikiId: int64): SharedFile[] | BacklogErrorResponse;

  /** Link shared files to a wiki page. */
  @post op link(
    @path wikiId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      @encodedName("application/x-www-form-urlencoded", "fileId[]")
      fileId: int64[];
    },
  ): SharedFile[] | BacklogErrorResponse;

  /** Unlink a shared file from a wiki page. */
  @delete
  @route("/{sharedFileId}")
  op unlink(
    @path wikiId: int64,
    @path sharedFileId: int64,
  ): SharedFile | BacklogErrorResponse;
}

using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Issue Attachments
// ────────────────────────────────────────────

@route("/issues/{issueIdOrKey}/attachments")
@tag("Issue Attachments")
interface IssueAttachments {
  /** Get list of attachments on an issue. */
  @get op list(@path issueIdOrKey: string): AttachmentInfo[] | BacklogErrorResponse;

  /** Download an issue attachment. */
  @get
  @route("/{attachmentId}")
  op download(
    @path issueIdOrKey: string,
    @path attachmentId: int64,
  ): {
    @header contentType: "application/octet-stream";
    @body file: bytes;
  } | BacklogErrorResponse;

  /** Delete an issue attachment. */
  @delete
  @route("/{attachmentId}")
  op delete(
    @path issueIdOrKey: string,
    @path attachmentId: int64,
  ): AttachmentInfo | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Issue Participants
// ────────────────────────────────────────────

@route("/issues/{issueIdOrKey}/participants")
@tag("Issue Participants")
interface IssueParticipants {
  /** Get list of participants on an issue. */
  @get op list(@path issueIdOrKey: string): User[] | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Issue Shared Files
// ────────────────────────────────────────────

@route("/issues/{issueIdOrKey}/sharedFiles")
@tag("Issue Shared Files")
interface IssueSharedFiles {
  /** Get list of shared files linked to an issue. */
  @get op list(@path issueIdOrKey: string): SharedFile[] | BacklogErrorResponse;

  /** Link shared files to an issue. */
  @post op link(
    @path issueIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      @encodedName("application/x-www-form-urlencoded", "fileId[]")
      fileId: int64[];
    },
  ): SharedFile[] | BacklogErrorResponse;

  /** Unlink a shared file from an issue. */
  @delete
  @route("/{sharedFileId}")
  op unlink(
    @path issueIdOrKey: string,
    @path sharedFileId: int64,
  ): SharedFile | BacklogErrorResponse;
}

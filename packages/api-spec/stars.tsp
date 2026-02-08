using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/stars")
@tag("Stars")
interface Stars {
  /** Add a star to an issue, comment, wiki page, or pull request. */
  @post op add(
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      /** Issue ID to star. */
      issueId?: int64;
      /** Comment ID to star. */
      commentId?: int64;
      /** Wiki page ID to star. */
      wikiId?: int64;
      /** Pull request ID to star. */
      pullRequestId?: int64;
      /** Pull request comment ID to star. */
      pullRequestCommentId?: int64;
    },
  ): void | BacklogErrorResponse;
}

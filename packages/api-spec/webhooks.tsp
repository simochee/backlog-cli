using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Models
// ────────────────────────────────────────────

/** Webhook definition. */
model Webhook {
  id: int64;
  name: string;
  description: string;
  hookUrl: string;
  allEvent: boolean;
  activityTypeIds: int32[];
  createdUser: User;
  created: utcDateTime;
  updatedUser: User;
  updated: utcDateTime;
}

// ────────────────────────────────────────────
// Operations
// ────────────────────────────────────────────

@route("/projects/{projectIdOrKey}/webhooks")
@tag("Webhooks")
interface Webhooks {
  @summary("Get list of webhooks in a project")
  @get op list(@path projectIdOrKey: string): Webhook[] | BacklogErrorResponse;

  @summary("Add a webhook to the project")
  @post op create(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name: string;
      description?: string;
      hookUrl: string;
      allEvent?: boolean;
      @encodedName("application/x-www-form-urlencoded", "activityTypeIds[]")
      activityTypeIds?: int32[];
    },
  ): {
    @statusCode statusCode: 201;
    @body webhook: Webhook;
  } | BacklogErrorResponse;

  @summary("Get webhook information")
  @get
  @route("/{webhookId}")
  op get(
    @path projectIdOrKey: string,
    @path webhookId: int64,
  ): Webhook | BacklogErrorResponse;

  @summary("Update a webhook")
  @patch(#{implicitOptionality: false})
  @route("/{webhookId}")
  op update(
    @path projectIdOrKey: string,
    @path webhookId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
      description?: string;
      hookUrl?: string;
      allEvent?: boolean;
      @encodedName("application/x-www-form-urlencoded", "activityTypeIds[]")
      activityTypeIds?: int32[];
    },
  ): Webhook | BacklogErrorResponse;

  @summary("Delete a webhook")
  @delete
  @route("/{webhookId}")
  op delete(
    @path projectIdOrKey: string,
    @path webhookId: int64,
  ): Webhook | BacklogErrorResponse;
}

import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

import "./common.tsp";
import "./space.tsp";
import "./users.tsp";
import "./teams.tsp";
import "./projects.tsp";
import "./project-settings.tsp";
import "./issues.tsp";
import "./issue-comments.tsp";
import "./issue-attachments.tsp";
import "./wikis.tsp";
import "./wiki-attachments.tsp";
import "./notifications.tsp";
import "./git.tsp";
import "./watching.tsp";
import "./webhooks.tsp";
import "./stars.tsp";
import "./misc.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

/** Backlog API v2 — Project management tool by Nulab. */
@service(#{ title: "Backlog API v2" })
@info(#{
  contact: #{ name: "Nulab", url: "https://nulab.com" },
  license: #{ name: "See Nulab Terms of Service", url: "https://nulab.com/terms" },
})
@server("https://{spaceKey}.backlog.com/api/v2", "Backlog API (.com domain)", {
  spaceKey: string,
})
@server("https://{spaceKey}.backlog.jp/api/v2", "Backlog API (.jp domain)", {
  spaceKey: string,
})
@useAuth(ApiKeyAuth<ApiKeyLocation.query, "apiKey"> | BearerAuth)
namespace Backlog;

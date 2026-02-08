import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

import "./models";
import "./space.tsp";
import "./users.tsp";
import "./teams.tsp";
import "./projects";
import "./issues";
import "./wiki";
import "./notifications.tsp";
import "./git";
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

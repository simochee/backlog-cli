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
import "./documents";
import "./notifications.tsp";
import "./git";
import "./watching.tsp";
import "./webhooks.tsp";
import "./stars.tsp";
import "./misc.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@doc("""
  Backlog API — Project management tool by Nulab.

  > **This is an unofficial OpenAPI specification** and is not provided or endorsed by Nulab.
  > Complete compatibility with the actual Backlog API is not guaranteed.

  This definition is maintained for backlog-cli.
  """)
@service(#{ title: "Backlog API (UNOFFICIAL)" })
@info(#{
  version: "2.0.0",
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
@externalDocs("https://developer.nulab.com/docs/backlog/", "Backlog API Documentation")
@tagMetadata("Space", #{ description: "Space-level information, activities, disk usage, and attachments." })
@tagMetadata("Users", #{ description: "User management: list, create, update, delete users and retrieve user activities." })
@tagMetadata("Teams", #{ description: "Team management: list, create, update, delete teams." })
@tagMetadata("Project Teams", #{ description: "Manage teams assigned to a project." })
@tagMetadata("Groups (Deprecated)", #{ description: "Deprecated group endpoints. Use Teams instead." })
@tagMetadata("Projects", #{ description: "Project management: list, create, update, delete projects and retrieve project activities." })
@tagMetadata("Project Members", #{ description: "Manage project members." })
@tagMetadata("Project Administrators", #{ description: "Manage project administrators." })
@tagMetadata("Issues", #{ description: "Issue management: list, create, update, delete issues." })
@tagMetadata("Issue Comments", #{ description: "Comments on issues." })
@tagMetadata("Issue Attachments", #{ description: "Attachments on issues." })
@tagMetadata("Issue Participants", #{ description: "Participants on issues." })
@tagMetadata("Issue Shared Files", #{ description: "Shared files linked to issues." })
@tagMetadata("Notifications", #{ description: "Notification management and read status." })
@tagMetadata("Git Repositories", #{ description: "Git repository management within projects." })
@tagMetadata("Pull Requests", #{ description: "Pull request management within Git repositories." })
@tagMetadata("Pull Request Comments", #{ description: "Comments on pull requests." })
@tagMetadata("Pull Request Attachments", #{ description: "Attachments on pull requests." })
@tagMetadata("Wikis", #{ description: "Wiki page management: list, create, update, delete pages." })
@tagMetadata("Wiki Attachments", #{ description: "Attachments on wiki pages." })
@tagMetadata("Wiki Shared Files", #{ description: "Shared files linked to wiki pages." })
@tagMetadata("Documents", #{ description: "Document management: create and delete documents." })
@tagMetadata("Watching", #{ description: "Watching (follow) management for issues." })
@tagMetadata("Webhooks", #{ description: "Webhook management within projects." })
@tagMetadata("Stars", #{ description: "Star (favorite) operations for issues, comments, wikis, and pull requests." })
@tagMetadata("Statuses", #{ description: "Project issue statuses." })
@tagMetadata("Issue Types", #{ description: "Project issue types." })
@tagMetadata("Categories", #{ description: "Project categories." })
@tagMetadata("Versions / Milestones", #{ description: "Project versions and milestones." })
@tagMetadata("Custom Fields", #{ description: "Project custom field definitions and list items." })
@tagMetadata("Project Shared Files", #{ description: "Shared files within a project." })
@tagMetadata("Priorities & Resolutions", #{ description: "Priority and resolution master data." })
@tagMetadata("Recently Viewed", #{ description: "Recently viewed issues, projects, and wiki pages." })
@tagMetadata("Licence & Rate Limit", #{ description: "Space licence information and API rate limits." })
namespace Backlog;

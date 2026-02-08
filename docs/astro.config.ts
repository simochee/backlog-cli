import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://simochee.github.io",
	base: "/backlog-cli",
	integrations: [
		starlight({
			title: "Backlog CLI",
			defaultLocale: "root",
			locales: {
				root: {
					label: "日本語",
					lang: "ja",
				},
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/simochee/backlog-cli",
				},
			],
			sidebar: [
				{
					label: "はじめに",
					items: [
						{ label: "インストール", link: "/getting-started/installation/" },
						{ label: "クイックスタート", link: "/getting-started/quickstart/" },
					],
				},
				{
					label: "ガイド",
					items: [
						{ label: "認証", link: "/guides/authentication/" },
						{ label: "設定", link: "/guides/configuration/" },
						{ label: "出力形式", link: "/guides/output-formatting/" },
						{ label: "シェル補完", link: "/guides/shell-completion/" },
						{ label: "AI エージェント連携", link: "/guides/ai-agent/" },
					],
				},
				{
					label: "コマンドリファレンス",
					items: [
						{
							label: "backlog auth",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/auth/" },
								{ label: "auth login", link: "/commands/auth/login/" },
								{ label: "auth logout", link: "/commands/auth/logout/" },
								{ label: "auth status", link: "/commands/auth/status/" },
								{ label: "auth token", link: "/commands/auth/token/" },
								{ label: "auth refresh", link: "/commands/auth/refresh/" },
								{ label: "auth switch", link: "/commands/auth/switch/" },
							],
						},
						{
							label: "backlog config",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/config/" },
								{ label: "config get", link: "/commands/config/get/" },
								{ label: "config set", link: "/commands/config/set/" },
								{ label: "config list", link: "/commands/config/list/" },
							],
						},
						{
							label: "backlog issue",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/issue/" },
								{ label: "issue list", link: "/commands/issue/list/" },
								{ label: "issue view", link: "/commands/issue/view/" },
								{ label: "issue create", link: "/commands/issue/create/" },
								{ label: "issue edit", link: "/commands/issue/edit/" },
								{ label: "issue close", link: "/commands/issue/close/" },
								{ label: "issue reopen", link: "/commands/issue/reopen/" },
								{ label: "issue comment", link: "/commands/issue/comment/" },
								{ label: "issue status", link: "/commands/issue/status/" },
							],
						},
						{
							label: "backlog project",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/project/" },
								{ label: "project list", link: "/commands/project/list/" },
								{ label: "project view", link: "/commands/project/view/" },
								{ label: "project create", link: "/commands/project/create/" },
								{ label: "project edit", link: "/commands/project/edit/" },
								{ label: "project delete", link: "/commands/project/delete/" },
								{ label: "project users", link: "/commands/project/users/" },
								{
									label: "project add-user",
									link: "/commands/project/add-user/",
								},
								{
									label: "project remove-user",
									link: "/commands/project/remove-user/",
								},
								{
									label: "project activities",
									link: "/commands/project/activities/",
								},
							],
						},
						{
							label: "backlog pr",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/pr/" },
								{ label: "pr list", link: "/commands/pr/list/" },
								{ label: "pr view", link: "/commands/pr/view/" },
								{ label: "pr create", link: "/commands/pr/create/" },
								{ label: "pr edit", link: "/commands/pr/edit/" },
								{ label: "pr close", link: "/commands/pr/close/" },
								{ label: "pr merge", link: "/commands/pr/merge/" },
								{ label: "pr reopen", link: "/commands/pr/reopen/" },
								{ label: "pr comment", link: "/commands/pr/comment/" },
								{ label: "pr comments", link: "/commands/pr/comments/" },
								{ label: "pr status", link: "/commands/pr/status/" },
							],
						},
						{
							label: "backlog repo",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/repo/" },
								{ label: "repo list", link: "/commands/repo/list/" },
								{ label: "repo view", link: "/commands/repo/view/" },
								{ label: "repo clone", link: "/commands/repo/clone/" },
							],
						},
						{
							label: "backlog notification",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/notification/" },
								{
									label: "notification list",
									link: "/commands/notification/list/",
								},
								{
									label: "notification count",
									link: "/commands/notification/count/",
								},
								{
									label: "notification read",
									link: "/commands/notification/read/",
								},
								{
									label: "notification read-all",
									link: "/commands/notification/read-all/",
								},
							],
						},
						{
							label: "backlog wiki",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/wiki/" },
								{ label: "wiki list", link: "/commands/wiki/list/" },
								{ label: "wiki view", link: "/commands/wiki/view/" },
								{ label: "wiki create", link: "/commands/wiki/create/" },
								{ label: "wiki edit", link: "/commands/wiki/edit/" },
								{ label: "wiki delete", link: "/commands/wiki/delete/" },
								{ label: "wiki count", link: "/commands/wiki/count/" },
								{ label: "wiki tags", link: "/commands/wiki/tags/" },
								{ label: "wiki history", link: "/commands/wiki/history/" },
								{
									label: "wiki attachments",
									link: "/commands/wiki/attachments/",
								},
							],
						},
						{
							label: "backlog user",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/user/" },
								{ label: "user list", link: "/commands/user/list/" },
								{ label: "user view", link: "/commands/user/view/" },
								{ label: "user me", link: "/commands/user/me/" },
								{
									label: "user activities",
									link: "/commands/user/activities/",
								},
							],
						},
						{
							label: "backlog team",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/team/" },
								{ label: "team list", link: "/commands/team/list/" },
								{ label: "team view", link: "/commands/team/view/" },
								{ label: "team create", link: "/commands/team/create/" },
								{ label: "team edit", link: "/commands/team/edit/" },
								{ label: "team delete", link: "/commands/team/delete/" },
							],
						},
						{
							label: "backlog category",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/category/" },
								{ label: "category list", link: "/commands/category/list/" },
								{
									label: "category create",
									link: "/commands/category/create/",
								},
								{ label: "category edit", link: "/commands/category/edit/" },
								{
									label: "category delete",
									link: "/commands/category/delete/",
								},
							],
						},
						{
							label: "backlog milestone",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/milestone/" },
								{ label: "milestone list", link: "/commands/milestone/list/" },
								{
									label: "milestone create",
									link: "/commands/milestone/create/",
								},
								{ label: "milestone edit", link: "/commands/milestone/edit/" },
								{
									label: "milestone delete",
									link: "/commands/milestone/delete/",
								},
							],
						},
						{
							label: "backlog issue-type",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/issue-type/" },
								{
									label: "issue-type list",
									link: "/commands/issue-type/list/",
								},
								{
									label: "issue-type create",
									link: "/commands/issue-type/create/",
								},
								{
									label: "issue-type edit",
									link: "/commands/issue-type/edit/",
								},
								{
									label: "issue-type delete",
									link: "/commands/issue-type/delete/",
								},
							],
						},
						{
							label: "backlog status-type",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/status-type/" },
								{
									label: "status-type list",
									link: "/commands/status-type/list/",
								},
								{
									label: "status-type create",
									link: "/commands/status-type/create/",
								},
								{
									label: "status-type edit",
									link: "/commands/status-type/edit/",
								},
								{
									label: "status-type delete",
									link: "/commands/status-type/delete/",
								},
							],
						},
						{
							label: "backlog space",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/space/" },
								{ label: "space info", link: "/commands/space/info/" },
								{
									label: "space activities",
									link: "/commands/space/activities/",
								},
								{
									label: "space disk-usage",
									link: "/commands/space/disk-usage/",
								},
								{
									label: "space notification",
									link: "/commands/space/notification/",
								},
							],
						},
						{
							label: "backlog webhook",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/webhook/" },
								{ label: "webhook list", link: "/commands/webhook/list/" },
								{ label: "webhook view", link: "/commands/webhook/view/" },
								{ label: "webhook create", link: "/commands/webhook/create/" },
								{ label: "webhook edit", link: "/commands/webhook/edit/" },
								{ label: "webhook delete", link: "/commands/webhook/delete/" },
							],
						},
						{
							label: "backlog star",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/star/" },
								{ label: "star add", link: "/commands/star/add/" },
								{ label: "star list", link: "/commands/star/list/" },
								{ label: "star count", link: "/commands/star/count/" },
							],
						},
						{
							label: "backlog watching",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/watching/" },
								{ label: "watching list", link: "/commands/watching/list/" },
								{ label: "watching add", link: "/commands/watching/add/" },
								{ label: "watching view", link: "/commands/watching/view/" },
								{
									label: "watching delete",
									link: "/commands/watching/delete/",
								},
								{ label: "watching read", link: "/commands/watching/read/" },
							],
						},
						{
							label: "backlog alias",
							collapsed: true,
							items: [
								{ label: "概要", link: "/commands/alias/" },
								{ label: "alias set", link: "/commands/alias/set/" },
								{ label: "alias list", link: "/commands/alias/list/" },
								{ label: "alias delete", link: "/commands/alias/delete/" },
							],
						},
						{ label: "backlog status", link: "/commands/status/" },
						{ label: "backlog browse", link: "/commands/browse/" },
						{ label: "backlog api", link: "/commands/api/" },
						{ label: "backlog completion", link: "/commands/completion/" },
					],
				},
			],
		}),
	],
});

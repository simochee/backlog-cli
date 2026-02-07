import { defineCommand, runMain } from "citty";

const main = defineCommand({
	meta: {
		name: "backlog",
		description: "Backlog CLI — manage Backlog from the command line",
	},
	subCommands: {
		auth: () => import("#commands/auth/index.ts").then((m) => m.default),
		config: () => import("#commands/config/index.ts").then((m) => m.default),
		issue: () => import("#commands/issue/index.ts").then((m) => m.default),
		project: () => import("#commands/project/index.ts").then((m) => m.default),
		pr: () => import("#commands/pr/index.ts").then((m) => m.default),
		repo: () => import("#commands/repo/index.ts").then((m) => m.default),
		notification: () =>
			import("#commands/notification/index.ts").then((m) => m.default),
		status: () => import("#commands/status.ts").then((m) => m.default),
		browse: () => import("#commands/browse.ts").then((m) => m.default),
		api: () => import("#commands/api.ts").then((m) => m.default),
		wiki: () => import("#commands/wiki/index.ts").then((m) => m.default),
		user: () => import("#commands/user/index.ts").then((m) => m.default),
		team: () => import("#commands/team/index.ts").then((m) => m.default),
		category: () =>
			import("#commands/category/index.ts").then((m) => m.default),
		milestone: () =>
			import("#commands/milestone/index.ts").then((m) => m.default),
		"issue-type": () =>
			import("#commands/issue-type/index.ts").then((m) => m.default),
		"status-type": () =>
			import("#commands/status-type/index.ts").then((m) => m.default),
	},
});

await runMain(main);

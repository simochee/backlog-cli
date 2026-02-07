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
		api: () => import("#commands/api.ts").then((m) => m.default),
	},
});

await runMain(main);

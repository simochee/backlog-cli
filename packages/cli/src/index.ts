import { extractGlobalArgs } from "#utils/argv.ts";
import { defineCommand, runMain } from "citty";

import { version, description } from "../package.json";

const { space, noInput, argv: cleanedArgv } = extractGlobalArgs(process.argv);
if (space) {
	process.env["BACKLOG_SPACE"] = space;
}
if (noInput) {
	process.env["BACKLOG_NO_INPUT"] = "1";
}
process.argv = cleanedArgv;

const main = defineCommand({
	meta: {
		name: "bl",
		version,
		description,
	},
	subCommands: {
		auth: () => import("#commands/auth/index.ts").then((m) => m.default),
		config: () => import("#commands/config/index.ts").then((m) => m.default),
		issue: () => import("#commands/issue/index.ts").then((m) => m.default),
		project: () => import("#commands/project/index.ts").then((m) => m.default),
		pr: () => import("#commands/pr/index.ts").then((m) => m.default),
		repo: () => import("#commands/repo/index.ts").then((m) => m.default),
		notification: () => import("#commands/notification/index.ts").then((m) => m.default),
		dashboard: () => import("#commands/dashboard.ts").then((m) => m.default),
		browse: () => import("#commands/browse.ts").then((m) => m.default),
		api: () => import("#commands/api.ts").then((m) => m.default),
		wiki: () => import("#commands/wiki/index.ts").then((m) => m.default),
		user: () => import("#commands/user/index.ts").then((m) => m.default),
		team: () => import("#commands/team/index.ts").then((m) => m.default),
		category: () => import("#commands/category/index.ts").then((m) => m.default),
		milestone: () => import("#commands/milestone/index.ts").then((m) => m.default),
		"issue-type": () => import("#commands/issue-type/index.ts").then((m) => m.default),
		status: () => import("#commands/status/index.ts").then((m) => m.default),
		space: () => import("#commands/space/index.ts").then((m) => m.default),
		webhook: () => import("#commands/webhook/index.ts").then((m) => m.default),
		star: () => import("#commands/star/index.ts").then((m) => m.default),
		watching: () => import("#commands/watching/index.ts").then((m) => m.default),
		alias: () => import("#commands/alias/index.ts").then((m) => m.default),
		completion: () => import("#commands/completion.ts").then((m) => m.default),
	},
});

await runMain(main);

import type { BacklogWikiCount } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "count",
		description: "Show wiki page count",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const result = await client<BacklogWikiCount>("/wikis/count", {
			query: { projectIdOrKey: project },
		});

		consola.log(`${result.count} wiki page(s)`);
	},
});

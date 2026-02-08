import type { BacklogWikiCount } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "count",
		description: "Show wiki page count",
	},
	args: {
		...outputArgs,
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

		outputResult(result, args, (data) => {
			consola.log(`${data.count} wiki page(s)`);
		});
	},
});

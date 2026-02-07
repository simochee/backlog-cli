import type { BacklogWikiCount } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "count",
		description: "Show wiki page count",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const result = await client<BacklogWikiCount>("/wikis/count", {
			query: { projectIdOrKey: args.project },
		});

		consola.log(`${result.count} wiki page(s)`);
	},
});

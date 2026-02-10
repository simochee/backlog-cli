import type { BacklogWiki } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete a wiki page",
	},
	args: {
		"wiki-id": {
			type: "positional",
			description: "Wiki page ID",
			required: true,
		},
		yes: {
			type: "boolean",
			alias: "y",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const proceed = await confirmOrExit(`Are you sure you want to delete wiki page ${args["wiki-id"]}?`, args.yes);
		if (!proceed) return;

		const wiki = await client<BacklogWiki>(`/wikis/${args["wiki-id"]}`, {
			method: "DELETE",
		});

		consola.success(`Deleted wiki page #${wiki.id}: ${wiki.name}`);
	},
});

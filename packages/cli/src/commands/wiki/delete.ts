import type { BacklogWiki } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

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
		confirm: {
			type: "boolean",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		if (!args.confirm) {
			const confirmed = await consola.prompt(
				`Are you sure you want to delete wiki page ${args["wiki-id"]}?`,
				{ type: "confirm" },
			);
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		const wiki = await client<BacklogWiki>(`/wikis/${args["wiki-id"]}`, {
			method: "DELETE",
		});

		consola.success(`Deleted wiki page #${wiki.id}: ${wiki.name}`);
	},
});

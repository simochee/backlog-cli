import type { BacklogWiki } from "@repo/api";
import type { WikisUpdateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit a wiki page",
	},
	args: {
		"wiki-id": {
			type: "positional",
			description: "Wiki page ID",
			required: true,
		},
		name: {
			type: "string",
			alias: "n",
			description: "Page name",
		},
		body: {
			type: "string",
			alias: "b",
			description: "Page content",
		},
		notify: {
			type: "boolean",
			description: "Send email notification",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const body: WikisUpdateData["body"] = {};

		if (args.name) {
			body.name = args.name;
		}
		if (args.body) {
			body.content = args.body;
		}
		if (args.notify) {
			body.mailNotify = true;
		}

		const wiki = await client<BacklogWiki>(`/wikis/${args["wiki-id"]}`, {
			method: "PATCH",
			body,
		});

		consola.success(`Updated wiki page #${wiki.id}: ${wiki.name}`);
	},
});

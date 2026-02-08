import type { BacklogWatching } from "@repo/api";
import type { WatchingOpsCreateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "add",
		description: "Add a watching",
	},
	args: {
		issue: {
			type: "string",
			description: "Issue key to watch",
			required: true,
		},
		note: {
			type: "string",
			description: "Note",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const body: WatchingOpsCreateData["body"] = {
			issueIdOrKey: args.issue,
		};

		if (args.note) {
			body.note = args.note;
		}

		const watching = await client<BacklogWatching>("/watchings", {
			method: "POST",
			body,
		});

		consola.success(`Added watching #${watching.id} for ${args.issue}.`);
	},
});

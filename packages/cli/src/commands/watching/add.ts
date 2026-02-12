import type { BacklogWatching } from "@repo/api";
import type { WatchingsCreateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "add",
		description: "Add a watching",
	},
	args: {
		...outputArgs,
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

		const body: WatchingsCreateData["body"] = {
			issueIdOrKey: args.issue,
		};

		if (args.note) {
			body.note = args.note;
		}

		const watching = await client<BacklogWatching>("/watchings", {
			method: "POST",
			body,
		});

		outputResult(watching, args, (data) => {
			consola.success(`Added watching #${data.id} for ${args.issue}.`);
		});
	},
});

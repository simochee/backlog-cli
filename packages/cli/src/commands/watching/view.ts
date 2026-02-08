import type { BacklogWatching } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View a watching",
	},
	args: {
		...outputArgs,
		"watching-id": {
			type: "positional",
			description: "Watching ID",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const watching = await client<BacklogWatching>(`/watchings/${args["watching-id"]}`);

		outputResult(watching, args, (data) => {
			consola.log("");
			consola.log(`  Watching #${data.id}`);
			consola.log("");
			consola.log(`    Type:           ${data.type}`);
			consola.log(`    Read:           ${data.resourceAlreadyRead ? "Yes" : "No"}`);

			if (data.issue) {
				consola.log(`    Issue:          ${data.issue.issueKey} — ${data.issue.summary}`);
			}

			if (data.note) {
				consola.log(`    Note:           ${data.note}`);
			}

			consola.log(`    Created:        ${formatDate(data.created)}`);
			consola.log(`    Updated:        ${formatDate(data.updated)}`);
			consola.log("");
		});
	},
});

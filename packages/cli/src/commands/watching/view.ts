import type { BacklogWatching } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View a watching",
	},
	args: {
		"watching-id": {
			type: "positional",
			description: "Watching ID",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const watching = await client<BacklogWatching>(`/watchings/${args["watching-id"]}`);

		consola.log("");
		consola.log(`  Watching #${watching.id}`);
		consola.log("");
		consola.log(`    Type:           ${watching.type}`);
		consola.log(`    Read:           ${watching.resourceAlreadyRead ? "Yes" : "No"}`);

		if (watching.issue) {
			consola.log(`    Issue:          ${watching.issue.issueKey} — ${watching.issue.summary}`);
		}

		if (watching.note) {
			consola.log(`    Note:           ${watching.note}`);
		}

		consola.log(`    Created:        ${formatDate(watching.created)}`);
		consola.log(`    Updated:        ${formatDate(watching.updated)}`);
		consola.log("");
	},
});

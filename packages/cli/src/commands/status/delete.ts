import type { BacklogStatus } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete an issue status",
	},
	args: {
		id: {
			type: "positional",
			description: "Status ID",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		"substitute-status-id": {
			type: "string",
			description: "Substitute status ID (required)",
			required: true,
		},
		yes: {
			type: "boolean",
			alias: "y",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const proceed = await confirmOrExit(`Are you sure you want to delete status ${args.id}?`, args.yes);
		if (!proceed) return;

		const status = await client<BacklogStatus>(`/projects/${project}/statuses/${args.id}`, {
			method: "DELETE",
			body: {
				substituteStatusId: Number.parseInt(args["substitute-status-id"], 10),
			},
		});

		consola.success(`Deleted status #${status.id}: ${status.name}`);
	},
});

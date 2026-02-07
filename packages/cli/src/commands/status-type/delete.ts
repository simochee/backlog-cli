import type { BacklogStatus } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

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
			description: "Project key",
			required: true,
		},
		"substitute-status-id": {
			type: "string",
			description: "Substitute status ID (required)",
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
				`Are you sure you want to delete status ${args.id}?`,
				{ type: "confirm" },
			);
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		const status = await client<BacklogStatus>(
			`/projects/${args.project}/statuses/${args.id}`,
			{
				method: "DELETE",
				body: {
					substituteStatusId: Number.parseInt(args["substitute-status-id"], 10),
				},
			},
		);

		consola.success(`Deleted status #${status.id}: ${status.name}`);
	},
});

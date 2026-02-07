import { type BacklogWebhook } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete a webhook",
	},
	args: {
		id: {
			type: "positional",
			description: "Webhook ID",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		confirm: {
			type: "boolean",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		if (!args.confirm) {
			const confirmed = await consola.prompt(
				`Are you sure you want to delete webhook ${args.id}?`,
				{ type: "confirm" },
			);
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		const webhook = await client<BacklogWebhook>(
			`/projects/${project}/webhooks/${args.id}`,
			{
				method: "DELETE",
			},
		);

		consola.success(`Deleted webhook #${webhook.id}: ${webhook.name}`);
	},
});

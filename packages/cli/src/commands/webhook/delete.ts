import type { BacklogWebhook } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

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
		yes: {
			type: "boolean",
			alias: "y",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const proceed = await confirmOrExit(`Are you sure you want to delete webhook ${args.id}?`, args.yes);
		if (!proceed) return;

		const webhook = await client<BacklogWebhook>(`/projects/${project}/webhooks/${args.id}`, {
			method: "DELETE",
		});

		consola.success(`Deleted webhook #${webhook.id}: ${webhook.name}`);
	},
});

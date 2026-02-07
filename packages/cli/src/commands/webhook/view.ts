import type { BacklogWebhook } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "view",
		description: "View a webhook",
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
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const webhook = await client<BacklogWebhook>(
			`/projects/${project}/webhooks/${args.id}`,
		);

		consola.log("");
		consola.log(`  ${webhook.name}`);
		consola.log("");
		consola.log(`    ID:              ${webhook.id}`);
		consola.log(`    Hook URL:        ${webhook.hookUrl}`);
		consola.log(`    All Events:      ${webhook.allEvent ? "Yes" : "No"}`);

		if (!webhook.allEvent && webhook.activityTypeIds.length > 0) {
			consola.log(`    Activity Types:  ${webhook.activityTypeIds.join(", ")}`);
		}

		if (webhook.description) {
			consola.log(`    Description:     ${webhook.description}`);
		}

		consola.log(`    Created by:      ${webhook.createdUser.name}`);
		consola.log(`    Created:         ${formatDate(webhook.created)}`);
		consola.log(`    Updated:         ${formatDate(webhook.updated)}`);
		consola.log("");
	},
});

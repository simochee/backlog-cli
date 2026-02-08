import type { BacklogWebhook } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View a webhook",
	},
	args: {
		...outputArgs,
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

		const webhook = await client<BacklogWebhook>(`/projects/${project}/webhooks/${args.id}`);

		outputResult(webhook, args, (data) => {
			consola.log("");
			consola.log(`  ${data.name}`);
			consola.log("");
			consola.log(`    ID:              ${data.id}`);
			consola.log(`    Hook URL:        ${data.hookUrl}`);
			consola.log(`    All Events:      ${data.allEvent ? "Yes" : "No"}`);

			if (!data.allEvent && data.activityTypeIds.length > 0) {
				consola.log(`    Activity Types:  ${data.activityTypeIds.join(", ")}`);
			}

			if (data.description) {
				consola.log(`    Description:     ${data.description}`);
			}

			consola.log(`    Created by:      ${data.createdUser.name}`);
			consola.log(`    Created:         ${formatDate(data.created)}`);
			consola.log(`    Updated:         ${formatDate(data.updated)}`);
			consola.log("");
		});
	},
});

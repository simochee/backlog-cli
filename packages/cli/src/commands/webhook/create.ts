import type { BacklogWebhook } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import promptRequired from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a webhook",
	},
	args: {
		...outputArgs,
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		name: {
			type: "string",
			alias: "n",
			description: "Webhook name",
		},
		"hook-url": {
			type: "string",
			description: "Notification URL",
		},
		description: {
			type: "string",
			alias: "d",
			description: "Description",
		},
		"all-event": {
			type: "boolean",
			description: "Target all events",
		},
		"activity-type-ids": {
			type: "string",
			description: "Activity type IDs (comma-separated)",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const name = await promptRequired("Webhook name:", args.name);
		const hookUrl = await promptRequired("Hook URL:", args["hook-url"]);

		const body = new URLSearchParams();
		body.append("name", name);
		body.append("hookUrl", hookUrl);

		if (args.description) {
			body.append("description", args.description);
		}

		if (args["all-event"]) {
			body.append("allEvent", "true");
		}

		if (args["activity-type-ids"]) {
			for (const id of args["activity-type-ids"].split(",")) {
				body.append("activityTypeIds[]", id.trim());
			}
		}

		const webhook = await client<BacklogWebhook>(`/projects/${project}/webhooks`, {
			method: "POST",
			body,
		});

		outputResult(webhook, args, (data) => {
			consola.success(`Created webhook #${data.id}: ${data.name}`);
		});
	},
});

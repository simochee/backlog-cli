import type { BacklogWebhook } from "@repo/api";
import type { WebhooksUpdateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit a webhook",
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

		const body: WebhooksUpdateData["body"] & Record<string, unknown> = {};

		if (args.name) {
			body.name = args.name;
		}

		if (args["hook-url"]) {
			body.hookUrl = args["hook-url"];
		}

		if (args.description) {
			body.description = args.description;
		}

		if (args["all-event"] !== undefined) {
			body.allEvent = args["all-event"];
		}

		if (args["activity-type-ids"]) {
			body["activityTypeIds[]"] = args["activity-type-ids"].split(",").map((id) => Number.parseInt(id.trim(), 10));
		}

		const webhook = await client<BacklogWebhook>(`/projects/${project}/webhooks/${args.id}`, {
			method: "PATCH",
			body,
		});

		consola.success(`Updated webhook #${webhook.id}: ${webhook.name}`);
	},
});

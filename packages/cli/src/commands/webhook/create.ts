import type { BacklogWebhook } from "@repo/api";
import type { WebhooksCreateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a webhook",
	},
	args: {
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

		const body: WebhooksCreateData["body"] & Record<string, unknown> = {
			name,
			hookUrl,
		};

		if (args.description) {
			body.description = args.description;
		}

		if (args["all-event"]) {
			body.allEvent = true;
		}

		if (args["activity-type-ids"]) {
			body["activityTypeIds[]"] = args["activity-type-ids"].split(",").map((id) => Number.parseInt(id.trim(), 10));
		}

		const webhook = await client<BacklogWebhook>(`/projects/${project}/webhooks`, {
			method: "POST",
			body,
		});

		consola.success(`Created webhook #${webhook.id}: ${webhook.name}`);
	},
});

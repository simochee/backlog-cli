import type { BacklogWebhook } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a webhook",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
			required: true,
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
		const { client } = await getClient();

		let name = args.name;
		let hookUrl = args["hook-url"];

		if (!name) {
			name = await consola.prompt("Webhook name:", { type: "text" });
			if (typeof name !== "string" || !name) {
				consola.error("Webhook name is required.");
				return process.exit(1);
			}
		}

		if (!hookUrl) {
			hookUrl = await consola.prompt("Hook URL:", { type: "text" });
			if (typeof hookUrl !== "string" || !hookUrl) {
				consola.error("Hook URL is required.");
				return process.exit(1);
			}
		}

		const body: Record<string, unknown> = { name, hookUrl };

		if (args.description) {
			body.description = args.description;
		}

		if (args["all-event"]) {
			body.allEvent = true;
		}

		if (args["activity-type-ids"]) {
			body["activityTypeIds[]"] = args["activity-type-ids"]
				.split(",")
				.map((id) => Number.parseInt(id.trim(), 10));
		}

		const webhook = await client<BacklogWebhook>(
			`/projects/${args.project}/webhooks`,
			{
				method: "POST",
				body,
			},
		);

		consola.success(`Created webhook #${webhook.id}: ${webhook.name}`);
	},
});

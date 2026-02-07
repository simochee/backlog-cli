import { type BacklogNotification } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatNotificationLine, padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List notifications",
	},
	args: {
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
		"min-id": {
			type: "string",
			description: "Minimum notification ID",
		},
		"max-id": {
			type: "string",
			description: "Maximum notification ID",
		},
		order: {
			type: "string",
			description: "Sort order: asc or desc",
			default: "desc",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const query: Record<string, unknown> = {
			count: Number.parseInt(args.limit, 10),
			order: args.order,
		};

		if (args["min-id"]) {
			query.minId = Number.parseInt(args["min-id"], 10);
		}
		if (args["max-id"]) {
			query.maxId = Number.parseInt(args["max-id"], 10);
		}

		const notifications = await client<BacklogNotification[]>(
			"/notifications",
			{ query },
		);

		if (notifications.length === 0) {
			consola.info("No notifications found.");
			return;
		}

		const header = `  ${padEnd("ID", 12)}${padEnd("REASON", 18)}${padEnd("FROM", 14)}SUMMARY`;
		consola.log(header);
		for (const notification of notifications) {
			consola.log(formatNotificationLine(notification));
		}
	},
});

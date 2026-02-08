import type { BacklogNotificationCount } from "@repo/api";
import type { NotificationsCountData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "count",
		description: "Show unread notification count",
	},
	args: {
		...outputArgs,
		"already-read": {
			type: "boolean",
			description: "Include already read notifications",
		},
		"resource-already-read": {
			type: "boolean",
			description: "Include resource already read notifications",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const query: NonNullable<NotificationsCountData["query"]> = {};

		if (args["already-read"]) {
			query.alreadyRead = true;
		}
		if (args["resource-already-read"]) {
			query.resourceAlreadyRead = true;
		}

		const result = await client<BacklogNotificationCount>("/notifications/count", { query });

		outputResult(result, args, (data) => {
			consola.log(`${data.count} notification(s)`);
		});
	},
});

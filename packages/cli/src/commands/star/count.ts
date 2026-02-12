import type { BacklogStarCount, BacklogUser } from "@repo/api";
import type { UsersGetStarsCountData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "count",
		description: "Show star count",
	},
	args: {
		...outputArgs,
		"user-id": {
			type: "positional",
			description: "User ID (omit for yourself)",
			required: false,
		},
		since: {
			type: "string",
			description: "Start date (yyyy-MM-dd)",
		},
		until: {
			type: "string",
			description: "End date (yyyy-MM-dd)",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		let userId = args["user-id"];
		if (!userId) {
			const me = await client<BacklogUser>("/users/myself");
			userId = `${me.id}`;
		}

		const query: NonNullable<UsersGetStarsCountData["query"]> = {};

		if (args.since) {
			query.since = args.since;
		}
		if (args.until) {
			query.until = args.until;
		}

		const result = await client<BacklogStarCount>(`/users/${userId}/stars/count`, { query });

		outputResult(result, args, (data) => {
			consola.log(`${data.count} star(s)`);
		});
	},
});

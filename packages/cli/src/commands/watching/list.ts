import { type BacklogUser, type BacklogWatching } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate, padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List watchings",
	},
	args: {
		"user-id": {
			type: "positional",
			description: "User ID (omit for yourself)",
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
		order: {
			type: "string",
			description: "Sort order: asc or desc",
			default: "desc",
		},
		sort: {
			type: "string",
			description: "Sort key",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		let userId = args["user-id"];
		if (!userId) {
			const me = await client<BacklogUser>("/users/myself");
			userId = `${me.id}`;
		}

		const query: Record<string, unknown> = {
			count: Number.parseInt(args.limit, 10),
			order: args.order,
		};

		if (args.sort) {
			query.sort = args.sort;
		}

		const watchings = await client<BacklogWatching[]>(
			`/users/${userId}/watchings`,
			{ query },
		);

		if (watchings.length === 0) {
			consola.info("No watchings found.");
			return;
		}

		const header = `${padEnd("ID", 10)}${padEnd("ISSUE", 16)}${padEnd("UPDATED", 12)}READ`;
		consola.log(header);
		for (const watching of watchings) {
			const id = padEnd(`${watching.id}`, 10);
			const issue = padEnd(watching.issue?.issueKey ?? "-", 16);
			const updated = padEnd(formatDate(watching.updated), 12);
			const read = watching.resourceAlreadyRead ? "Yes" : "No";
			consola.log(`${id}${issue}${updated}${read}`);
		}
	},
});

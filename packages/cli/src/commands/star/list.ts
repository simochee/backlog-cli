import type { BacklogStar, BacklogUser } from "@repo/api";
import type { UsersGetStarsData } from "@repo/openapi-client";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate, padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List stars",
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
	},
	async run({ args }) {
		const { client } = await getClient();

		let userId = args["user-id"];
		if (!userId) {
			const me = await client<BacklogUser>("/users/myself");
			userId = `${me.id}`;
		}

		const query: NonNullable<UsersGetStarsData["query"]> = {
			count: Number.parseInt(args.limit, 10),
			order: args.order as NonNullable<UsersGetStarsData["query"]>["order"],
		};

		const stars = await client<BacklogStar[]>(`/users/${userId}/stars`, {
			query,
		});

		if (stars.length === 0) {
			consola.info("No stars found.");
			return;
		}

		const header = `${padEnd("ID", 10)}${padEnd("TITLE", 40)}${padEnd("PRESENTER", 16)}DATE`;
		consola.log(header);
		for (const star of stars) {
			const id = padEnd(`${star.id}`, 10);
			const title = padEnd(star.title, 40);
			const presenter = padEnd(star.presenter.name, 16);
			const date = formatDate(star.created);
			consola.log(`${id}${title}${presenter}${date}`);
		}
	},
});

import type { BacklogTeam } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List teams",
	},
	args: {
		order: {
			type: "string",
			description: "Sort order: asc or desc",
			default: "desc",
		},
		offset: {
			type: "string",
			description: "Offset for pagination",
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const query: Record<string, unknown> = {
			order: args.order,
			count: Number.parseInt(args.limit, 10),
		};

		if (args.offset) {
			query.offset = Number.parseInt(args.offset, 10);
		}

		const teams = await client<BacklogTeam[]>("/teams", { query });

		if (teams.length === 0) {
			consola.info("No teams found.");
			return;
		}

		const header = `${padEnd("ID", 10)}${padEnd("NAME", 30)}MEMBERS`;
		consola.log(header);
		for (const team of teams) {
			const id = padEnd(`${team.id}`, 10);
			const name = padEnd(team.name, 30);
			const members = team.members.length;
			consola.log(`${id}${name}${members}`);
		}
	},
});

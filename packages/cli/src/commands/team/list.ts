import type { BacklogTeam } from "@repo/api";
import type { TeamsListData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { padEnd } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "list",
		description: "List teams",
	},
	args: {
		...outputArgs,
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

		const query: NonNullable<TeamsListData["query"]> = {
			order: args.order as NonNullable<TeamsListData["query"]>["order"],
			count: Number.parseInt(args.limit, 10),
		};

		if (args.offset) {
			query.offset = Number.parseInt(args.offset, 10);
		}

		const teams = await client<BacklogTeam[]>("/teams", { query });

		outputResult(teams, args, (data) => {
			if (data.length === 0) {
				consola.info("No teams found.");
				return;
			}

			const header = `${padEnd("ID", 10)}${padEnd("NAME", 30)}MEMBERS`;
			consola.log(header);
			for (const team of data) {
				const id = padEnd(`${team.id}`, 10);
				const name = padEnd(team.name, 30);
				const members = team.members.length;
				consola.log(`${id}${name}${members}`);
			}
		});
	},
});

import type { BacklogTeam } from "@repo/api";
import type { TeamsUpdateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit a team",
	},
	args: {
		"team-id": {
			type: "positional",
			description: "Team ID",
			required: true,
		},
		name: {
			type: "string",
			alias: "n",
			description: "Team name",
		},
		members: {
			type: "string",
			description: "Member IDs (comma-separated)",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const body: TeamsUpdateData["body"] & Record<string, unknown> = {};

		if (args.name) {
			body.name = args.name;
		}
		if (args.members) {
			body["members[]"] = args.members.split(",").map((id) => Number.parseInt(id.trim(), 10));
		}

		const team = await client<BacklogTeam>(`/teams/${args["team-id"]}`, {
			method: "PATCH",
			body,
		});

		consola.success(`Updated team #${team.id}: ${team.name}`);
	},
});

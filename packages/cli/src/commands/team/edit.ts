import { type BacklogTeam } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

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

		const body: Record<string, unknown> = {};

		if (args.name) {
			body.name = args.name;
		}
		if (args.members) {
			body["members[]"] = args.members
				.split(",")
				.map((id) => Number.parseInt(id.trim(), 10));
		}

		const team = await client<BacklogTeam>(`/teams/${args["team-id"]}`, {
			method: "PATCH",
			body,
		});

		consola.success(`Updated team #${team.id}: ${team.name}`);
	},
});

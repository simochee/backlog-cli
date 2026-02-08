import type { BacklogTeam } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete a team",
	},
	args: {
		"team-id": {
			type: "positional",
			description: "Team ID",
			required: true,
		},
		confirm: {
			type: "boolean",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const proceed = await confirmOrExit(`Are you sure you want to delete team ${args["team-id"]}?`, args.confirm);
		if (!proceed) return;

		const team = await client<BacklogTeam>(`/teams/${args["team-id"]}`, {
			method: "DELETE",
		});

		consola.success(`Deleted team #${team.id}: ${team.name}`);
	},
});

import type { BacklogTeam } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

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

		if (!args.confirm) {
			const confirmed = await consola.prompt(
				`Are you sure you want to delete team ${args["team-id"]}?`,
				{ type: "confirm" },
			);
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		const team = await client<BacklogTeam>(`/teams/${args["team-id"]}`, {
			method: "DELETE",
		});

		consola.success(`Deleted team #${team.id}: ${team.name}`);
	},
});

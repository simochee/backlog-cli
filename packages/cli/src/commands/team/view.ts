import { type BacklogTeam } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "view",
		description: "View team details",
	},
	args: {
		"team-id": {
			type: "positional",
			description: "Team ID",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const team = await client<BacklogTeam>(`/teams/${args["team-id"]}`);

		consola.log("");
		consola.log(`  ${team.name}`);
		consola.log("");
		consola.log(`    ID:          ${team.id}`);
		consola.log(`    Created by:  ${team.createdUser.name}`);
		consola.log(`    Created:     ${formatDate(team.created)}`);
		consola.log(`    Updated:     ${formatDate(team.updated)}`);
		consola.log(`    Members:     ${team.members.length}`);

		if (team.members.length > 0) {
			consola.log("");
			consola.log("  Members:");
			for (const member of team.members) {
				consola.log(`    - ${member.name} (${member.userId})`);
			}
		}

		consola.log("");
	},
});

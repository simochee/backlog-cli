import type { BacklogTeam } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View team details",
	},
	args: {
		...outputArgs,
		"team-id": {
			type: "positional",
			description: "Team ID",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const team = await client<BacklogTeam>(`/teams/${args["team-id"]}`);

		outputResult(team, args, (data) => {
			consola.log("");
			consola.log(`  ${data.name}`);
			consola.log("");
			consola.log(`    ID:          ${data.id}`);
			consola.log(`    Created by:  ${data.createdUser.name}`);
			consola.log(`    Created:     ${formatDate(data.created)}`);
			consola.log(`    Updated:     ${formatDate(data.updated)}`);
			consola.log(`    Members:     ${data.members.length}`);

			if (data.members.length > 0) {
				consola.log("");
				consola.log("  Members:");
				for (const member of data.members) {
					consola.log(`    - ${member.name} (${member.userId})`);
				}
			}

			consola.log("");
		});
	},
});

import type { BacklogTeam } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import promptRequired from "#utils/prompt.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a team",
	},
	args: {
		...outputArgs,
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

		const name = await promptRequired("Team name:", args.name);

		const body = new URLSearchParams();
		body.append("name", name);

		if (args.members) {
			for (const id of args.members.split(",")) {
				body.append("members[]", id.trim());
			}
		}

		const team = await client<BacklogTeam>("/teams", {
			method: "POST",
			body,
		});

		outputResult(team, args, (data) => {
			consola.success(`Created team #${data.id}: ${data.name}`);
		});
	},
});

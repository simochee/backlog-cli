import type { BacklogTeam } from "@repo/api";
import type { TeamsCreateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a team",
	},
	args: {
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

		const body: TeamsCreateData["body"] & Record<string, unknown> = { name };

		if (args.members) {
			body["members[]"] = args.members.split(",").map((id) => Number.parseInt(id.trim(), 10));
		}

		const team = await client<BacklogTeam>("/teams", {
			method: "POST",
			body,
		});

		consola.success(`Created team #${team.id}: ${team.name}`);
	},
});

import type { BacklogTeam } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

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

		let name = args.name;

		if (!name) {
			name = await consola.prompt("Team name:", { type: "text" });
			if (typeof name !== "string" || !name) {
				consola.error("Team name is required.");
				return process.exit(1);
			}
		}

		const body: Record<string, unknown> = { name };

		if (args.members) {
			body["members[]"] = args.members
				.split(",")
				.map((id) => Number.parseInt(id.trim(), 10));
		}

		const team = await client<BacklogTeam>("/teams", {
			method: "POST",
			body,
		});

		consola.success(`Created team #${team.id}: ${team.name}`);
	},
});

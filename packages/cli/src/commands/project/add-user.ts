import type { BacklogUser } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "add-user",
		description: "Add a user to a project",
	},
	args: {
		"project-key": {
			type: "positional",
			description: "Project key",
			required: true,
		},
		"user-id": {
			type: "string",
			description: "User ID (numeric)",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const user = await client<BacklogUser>(
			`/projects/${args["project-key"]}/users`,
			{
				method: "POST",
				body: {
					userId: Number.parseInt(args["user-id"], 10),
				},
			},
		);

		consola.success(
			`Added user ${user.name} to project ${args["project-key"]}.`,
		);
	},
});

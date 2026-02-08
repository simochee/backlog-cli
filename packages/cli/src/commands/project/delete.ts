import type { BacklogProject } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete a project",
	},
	args: {
		"project-key": {
			type: "positional",
			description: "Project key",
			required: true,
		},
		confirm: {
			type: "boolean",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const proceed = await confirmOrExit(
			`Are you sure you want to delete project ${args["project-key"]}? This cannot be undone.`,
			args.confirm,
		);
		if (!proceed) return;

		const project = await client<BacklogProject>(`/projects/${args["project-key"]}`, {
			method: "DELETE",
		});

		consola.success(`Deleted project ${project.projectKey}: ${project.name}`);
	},
});

import type { BacklogProject } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

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

		if (!args.confirm) {
			const confirmed = await consola.prompt(
				`Are you sure you want to delete project ${args["project-key"]}? This cannot be undone.`,
				{ type: "confirm" },
			);
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		const project = await client<BacklogProject>(
			`/projects/${args["project-key"]}`,
			{
				method: "DELETE",
			},
		);

		consola.success(`Deleted project ${project.projectKey}: ${project.name}`);
	},
});

import type { BacklogMilestone } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete a milestone",
	},
	args: {
		id: {
			type: "positional",
			description: "Milestone ID",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		confirm: {
			type: "boolean",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		if (!args.confirm) {
			const confirmed = await consola.prompt(
				`Are you sure you want to delete milestone ${args.id}?`,
				{ type: "confirm" },
			);
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		const milestone = await client<BacklogMilestone>(
			`/projects/${project}/versions/${args.id}`,
			{
				method: "DELETE",
			},
		);

		consola.success(`Deleted milestone #${milestone.id}: ${milestone.name}`);
	},
});

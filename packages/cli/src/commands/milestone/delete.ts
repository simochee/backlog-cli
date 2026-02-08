import type { BacklogMilestone } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

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

		const proceed = await confirmOrExit(`Are you sure you want to delete milestone ${args.id}?`, args.confirm);
		if (!proceed) return;

		const milestone = await client<BacklogMilestone>(`/projects/${project}/versions/${args.id}`, {
			method: "DELETE",
		});

		consola.success(`Deleted milestone #${milestone.id}: ${milestone.name}`);
	},
});

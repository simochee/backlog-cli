import type { BacklogCategory } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete a category",
	},
	args: {
		id: {
			type: "positional",
			description: "Category ID",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		yes: {
			type: "boolean",
			alias: "y",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const proceed = await confirmOrExit(`Are you sure you want to delete category ${args.id}?`, args.yes);
		if (!proceed) return;

		const category = await client<BacklogCategory>(`/projects/${project}/categories/${args.id}`, {
			method: "DELETE",
		});

		consola.success(`Deleted category #${category.id}: ${category.name}`);
	},
});

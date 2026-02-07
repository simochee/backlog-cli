import type { BacklogCategory } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit a category",
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
		name: {
			type: "string",
			alias: "n",
			description: "Category name",
			required: true,
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const category = await client<BacklogCategory>(
			`/projects/${project}/categories/${args.id}`,
			{
				method: "PATCH",
				body: { name: args.name },
			},
		);

		consola.success(`Updated category #${category.id}: ${category.name}`);
	},
});

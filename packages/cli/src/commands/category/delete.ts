import type { BacklogCategory } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

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
				`Are you sure you want to delete category ${args.id}?`,
				{ type: "confirm" },
			);
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		const category = await client<BacklogCategory>(
			`/projects/${args.project}/categories/${args.id}`,
			{
				method: "DELETE",
			},
		);

		consola.success(`Deleted category #${category.id}: ${category.name}`);
	},
});

import type { BacklogCategory } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a category",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
			required: true,
		},
		name: {
			type: "string",
			alias: "n",
			description: "Category name",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		let name = args.name;

		if (!name) {
			name = await consola.prompt("Category name:", { type: "text" });
			if (typeof name !== "string" || !name) {
				consola.error("Category name is required.");
				return process.exit(1);
			}
		}

		const category = await client<BacklogCategory>(
			`/projects/${args.project}/categories`,
			{
				method: "POST",
				body: { name },
			},
		);

		consola.success(`Created category #${category.id}: ${category.name}`);
	},
});

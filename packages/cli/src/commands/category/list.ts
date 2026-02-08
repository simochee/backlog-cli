import type { BacklogCategory } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { padEnd } from "#utils/format.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "list",
		description: "List categories",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const categories = await client<BacklogCategory[]>(`/projects/${project}/categories`);

		if (categories.length === 0) {
			consola.info("No categories found.");
			return;
		}

		const header = `${padEnd("ID", 10)}NAME`;
		consola.log(header);
		for (const category of categories) {
			consola.log(`${padEnd(`${category.id}`, 10)}${category.name}`);
		}
	},
});

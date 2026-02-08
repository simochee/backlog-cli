import type { BacklogRepository } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatRepositoryLine, padEnd } from "#utils/format.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "list",
		description: "List Git repositories",
	},
	args: {
		projectKey: {
			type: "positional",
			description: "Project key",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const repos = await client<BacklogRepository[]>(`/projects/${args.projectKey}/git/repositories`);

		if (repos.length === 0) {
			consola.info("No repositories found.");
			return;
		}

		const header = `${padEnd("NAME", 30)}DESCRIPTION`;
		consola.log(header);
		for (const repo of repos) {
			consola.log(formatRepositoryLine(repo));
		}
	},
});

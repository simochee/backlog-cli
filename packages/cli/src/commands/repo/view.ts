import type { BacklogRepository } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { repositoryUrl } from "#utils/url.ts";

export default defineCommand({
	meta: {
		name: "view",
		description: "View Git repository details",
	},
	args: {
		repoName: {
			type: "positional",
			description: "Repository name",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
			required: true,
		},
		web: {
			type: "boolean",
			description: "Open in browser",
		},
	},
	async run({ args }) {
		const { client, host } = await getClient();

		const repo = await client<BacklogRepository>(
			`/projects/${args.project}/git/repositories/${args.repoName}`,
		);

		if (args.web) {
			const url = repositoryUrl(host, args.project, repo.name);
			consola.info(`Opening ${url}`);
			Bun.spawn(["open", url]);
			return;
		}

		consola.log("");
		consola.log(`  ${repo.name}`);
		consola.log("");
		if (repo.description) {
			consola.log(`    Description: ${repo.description}`);
		}
		consola.log(`    HTTP URL:    ${repo.httpUrl}`);
		consola.log(`    SSH URL:     ${repo.sshUrl}`);
		consola.log(`    Created by:  ${repo.createdUser.name}`);
		consola.log(`    Created:     ${formatDate(repo.created)}`);
		consola.log(`    Updated:     ${formatDate(repo.updated)}`);
		if (repo.pushedAt) {
			consola.log(`    Last Push:   ${formatDate(repo.pushedAt)}`);
		}
		consola.log("");
	},
});

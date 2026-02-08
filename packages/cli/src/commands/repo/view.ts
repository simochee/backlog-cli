import type { BacklogRepository } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { openUrl, repositoryUrl } from "#utils/url.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View Git repository details",
	},
	args: {
		...outputArgs,
		repoName: {
			type: "positional",
			description: "Repository name",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		web: {
			type: "boolean",
			description: "Open in browser",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client, host } = await getClient();

		const repo = await client<BacklogRepository>(`/projects/${project}/git/repositories/${args.repoName}`);

		if (args.web) {
			const url = repositoryUrl(host, project, repo.name);
			consola.info(`Opening ${url}`);
			await openUrl(url);
			return;
		}

		outputResult(repo, args, (data) => {
			consola.log("");
			consola.log(`  ${data.name}`);
			consola.log("");
			if (data.description) {
				consola.log(`    Description: ${data.description}`);
			}
			consola.log(`    HTTP URL:    ${data.httpUrl}`);
			consola.log(`    SSH URL:     ${data.sshUrl}`);
			consola.log(`    Created by:  ${data.createdUser.name}`);
			consola.log(`    Created:     ${formatDate(data.created)}`);
			consola.log(`    Updated:     ${formatDate(data.updated)}`);
			if (data.pushedAt) {
				consola.log(`    Last Push:   ${formatDate(data.pushedAt)}`);
			}
			consola.log("");
		});
	},
});

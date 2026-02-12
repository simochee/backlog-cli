import type { BacklogPullRequest, BacklogPullRequestComment } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { openUrl, pullRequestUrl } from "#utils/url.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View pull request details",
	},
	args: {
		...outputArgs,
		number: {
			type: "positional",
			description: "Pull request number",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		repo: {
			type: "string",
			alias: "R",
			description: "Repository name",
			required: true,
		},
		comments: {
			type: "boolean",
			description: "Include comments",
		},
		web: {
			type: "boolean",
			description: "Open in browser",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client, host } = await getClient();

		const basePath = `/projects/${project}/git/repositories/${args.repo}/pullRequests`;
		const pr = await client<BacklogPullRequest>(`${basePath}/${args.number}`);

		if (args.web) {
			const url = pullRequestUrl(host, project, args.repo, pr.number);
			consola.info(`Opening ${url}`);
			await openUrl(url);
			return;
		}

		const comments = args.comments
			? await client<BacklogPullRequestComment[]>(`${basePath}/${args.number}/comments`)
			: [];

		outputResult(pr, args, (data) => {
			consola.log("");
			consola.log(`  #${data.number}: ${data.summary}`);
			consola.log("");
			consola.log(`    Status:      ${data.status.name}`);
			consola.log(`    Branch:      ${data.branch} → ${data.base}`);
			consola.log(`    Assignee:    ${data.assignee?.name ?? "Unassigned"}`);
			consola.log(`    Created by:  ${data.createdUser.name}`);
			consola.log(`    Created:     ${formatDate(data.created)}`);
			consola.log(`    Updated:     ${formatDate(data.updated)}`);

			if (data.issue) {
				consola.log(`    Issue:       ${data.issue.issueKey}: ${data.issue.summary}`);
			}
			if (data.mergeAt) {
				consola.log(`    Merged at:   ${formatDate(data.mergeAt)}`);
			}
			if (data.closeAt) {
				consola.log(`    Closed at:   ${formatDate(data.closeAt)}`);
			}

			if (data.description) {
				consola.log("");
				consola.log("  Description:");
				consola.log(
					data.description
						.split("\n")
						.map((line: string) => `    ${line}`)
						.join("\n"),
				);
			}

			if (comments.length > 0) {
				consola.log("");
				consola.log("  Comments:");
				for (const comment of comments) {
					if (!comment.content) continue;
					consola.log("");
					consola.log(`    ${comment.createdUser.name} (${formatDate(comment.created)}):`);
					consola.log(
						comment.content
							.split("\n")
							.map((line: string) => `      ${line}`)
							.join("\n"),
					);
				}
			}

			consola.log("");
		});
	},
});

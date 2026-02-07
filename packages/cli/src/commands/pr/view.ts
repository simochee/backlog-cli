import type { BacklogPullRequest, BacklogPullRequestComment } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { pullRequestUrl } from "#utils/url.ts";

export default defineCommand({
	meta: {
		name: "view",
		description: "View pull request details",
	},
	args: {
		number: {
			type: "positional",
			description: "Pull request number",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
			required: true,
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
		const { client, host } = await getClient();

		const basePath = `/projects/${args.project}/git/repositories/${args.repo}/pullRequests`;
		const pr = await client<BacklogPullRequest>(`${basePath}/${args.number}`);

		if (args.web) {
			const url = pullRequestUrl(host, args.project, args.repo, pr.number);
			consola.info(`Opening ${url}`);
			Bun.spawn(["open", url]);
			return;
		}

		consola.log("");
		consola.log(`  #${pr.number}: ${pr.summary}`);
		consola.log("");
		consola.log(`    Status:      ${pr.status.name}`);
		consola.log(`    Branch:      ${pr.branch} → ${pr.base}`);
		consola.log(`    Assignee:    ${pr.assignee?.name ?? "Unassigned"}`);
		consola.log(`    Created by:  ${pr.createdUser.name}`);
		consola.log(`    Created:     ${formatDate(pr.created)}`);
		consola.log(`    Updated:     ${formatDate(pr.updated)}`);

		if (pr.issue) {
			consola.log(`    Issue:       ${pr.issue.issueKey}: ${pr.issue.summary}`);
		}
		if (pr.mergeAt) {
			consola.log(`    Merged at:   ${formatDate(pr.mergeAt)}`);
		}
		if (pr.closeAt) {
			consola.log(`    Closed at:   ${formatDate(pr.closeAt)}`);
		}

		if (pr.description) {
			consola.log("");
			consola.log("  Description:");
			consola.log(
				pr.description
					.split("\n")
					.map((line: string) => `    ${line}`)
					.join("\n"),
			);
		}

		if (args.comments) {
			const comments = await client<BacklogPullRequestComment[]>(
				`${basePath}/${args.number}/comments`,
			);

			if (comments.length > 0) {
				consola.log("");
				consola.log("  Comments:");
				for (const comment of comments) {
					if (!comment.content) continue;
					consola.log("");
					consola.log(
						`    ${comment.createdUser.name} (${formatDate(comment.created)}):`,
					);
					consola.log(
						comment.content
							.split("\n")
							.map((line: string) => `      ${line}`)
							.join("\n"),
					);
				}
			}
		}

		consola.log("");
	},
});

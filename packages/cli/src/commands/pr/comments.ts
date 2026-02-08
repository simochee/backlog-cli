import type { BacklogPullRequestComment } from "@repo/api";
import type { PullRequestCommentsListData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "comments",
		description: "List pull request comments",
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
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const query: NonNullable<PullRequestCommentsListData["query"]> = {
			count: Number.parseInt(args.limit, 10),
		};

		const comments = await client<BacklogPullRequestComment[]>(
			`/projects/${project}/git/repositories/${args.repo}/pullRequests/${args.number}/comments`,
			{ query },
		);

		outputResult(comments, args, (data) => {
			if (data.length === 0) {
				consola.info("No comments found.");
				return;
			}

			for (const comment of data) {
				if (!comment.content) continue;
				consola.log("");
				consola.log(`  ${comment.createdUser.name} (${formatDate(comment.created)}):`);
				consola.log(
					comment.content
						.split("\n")
						.map((line: string) => `    ${line}`)
						.join("\n"),
				);
			}
			consola.log("");
		});
	},
});

import type { BacklogPullRequestComment } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "comments",
		description: "List pull request comments",
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
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const query: Record<string, unknown> = {
			count: Number.parseInt(args.limit, 10),
		};

		const comments = await client<BacklogPullRequestComment[]>(
			`/projects/${args.project}/git/repositories/${args.repo}/pullRequests/${args.number}/comments`,
			{ query },
		);

		if (comments.length === 0) {
			consola.info("No comments found.");
			return;
		}

		for (const comment of comments) {
			if (!comment.content) continue;
			consola.log("");
			consola.log(
				`  ${comment.createdUser.name} (${formatDate(comment.created)}):`,
			);
			consola.log(
				comment.content
					.split("\n")
					.map((line: string) => `    ${line}`)
					.join("\n"),
			);
		}
		consola.log("");
	},
});

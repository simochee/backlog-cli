import { type BacklogPullRequestComment } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "comment",
		description: "Add a comment to a pull request",
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
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		repo: {
			type: "string",
			alias: "R",
			description: "Repository name",
			required: true,
		},
		body: {
			type: "string",
			alias: "b",
			description: 'Comment body (use "-" for stdin)',
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		let content = args.body;

		// Read from stdin if "-"
		if (content === "-") {
			const chunks: Uint8Array[] = [];
			for await (const chunk of process.stdin) {
				chunks.push(chunk);
			}
			content = Buffer.concat(chunks).toString("utf-8").trim();
		}

		// Prompt for body if not provided
		if (!content) {
			content = await promptRequired("Comment body:");
		}

		const comment = await client<BacklogPullRequestComment>(
			`/projects/${project}/git/repositories/${args.repo}/pullRequests/${args.number}/comments`,
			{
				method: "POST",
				body: { content },
			},
		);

		consola.success(
			`Added comment to PR #${args.number} by ${comment.createdUser.name}`,
		);
	},
});

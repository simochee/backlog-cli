import type { BacklogPullRequest } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "close",
		description: "Close a pull request",
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
		comment: {
			type: "string",
			alias: "c",
			description: "Close comment",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const body: Record<string, unknown> = {
			statusId: 2, // Closed
		};

		if (args.comment) {
			body.comment = args.comment;
		}

		const pr = await client<BacklogPullRequest>(
			`/projects/${args.project}/git/repositories/${args.repo}/pullRequests/${args.number}`,
			{
				method: "PATCH",
				body,
			},
		);

		consola.success(`Closed PR #${pr.number}: ${pr.summary}`);
	},
});

import type { BacklogPullRequest } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "reopen",
		description: "Reopen a closed pull request",
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
	},
	async run({ args }) {
		const { client } = await getClient();

		const pr = await client<BacklogPullRequest>(
			`/projects/${args.project}/git/repositories/${args.repo}/pullRequests/${args.number}`,
			{
				method: "PATCH",
				body: {
					statusId: 1, // Open
				},
			},
		);

		consola.success(`Reopened PR #${pr.number}: ${pr.summary}`);
	},
});

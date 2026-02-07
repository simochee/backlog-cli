import { type BacklogPullRequest, PR_STATUS } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

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
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		repo: {
			type: "string",
			alias: "R",
			description: "Repository name",
			required: true,
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const pr = await client<BacklogPullRequest>(
			`/projects/${project}/git/repositories/${args.repo}/pullRequests/${args.number}`,
			{
				method: "PATCH",
				body: {
					statusId: PR_STATUS.Open,
				},
			},
		);

		consola.success(`Reopened PR #${pr.number}: ${pr.summary}`);
	},
});

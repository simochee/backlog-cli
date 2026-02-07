import { type BacklogPullRequest, PR_STATUS } from "@repo/api";
import type { PullRequestsUpdateData } from "@repo/openapi-client";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

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
			description: "Project key (env: BACKLOG_PROJECT)",
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
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const body: PullRequestsUpdateData["body"] & { statusId: number } = {
			statusId: PR_STATUS.Closed,
		};

		if (args.comment) {
			body.comment = args.comment;
		}

		const pr = await client<BacklogPullRequest>(
			`/projects/${project}/git/repositories/${args.repo}/pullRequests/${args.number}`,
			{
				method: "PATCH",
				body,
			},
		);

		consola.success(`Closed PR #${pr.number}: ${pr.summary}`);
	},
});

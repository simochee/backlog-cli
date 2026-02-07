import type { BacklogPullRequest } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveUserId } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit a pull request",
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
		title: {
			type: "string",
			alias: "t",
			description: "PR title",
		},
		body: {
			type: "string",
			alias: "b",
			description: "PR description",
		},
		assignee: {
			type: "string",
			alias: "a",
			description: "Assignee (username or @me)",
		},
		issue: {
			type: "string",
			description: "Related issue key",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const body: Record<string, unknown> = {};

		if (args.title) {
			body.summary = args.title;
		}
		if (args.body) {
			body.description = args.body;
		}
		if (args.assignee) {
			body.assigneeId = await resolveUserId(client, args.assignee);
		}
		if (args.issue) {
			const issue = await client<{ id: number }>(`/issues/${args.issue}`);
			body.issueId = issue.id;
		}

		const pr = await client<BacklogPullRequest>(
			`/projects/${args.project}/git/repositories/${args.repo}/pullRequests/${args.number}`,
			{
				method: "PATCH",
				body,
			},
		);

		consola.success(`Updated PR #${pr.number}: ${pr.summary}`);
	},
});

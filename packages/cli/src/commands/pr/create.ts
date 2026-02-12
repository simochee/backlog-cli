import type { BacklogPullRequest } from "@repo/api";
import type { PullRequestsCreateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import promptRequired from "#utils/prompt.ts";
import { resolveProjectArg, resolveUserId } from "#utils/resolve.ts";
import { openUrl, pullRequestUrl } from "#utils/url.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a pull request",
	},
	args: {
		...outputArgs,
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
		base: {
			type: "string",
			alias: "B",
			description: "Base branch (merge target)",
		},
		branch: {
			type: "string",
			description: "Source branch",
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
		web: {
			type: "boolean",
			description: "Open in browser after creation",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client, host } = await getClient();

		// Prompt for required fields if not provided
		const title = await promptRequired("PR title:", args.title);
		const base = await promptRequired("Base branch:", args.base);
		const branch = await promptRequired("Source branch:", args.branch);

		const body: PullRequestsCreateData["body"] = {
			summary: title,
			description: args.body ?? "",
			base,
			branch,
		};

		if (args.assignee) {
			body.assigneeId = await resolveUserId(client, args.assignee);
		}

		if (args.issue) {
			const issue = await client<{ id: number }>(`/issues/${args.issue}`);
			body.issueId = issue.id;
		}

		const pr = await client<BacklogPullRequest>(`/projects/${project}/git/repositories/${args.repo}/pullRequests`, {
			method: "POST",
			body,
		});

		outputResult(pr, args, (data) => {
			consola.success(`Created PR #${data.number}: ${data.summary}`);
		});

		if (args.web) {
			const url = pullRequestUrl(host, project, args.repo, pr.number);
			consola.info(`Opening ${url}`);
			await openUrl(url);
		}
	},
});

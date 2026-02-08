import type { PullRequestStatusType, PullRequestsListData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { formatPullRequestLine, padEnd } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { resolveProjectArg, resolveUserId } from "#utils/resolve.ts";
import { type BacklogPullRequest, PR_STATUS } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "list",
		description: "List pull requests",
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
		status: {
			type: "string",
			alias: "S",
			description: "Status: open, closed, merged (comma-separated)",
			default: "open",
		},
		assignee: {
			type: "string",
			alias: "a",
			description: "Assignee (username or @me)",
		},
		"created-by": {
			type: "string",
			description: "Created by (username or @me)",
		},
		issue: {
			type: "string",
			description: "Related issue key",
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results (1-100)",
			default: "20",
		},
		offset: {
			type: "string",
			description: "Offset for pagination",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const count = Number.parseInt(args.limit, 10);
		if (Number.isNaN(count) || count < 1 || count > 100) {
			consola.error("--limit must be a number between 1 and 100.");
			return process.exit(1);
		}

		const query: NonNullable<PullRequestsListData["query"]> & Record<string, unknown> = { count };

		if (args.offset) {
			const offset = Number.parseInt(args.offset, 10);
			if (Number.isNaN(offset) || offset < 0) {
				consola.error("--offset must be a non-negative number.");
				return process.exit(1);
			}
			query.offset = offset;
		}

		// Resolve status names to IDs
		if (args.status) {
			const statusMap: Record<string, PullRequestStatusType> = {
				open: PR_STATUS.Open as PullRequestStatusType,
				closed: PR_STATUS.Closed as PullRequestStatusType,
				merged: PR_STATUS.Merged as PullRequestStatusType,
			};
			const statuses = args.status.split(",").map((s) => s.trim());
			query["statusId[]"] = statuses.map((s) => {
				const id = statusMap[s.toLowerCase()];
				if (!id) throw new Error(`Invalid PR status "${s}". Available: open, closed, merged`);
				return id;
			});
		}

		if (args.assignee) {
			const userId = await resolveUserId(client, args.assignee);
			query["assigneeId[]"] = [userId];
		}

		if (args["created-by"]) {
			const userId = await resolveUserId(client, args["created-by"]);
			query["createdUserId[]"] = [userId];
		}

		if (args.issue) {
			const issue = await client<{ id: number }>(`/issues/${args.issue}`);
			query["issueId[]"] = [issue.id];
		}

		const prs = await client<BacklogPullRequest[]>(`/projects/${project}/git/repositories/${args.repo}/pullRequests`, {
			query,
		});

		outputResult(prs, args, (data) => {
			if (data.length === 0) {
				consola.info("No pull requests found.");
				return;
			}

			const header = `${padEnd("#", 8)}${padEnd("STATUS", 10)}${padEnd("ASSIGNEE", 14)}${padEnd("BRANCH", 30)}SUMMARY`;
			consola.log(header);
			for (const pr of data) {
				consola.log(formatPullRequestLine(pr));
			}
		});
	},
});

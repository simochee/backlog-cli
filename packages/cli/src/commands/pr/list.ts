import type { BacklogPullRequest } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatPullRequestLine, padEnd } from "#utils/format.ts";
import { resolveUserId } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List pull requests",
	},
	args: {
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
		const { client } = await getClient();

		const query: Record<string, unknown> = {
			count: Number.parseInt(args.limit, 10),
		};

		if (args.offset) {
			query.offset = Number.parseInt(args.offset, 10);
		}

		// Resolve status names to IDs
		if (args.status) {
			const statusMap: Record<string, number> = {
				open: 1,
				closed: 2,
				merged: 3,
			};
			const statuses = args.status.split(",").map((s) => s.trim());
			query["statusId[]"] = statuses.map((s) => {
				const id = statusMap[s.toLowerCase()];
				if (!id)
					throw new Error(
						`Invalid PR status "${s}". Available: open, closed, merged`,
					);
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

		const prs = await client<BacklogPullRequest[]>(
			`/projects/${args.project}/git/repositories/${args.repo}/pullRequests`,
			{ query },
		);

		if (prs.length === 0) {
			consola.info("No pull requests found.");
			return;
		}

		const header = `${padEnd("#", 8)}${padEnd("STATUS", 10)}${padEnd("ASSIGNEE", 14)}${padEnd("BRANCH", 30)}SUMMARY`;
		consola.log(header);
		for (const pr of prs) {
			consola.log(formatPullRequestLine(pr));
		}
	},
});

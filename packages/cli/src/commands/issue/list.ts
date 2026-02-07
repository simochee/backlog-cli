import type { BacklogIssue } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatIssueLine, padEnd } from "#utils/format.ts";
import {
	resolvePriorityId,
	resolveProjectId,
	resolveUserId,
} from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List issues",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description:
				"Project key (multiple allowed, comma-separated) (env: BACKLOG_PROJECT)",
		},
		assignee: {
			type: "string",
			alias: "a",
			description: "Assignee (username or @me)",
		},
		status: {
			type: "string",
			alias: "S",
			description: "Status name (multiple allowed, comma-separated)",
		},
		type: {
			type: "string",
			alias: "T",
			description: "Issue type name (multiple allowed, comma-separated)",
		},
		priority: {
			type: "string",
			alias: "P",
			description: "Priority name",
		},
		keyword: {
			type: "string",
			alias: "k",
			description: "Keyword search",
		},
		"created-since": {
			type: "string",
			description: "Created since (yyyy-MM-dd)",
		},
		"created-until": {
			type: "string",
			description: "Created until (yyyy-MM-dd)",
		},
		"updated-since": {
			type: "string",
			description: "Updated since (yyyy-MM-dd)",
		},
		"updated-until": {
			type: "string",
			description: "Updated until (yyyy-MM-dd)",
		},
		"due-since": {
			type: "string",
			description: "Due date since (yyyy-MM-dd)",
		},
		"due-until": {
			type: "string",
			description: "Due date until (yyyy-MM-dd)",
		},
		sort: {
			type: "string",
			description: "Sort key",
			default: "updated",
		},
		order: {
			type: "string",
			description: "Sort order: asc or desc",
			default: "desc",
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
			sort: args.sort,
			order: args.order,
		};

		if (args.offset) {
			query.offset = Number.parseInt(args.offset, 10);
		}

		if (args.keyword) {
			query.keyword = args.keyword;
		}

		// Resolve project keys to IDs
		const projectArg = args.project || process.env.BACKLOG_PROJECT;
		if (projectArg) {
			const keys = projectArg.split(",").map((k) => k.trim());
			const ids = await Promise.all(
				keys.map((key) => resolveProjectId(client, key)),
			);
			query["projectId[]"] = ids;
		}

		// Resolve assignee
		if (args.assignee) {
			const userId = await resolveUserId(client, args.assignee);
			query["assigneeId[]"] = [userId];
		}

		// Resolve priority
		if (args.priority) {
			const priorityId = await resolvePriorityId(client, args.priority);
			query["priorityId[]"] = [priorityId];
		}

		// Date filters
		if (args["created-since"]) query.createdSince = args["created-since"];
		if (args["created-until"]) query.createdUntil = args["created-until"];
		if (args["updated-since"]) query.updatedSince = args["updated-since"];
		if (args["updated-until"]) query.updatedUntil = args["updated-until"];
		if (args["due-since"]) query.dueDateSince = args["due-since"];
		if (args["due-until"]) query.dueDateUntil = args["due-until"];

		const issues = await client<BacklogIssue[]>("/issues", { query });

		if (issues.length === 0) {
			consola.info("No issues found.");
			return;
		}

		const header = `${padEnd("KEY", 16)}${padEnd("STATUS", 12)}${padEnd("TYPE", 12)}${padEnd("PRIORITY", 8)}${padEnd("ASSIGNEE", 14)}SUMMARY`;
		consola.log(header);
		for (const issue of issues) {
			consola.log(formatIssueLine(issue));
		}
	},
});

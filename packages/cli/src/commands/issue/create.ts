import type { BacklogIssue } from "@repo/api";
import type { IssuesCreateData } from "@repo/openapi-client";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import {
	resolveIssueTypeId,
	resolvePriorityId,
	resolveProjectId,
	resolveUserId,
} from "#utils/resolve.ts";
import { issueUrl, openUrl } from "#utils/url.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a new issue",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		title: {
			type: "string",
			alias: "t",
			description: "Issue summary",
		},
		description: {
			type: "string",
			alias: "d",
			description: 'Issue description (use "-" for stdin)',
		},
		type: {
			type: "string",
			alias: "T",
			description: "Issue type name",
		},
		priority: {
			type: "string",
			alias: "P",
			description: "Priority name",
		},
		assignee: {
			type: "string",
			alias: "a",
			description: "Assignee username",
		},
		"start-date": {
			type: "string",
			description: "Start date (yyyy-MM-dd)",
		},
		"due-date": {
			type: "string",
			description: "Due date (yyyy-MM-dd)",
		},
		web: {
			type: "boolean",
			description: "Open in browser after creation",
		},
	},
	async run({ args }) {
		const { client, host } = await getClient();

		// Resolve required fields — prompt interactively if missing
		const projectKey = await promptRequired(
			"Project key:",
			args.project || process.env.BACKLOG_PROJECT,
		);
		const title = await promptRequired("Issue title:", args.title);
		const typeName = await promptRequired("Issue type:", args.type);
		const priorityName = await promptRequired("Priority:", args.priority);

		// Resolve description from stdin if "-"
		let description = args.description;
		if (description === "-") {
			const chunks: Uint8Array[] = [];
			for await (const chunk of process.stdin) {
				chunks.push(chunk);
			}
			description = Buffer.concat(chunks).toString("utf-8").trim();
		}

		consola.start("Creating issue...");

		// Resolve names to IDs
		const [projectId, issueTypeId, priorityId] = await Promise.all([
			resolveProjectId(client, projectKey),
			resolveIssueTypeId(client, projectKey, typeName),
			resolvePriorityId(client, priorityName),
		]);

		const body: IssuesCreateData["body"] = {
			projectId,
			summary: title,
			issueTypeId,
			priorityId,
		};

		if (description) {
			body.description = description;
		}
		if (args.assignee) {
			body.assigneeId = await resolveUserId(client, args.assignee);
		}
		if (args["start-date"]) {
			body.startDate = args["start-date"];
		}
		if (args["due-date"]) {
			body.dueDate = args["due-date"];
		}

		const issue = await client<BacklogIssue>("/issues", {
			method: "POST",
			body,
		});

		consola.success(`Created ${issue.issueKey}: ${issue.summary}`);

		if (args.web) {
			const url = issueUrl(host, issue.issueKey);
			consola.info(`Opening ${url}`);
			await openUrl(url);
		}
	},
});

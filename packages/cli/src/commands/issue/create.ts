import type { BacklogIssue } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import {
	resolveIssueTypeId,
	resolvePriorityId,
	resolveProjectId,
	resolveUserId,
} from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a new issue",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
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
		let projectKey = args.project;
		if (!projectKey) {
			projectKey = await consola.prompt("Project key:", { type: "text" });
			if (typeof projectKey !== "string" || !projectKey) {
				consola.error("Project key is required.");
				return process.exit(1);
			}
		}

		let title = args.title;
		if (!title) {
			title = await consola.prompt("Issue title:", { type: "text" });
			if (typeof title !== "string" || !title) {
				consola.error("Issue title is required.");
				return process.exit(1);
			}
		}

		let typeName = args.type;
		if (!typeName) {
			typeName = await consola.prompt("Issue type:", { type: "text" });
			if (typeof typeName !== "string" || !typeName) {
				consola.error("Issue type is required.");
				return process.exit(1);
			}
		}

		let priorityName = args.priority;
		if (!priorityName) {
			priorityName = await consola.prompt("Priority:", { type: "text" });
			if (typeof priorityName !== "string" || !priorityName) {
				consola.error("Priority is required.");
				return process.exit(1);
			}
		}

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

		const body: Record<string, unknown> = {
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
			const url = `https://${host}/view/${issue.issueKey}`;
			consola.info(`Opening ${url}`);
			Bun.spawn(["open", url]);
		}
	},
});

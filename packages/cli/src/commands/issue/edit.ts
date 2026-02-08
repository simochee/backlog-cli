import type { BacklogIssue } from "@repo/api";
import type { IssuesUpdateData } from "@repo/openapi-client";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import {
	extractProjectKey,
	resolveIssueTypeId,
	resolvePriorityId,
	resolveStatusId,
	resolveUserId,
} from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit an existing issue",
	},
	args: {
		issueKey: {
			type: "positional",
			description: "Issue key (e.g., PROJECT-123)",
			required: true,
		},
		title: {
			type: "string",
			alias: "t",
			description: "Issue summary",
		},
		description: {
			type: "string",
			alias: "d",
			description: "Issue description",
		},
		status: {
			type: "string",
			alias: "S",
			description: "Status name",
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
		comment: {
			type: "string",
			alias: "c",
			description: "Update comment",
		},
	},
	async run({ args }) {
		const { client } = await getClient();
		const projectKey = extractProjectKey(args.issueKey);

		const body: IssuesUpdateData["body"] = {};

		if (args.title) {
			body.summary = args.title;
		}
		if (args.description) {
			body.description = args.description;
		}
		if (args.comment) {
			body.comment = args.comment;
		}

		// Resolve names to IDs in parallel where possible
		const resolutions: Promise<void>[] = [];

		if (args.status) {
			resolutions.push(
				resolveStatusId(client, projectKey, args.status).then((id) => {
					body.statusId = id;
				}),
			);
		}
		if (args.type) {
			resolutions.push(
				resolveIssueTypeId(client, projectKey, args.type).then((id) => {
					body.issueTypeId = id;
				}),
			);
		}
		if (args.priority) {
			resolutions.push(
				resolvePriorityId(client, args.priority).then((id) => {
					body.priorityId = id;
				}),
			);
		}
		if (args.assignee) {
			resolutions.push(
				resolveUserId(client, args.assignee).then((id) => {
					body.assigneeId = id;
				}),
			);
		}

		await Promise.all(resolutions);

		if (Object.keys(body).length === 0) {
			consola.warn("No changes specified.");
			return;
		}

		const issue = await client<BacklogIssue>(`/issues/${args.issueKey}`, {
			method: "PATCH",
			body,
		});

		consola.success(`Updated ${issue.issueKey}: ${issue.summary}`);
	},
});

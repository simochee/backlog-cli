import type { BacklogIssue } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import {
	extractProjectKey,
	resolveClosedStatusId,
	resolveResolutionId,
} from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "close",
		description: "Close an issue",
	},
	args: {
		issueKey: {
			type: "positional",
			description: "Issue key (e.g., PROJECT-123)",
			required: true,
		},
		comment: {
			type: "string",
			alias: "c",
			description: "Close comment",
		},
		resolution: {
			type: "string",
			alias: "r",
			description: "Resolution name",
			default: "完了",
		},
	},
	async run({ args }) {
		const { client } = await getClient();
		const projectKey = extractProjectKey(args.issueKey);

		const [statusId, resolutionId] = await Promise.all([
			resolveClosedStatusId(client, projectKey),
			resolveResolutionId(client, args.resolution),
		]);

		const body: Record<string, unknown> = {
			statusId,
			resolutionId,
		};

		if (args.comment) {
			body.comment = args.comment;
		}

		const issue = await client<BacklogIssue>(`/issues/${args.issueKey}`, {
			method: "PATCH",
			body,
		});

		consola.success(`Closed ${issue.issueKey}: ${issue.summary}`);
	},
});

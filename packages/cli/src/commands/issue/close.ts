import type { BacklogIssue } from "@repo/api";
import type { IssuesUpdateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { extractProjectKey, resolveClosedStatusId, resolveResolutionId } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

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
		},
	},
	async run({ args }) {
		const { client } = await getClient();
		const projectKey = extractProjectKey(args.issueKey);

		const statusId = await resolveClosedStatusId(client, projectKey);

		const body: IssuesUpdateData["body"] = { statusId };

		if (args.resolution) {
			body.resolutionId = await resolveResolutionId(client, args.resolution);
		}
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

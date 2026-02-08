import type { BacklogIssue } from "@repo/api";
import type { IssuesUpdateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { extractProjectKey, resolveOpenStatusId } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "reopen",
		description: "Reopen a closed issue",
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
			description: "Reopen comment",
		},
	},
	async run({ args }) {
		const { client } = await getClient();
		const projectKey = extractProjectKey(args.issueKey);

		const statusId = await resolveOpenStatusId(client, projectKey);

		const body: IssuesUpdateData["body"] = { statusId };

		if (args.comment) {
			body.comment = args.comment;
		}

		const issue = await client<BacklogIssue>(`/issues/${args.issueKey}`, {
			method: "PATCH",
			body,
		});

		consola.success(`Reopened ${issue.issueKey}: ${issue.summary}`);
	},
});

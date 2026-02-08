import type { BacklogIssueType } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete an issue type",
	},
	args: {
		id: {
			type: "positional",
			description: "Issue type ID",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		"substitute-issue-type-id": {
			type: "string",
			description: "Substitute issue type ID (required)",
			required: true,
		},
		confirm: {
			type: "boolean",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		if (!args.confirm) {
			const confirmed = await consola.prompt(`Are you sure you want to delete issue type ${args.id}?`, {
				type: "confirm",
			});
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		const issueType = await client<BacklogIssueType>(`/projects/${project}/issueTypes/${args.id}`, {
			method: "DELETE",
			body: {
				substituteIssueTypeId: Number.parseInt(args["substitute-issue-type-id"], 10),
			},
		});

		consola.success(`Deleted issue type #${issueType.id}: ${issueType.name}`);
	},
});

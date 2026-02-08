import type { BacklogIssue } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete an issue",
	},
	args: {
		issueKey: {
			type: "positional",
			description: "Issue key (e.g., PROJECT-123)",
			required: true,
		},
		yes: {
			type: "boolean",
			alias: "y",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const proceed = await confirmOrExit(
			`Are you sure you want to delete issue ${args.issueKey}? This cannot be undone.`,
			args.yes,
		);
		if (!proceed) return;

		const issue = await client<BacklogIssue>(`/issues/${args.issueKey}`, {
			method: "DELETE",
		});

		consola.success(`Deleted ${issue.issueKey}: ${issue.summary}`);
	},
});

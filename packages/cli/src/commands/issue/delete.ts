import type { BacklogIssue } from "@repo/api";

import { getClient } from "#utils/client.ts";
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

		if (!args.yes) {
			const confirmed = await consola.prompt(
				`Are you sure you want to delete issue ${args.issueKey}? This cannot be undone.`,
				{ type: "confirm" },
			);
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		const issue = await client<BacklogIssue>(`/issues/${args.issueKey}`, {
			method: "DELETE",
		});

		consola.success(`Deleted ${issue.issueKey}: ${issue.summary}`);
	},
});

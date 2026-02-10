import type { BacklogIssue, BacklogUser } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "status",
		description: "Show issue status summary for yourself",
	},
	args: {
		...outputArgs,
	},
	async run({ args }) {
		const { client } = await getClient();

		const me = await client<BacklogUser>("/users/myself");

		const issues = await client<BacklogIssue[]>("/issues", {
			query: {
				"assigneeId[]": [me.id],
				count: 100,
			},
		});

		if (issues.length === 0) {
			if (args.json !== undefined) {
				outputResult({ user: me, issues: [] }, args, () => {});
				return;
			}
			consola.info("No issues assigned to you.");
			return;
		}

		outputResult({ user: me, issues }, args, (data) => {
			// Group by status
			const grouped = new Map<string, BacklogIssue[]>();
			for (const issue of data.issues) {
				const name = issue.status.name;
				const list = grouped.get(name) ?? [];
				list.push(issue);
				grouped.set(name, list);
			}

			consola.log("");
			consola.log(`  Issues assigned to ${data.user.name}:`);
			consola.log("");

			for (const [statusName, statusIssues] of grouped) {
				consola.log(`  ${statusName} (${statusIssues.length}):`);
				for (const issue of statusIssues) {
					consola.log(`    ${issue.issueKey}  ${issue.summary}`);
				}
				consola.log("");
			}
		});
	},
});

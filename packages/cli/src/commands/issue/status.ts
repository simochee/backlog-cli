import { type BacklogIssue, type BacklogUser } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "status",
		description: "Show issue status summary for yourself",
	},
	args: {},
	async run() {
		const { client } = await getClient();

		const me = await client<BacklogUser>("/users/myself");

		const issues = await client<BacklogIssue[]>("/issues", {
			query: {
				"assigneeId[]": [me.id],
				count: 100,
			},
		});

		if (issues.length === 0) {
			consola.info("No issues assigned to you.");
			return;
		}

		// Group by status
		const grouped = new Map<string, BacklogIssue[]>();
		for (const issue of issues) {
			const { name } = issue.status;
			const list = grouped.get(name) ?? [];
			list.push(issue);
			grouped.set(name, list);
		}

		consola.log("");
		consola.log(`  Issues assigned to ${me.name}:`);
		consola.log("");

		for (const [statusName, statusIssues] of grouped) {
			consola.log(`  ${statusName} (${statusIssues.length}):`);
			for (const issue of statusIssues) {
				consola.log(`    ${issue.issueKey}  ${issue.summary}`);
			}
			consola.log("");
		}
	},
});

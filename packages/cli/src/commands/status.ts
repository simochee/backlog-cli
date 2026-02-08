import type { BacklogIssue, BacklogNotificationCount, BacklogUser } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "status",
		description: "Show your dashboard summary",
	},
	args: {
		...outputArgs,
	},
	async run({ args }) {
		const { client } = await getClient();

		const me = await client<BacklogUser>("/users/myself");

		const [issues, notificationCount, recentIssues] = await Promise.all([
			client<BacklogIssue[]>("/issues", {
				query: {
					"assigneeId[]": [me.id],
					count: 100,
				},
			}),
			client<BacklogNotificationCount>("/notifications/count"),
			client<{ issue: BacklogIssue }[]>("/users/myself/recentlyViewedIssues", {
				query: { count: 5 },
			}),
		]);

		const dashboard = { user: me, issues, notificationCount, recentIssues };

		outputResult(dashboard, args, (data) => {
			consola.log("");
			consola.log(`  Dashboard for ${data.user.name}`);
			consola.log("");

			// Notification summary
			consola.log(`  Unread notifications: ${data.notificationCount.count}`);
			consola.log("");

			// Assigned issues by status
			if (data.issues.length > 0) {
				const grouped = new Map<string, BacklogIssue[]>();
				for (const issue of data.issues) {
					const name = issue.status.name;
					const list = grouped.get(name) ?? [];
					list.push(issue);
					grouped.set(name, list);
				}

				consola.log(`  Assigned issues (${data.issues.length}):`);
				consola.log("");
				for (const [statusName, statusIssues] of grouped) {
					consola.log(`    ${statusName} (${statusIssues.length}):`);
					for (const issue of statusIssues.slice(0, 5)) {
						consola.log(`      ${issue.issueKey}  ${issue.summary}`);
					}
					if (statusIssues.length > 5) {
						consola.log(`      ... and ${statusIssues.length - 5} more`);
					}
				}
			} else {
				consola.log("  No issues assigned to you.");
			}

			// Recently viewed issues
			if (data.recentIssues.length > 0) {
				consola.log("");
				consola.log("  Recently viewed:");
				consola.log("");
				for (const item of data.recentIssues) {
					consola.log(`    ${item.issue.issueKey}  ${item.issue.summary}`);
				}
			}

			consola.log("");
		});
	},
});

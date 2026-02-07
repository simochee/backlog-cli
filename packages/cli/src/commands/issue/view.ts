import { type BacklogComment, type BacklogIssue } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { issueUrl, openUrl } from "#utils/url.ts";

export default defineCommand({
	meta: {
		name: "view",
		description: "View issue details",
	},
	args: {
		issueKey: {
			type: "positional",
			description: "Issue key (e.g., PROJECT-123)",
			required: true,
		},
		comments: {
			type: "boolean",
			description: "Include comments",
		},
		web: {
			type: "boolean",
			description: "Open in browser",
		},
	},
	async run({ args }) {
		const { client, host } = await getClient();

		const issue = await client<BacklogIssue>(`/issues/${args.issueKey}`);

		if (args.web) {
			const url = issueUrl(host, issue.issueKey);
			consola.info(`Opening ${url}`);
			await openUrl(url);
			return;
		}

		consola.log("");
		consola.log(`  ${issue.issueKey}: ${issue.summary}`);
		consola.log("");
		consola.log(`    Status:      ${issue.status.name}`);
		consola.log(`    Type:        ${issue.issueType.name}`);
		consola.log(`    Priority:    ${issue.priority.name}`);
		consola.log(`    Assignee:    ${issue.assignee?.name ?? "Unassigned"}`);
		consola.log(`    Created by:  ${issue.createdUser.name}`);
		consola.log(`    Created:     ${formatDate(issue.created)}`);
		consola.log(`    Updated:     ${formatDate(issue.updated)}`);

		if (issue.startDate) {
			consola.log(`    Start Date:  ${formatDate(issue.startDate)}`);
		}
		if (issue.dueDate) {
			consola.log(`    Due Date:    ${formatDate(issue.dueDate)}`);
		}
		if (issue.estimatedHours != null) {
			consola.log(`    Estimated:   ${issue.estimatedHours}h`);
		}
		if (issue.actualHours != null) {
			consola.log(`    Actual:      ${issue.actualHours}h`);
		}
		if (issue.category.length > 0) {
			consola.log(
				`    Categories:  ${issue.category.map((c: { id: number; name: string }) => c.name).join(", ")}`,
			);
		}
		if (issue.milestone.length > 0) {
			consola.log(
				`    Milestones:  ${issue.milestone.map((m: { id: number; name: string }) => m.name).join(", ")}`,
			);
		}
		if (issue.versions.length > 0) {
			consola.log(
				`    Versions:    ${issue.versions.map((v: { id: number; name: string }) => v.name).join(", ")}`,
			);
		}

		if (issue.description) {
			consola.log("");
			consola.log("  Description:");
			consola.log(
				issue.description
					.split("\n")
					.map((line: string) => `    ${line}`)
					.join("\n"),
			);
		}

		if (args.comments) {
			const comments = await client<BacklogComment[]>(
				`/issues/${args.issueKey}/comments`,
			);

			if (comments.length > 0) {
				consola.log("");
				consola.log("  Comments:");
				for (const comment of comments) {
					if (!comment.content) {
						continue;
					}
					consola.log("");
					consola.log(
						`    ${comment.createdUser.name} (${formatDate(comment.created)}):`,
					);
					consola.log(
						comment.content
							.split("\n")
							.map((line: string) => `      ${line}`)
							.join("\n"),
					);
				}
			}
		}

		consola.log("");
	},
});

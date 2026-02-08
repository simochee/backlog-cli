import type { BacklogComment, BacklogIssue } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { issueUrl, openUrl } from "#utils/url.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View issue details",
	},
	args: {
		...outputArgs,
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

		outputResult(issue, args, async (data) => {
			consola.log("");
			consola.log(`  ${data.issueKey}: ${data.summary}`);
			consola.log("");
			consola.log(`    Status:      ${data.status.name}`);
			consola.log(`    Type:        ${data.issueType.name}`);
			consola.log(`    Priority:    ${data.priority.name}`);
			consola.log(`    Assignee:    ${data.assignee?.name ?? "Unassigned"}`);
			consola.log(`    Created by:  ${data.createdUser.name}`);
			consola.log(`    Created:     ${formatDate(data.created)}`);
			consola.log(`    Updated:     ${formatDate(data.updated)}`);

			if (data.startDate) {
				consola.log(`    Start Date:  ${formatDate(data.startDate)}`);
			}
			if (data.dueDate) {
				consola.log(`    Due Date:    ${formatDate(data.dueDate)}`);
			}
			if (data.estimatedHours != null) {
				consola.log(`    Estimated:   ${data.estimatedHours}h`);
			}
			if (data.actualHours != null) {
				consola.log(`    Actual:      ${data.actualHours}h`);
			}
			if (data.category.length > 0) {
				consola.log(`    Categories:  ${data.category.map((c: { id: number; name: string }) => c.name).join(", ")}`);
			}
			if (data.milestone.length > 0) {
				consola.log(`    Milestones:  ${data.milestone.map((m: { id: number; name: string }) => m.name).join(", ")}`);
			}
			if (data.versions.length > 0) {
				consola.log(`    Versions:    ${data.versions.map((v: { id: number; name: string }) => v.name).join(", ")}`);
			}

			if (data.description) {
				consola.log("");
				consola.log("  Description:");
				consola.log(
					data.description
						.split("\n")
						.map((line: string) => `    ${line}`)
						.join("\n"),
				);
			}

			if (args.comments) {
				const comments = await client<BacklogComment[]>(`/issues/${args.issueKey}/comments`);

				if (comments.length > 0) {
					consola.log("");
					consola.log("  Comments:");
					for (const comment of comments) {
						if (!comment.content) continue;
						consola.log("");
						consola.log(`    ${comment.createdUser.name} (${formatDate(comment.created)}):`);
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
		});
	},
});

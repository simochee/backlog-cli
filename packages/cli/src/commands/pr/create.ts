import type { BacklogPullRequest } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveUserId } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a pull request",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
			required: true,
		},
		repo: {
			type: "string",
			alias: "R",
			description: "Repository name",
			required: true,
		},
		title: {
			type: "string",
			alias: "t",
			description: "PR title",
		},
		body: {
			type: "string",
			alias: "b",
			description: "PR description",
		},
		base: {
			type: "string",
			alias: "B",
			description: "Base branch (merge target)",
		},
		branch: {
			type: "string",
			description: "Source branch",
		},
		assignee: {
			type: "string",
			alias: "a",
			description: "Assignee (username or @me)",
		},
		issue: {
			type: "string",
			description: "Related issue key",
		},
		web: {
			type: "boolean",
			description: "Open in browser after creation",
		},
	},
	async run({ args }) {
		const { client, host } = await getClient();

		let title = args.title;
		let base = args.base;
		let branch = args.branch;

		// Prompt for required fields if not provided
		if (!title) {
			title = await consola.prompt("PR title:", { type: "text" });
			if (typeof title !== "string" || !title) {
				consola.error("Title is required.");
				return process.exit(1);
			}
		}

		if (!base) {
			base = await consola.prompt("Base branch:", { type: "text" });
			if (typeof base !== "string" || !base) {
				consola.error("Base branch is required.");
				return process.exit(1);
			}
		}

		if (!branch) {
			branch = await consola.prompt("Source branch:", { type: "text" });
			if (typeof branch !== "string" || !branch) {
				consola.error("Source branch is required.");
				return process.exit(1);
			}
		}

		const body: Record<string, unknown> = {
			summary: title,
			description: args.body ?? "",
			base,
			branch,
		};

		if (args.assignee) {
			body.assigneeId = await resolveUserId(client, args.assignee);
		}

		if (args.issue) {
			const issue = await client<{ id: number }>(`/issues/${args.issue}`);
			body.issueId = issue.id;
		}

		const pr = await client<BacklogPullRequest>(
			`/projects/${args.project}/git/repositories/${args.repo}/pullRequests`,
			{
				method: "POST",
				body,
			},
		);

		consola.success(`Created PR #${pr.number}: ${pr.summary}`);

		if (args.web) {
			const url = `https://${host}/git/${args.project}/${args.repo}/pullRequests/${pr.number}`;
			consola.info(`Opening ${url}`);
			Bun.spawn(["open", url]);
		}
	},
});

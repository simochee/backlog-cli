import { type BacklogPullRequest, type BacklogUser } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "status",
		description: "Show pull request status summary for yourself",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		repo: {
			type: "string",
			alias: "R",
			description: "Repository name",
			required: true,
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const me = await client<BacklogUser>("/users/myself");

		const prs = await client<BacklogPullRequest[]>(
			`/projects/${project}/git/repositories/${args.repo}/pullRequests`,
			{
				query: {
					"assigneeId[]": [me.id],
					count: 100,
				},
			},
		);

		if (prs.length === 0) {
			consola.info("No pull requests assigned to you.");
			return;
		}

		// Group by status
		const grouped = new Map<string, BacklogPullRequest[]>();
		for (const pr of prs) {
			const { name } = pr.status;
			const list = grouped.get(name) ?? [];
			list.push(pr);
			grouped.set(name, list);
		}

		consola.log("");
		consola.log(`  Pull requests assigned to ${me.name}:`);
		consola.log("");

		for (const [statusName, statusPrs] of grouped) {
			consola.log(`  ${statusName} (${statusPrs.length}):`);
			for (const pr of statusPrs) {
				consola.log(`    #${pr.number}  ${pr.summary}`);
			}
			consola.log("");
		}
	},
});

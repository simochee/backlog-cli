import type { BacklogIssueType } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { padEnd } from "#utils/format.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List issue types",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const issueTypes = await client<BacklogIssueType[]>(
			`/projects/${project}/issueTypes`,
		);

		if (issueTypes.length === 0) {
			consola.info("No issue types found.");
			return;
		}

		const header = `${padEnd("ID", 10)}${padEnd("NAME", 24)}COLOR`;
		consola.log(header);
		for (const issueType of issueTypes) {
			const id = padEnd(`${issueType.id}`, 10);
			const name = padEnd(issueType.name, 24);
			consola.log(`${id}${name}${issueType.color}`);
		}
	},
});

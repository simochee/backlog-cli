import type { BacklogIssueType } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import promptRequired from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create an issue type",
	},
	args: {
		...outputArgs,
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		name: {
			type: "string",
			alias: "n",
			description: "Issue type name",
		},
		color: {
			type: "string",
			description: "Display color (#hex)",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const name = await promptRequired("Issue type name:", args.name);
		const color = await promptRequired("Display color (#hex):", args.color);

		const issueType = await client<BacklogIssueType>(`/projects/${project}/issueTypes`, {
			method: "POST",
			body: new URLSearchParams({ name, color }),
		});

		outputResult(issueType, args, (data) => {
			consola.success(`Created issue type #${data.id}: ${data.name}`);
		});
	},
});

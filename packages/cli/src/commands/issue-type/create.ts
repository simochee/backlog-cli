import type { BacklogIssueType } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create an issue type",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
			required: true,
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
		const { client } = await getClient();

		const name = await promptRequired("Issue type name:", args.name);
		const color = await promptRequired("Display color (#hex):", args.color);

		const issueType = await client<BacklogIssueType>(
			`/projects/${args.project}/issueTypes`,
			{
				method: "POST",
				body: { name, color },
			},
		);

		consola.success(`Created issue type #${issueType.id}: ${issueType.name}`);
	},
});

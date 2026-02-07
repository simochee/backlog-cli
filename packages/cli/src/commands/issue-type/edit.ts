import type { BacklogIssueType } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit an issue type",
	},
	args: {
		id: {
			type: "positional",
			description: "Issue type ID",
			required: true,
		},
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

		const body: Record<string, unknown> = {};

		if (args.name) {
			body.name = args.name;
		}
		if (args.color) {
			body.color = args.color;
		}

		const issueType = await client<BacklogIssueType>(
			`/projects/${args.project}/issueTypes/${args.id}`,
			{
				method: "PATCH",
				body,
			},
		);

		consola.success(`Updated issue type #${issueType.id}: ${issueType.name}`);
	},
});

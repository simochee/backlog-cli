import type { BacklogIssueType } from "@repo/api";
import type { IssueTypesUpdateData } from "@repo/openapi-client";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

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

		const body: IssueTypesUpdateData["body"] = {};

		if (args.name) {
			body.name = args.name;
		}
		if (args.color) {
			body.color = args.color;
		}

		const issueType = await client<BacklogIssueType>(
			`/projects/${project}/issueTypes/${args.id}`,
			{
				method: "PATCH",
				body,
			},
		);

		consola.success(`Updated issue type #${issueType.id}: ${issueType.name}`);
	},
});

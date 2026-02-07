import type { BacklogIssueType } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

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

		let name = args.name;
		let color = args.color;

		if (!name) {
			name = await consola.prompt("Issue type name:", { type: "text" });
			if (typeof name !== "string" || !name) {
				consola.error("Issue type name is required.");
				return process.exit(1);
			}
		}

		if (!color) {
			color = await consola.prompt("Display color (#hex):", {
				type: "text",
			});
			if (typeof color !== "string" || !color) {
				consola.error("Display color is required.");
				return process.exit(1);
			}
		}

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

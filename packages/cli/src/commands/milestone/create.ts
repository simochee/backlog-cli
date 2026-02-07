import type { BacklogMilestone } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a milestone",
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
			description: "Milestone name",
		},
		description: {
			type: "string",
			alias: "d",
			description: "Description",
		},
		"start-date": {
			type: "string",
			description: "Start date (yyyy-MM-dd)",
		},
		"release-due-date": {
			type: "string",
			description: "Release due date (yyyy-MM-dd)",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		let name = args.name;

		if (!name) {
			name = await consola.prompt("Milestone name:", { type: "text" });
			if (typeof name !== "string" || !name) {
				consola.error("Milestone name is required.");
				return process.exit(1);
			}
		}

		const body: Record<string, unknown> = { name };

		if (args.description) {
			body.description = args.description;
		}
		if (args["start-date"]) {
			body.startDate = args["start-date"];
		}
		if (args["release-due-date"]) {
			body.releaseDueDate = args["release-due-date"];
		}

		const milestone = await client<BacklogMilestone>(
			`/projects/${args.project}/versions`,
			{
				method: "POST",
				body,
			},
		);

		consola.success(`Created milestone #${milestone.id}: ${milestone.name}`);
	},
});

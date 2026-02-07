import type { BacklogMilestone } from "@repo/api";
import type { VersionsCreateData } from "@repo/openapi-client";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a milestone",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
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
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const name = await promptRequired("Milestone name:", args.name);

		const body: VersionsCreateData["body"] = { name };

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
			`/projects/${project}/versions`,
			{
				method: "POST",
				body,
			},
		);

		consola.success(`Created milestone #${milestone.id}: ${milestone.name}`);
	},
});

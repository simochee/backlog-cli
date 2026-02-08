import type { BacklogMilestone } from "@repo/api";
import type { VersionsUpdateData } from "@repo/openapi-client";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit a milestone",
	},
	args: {
		id: {
			type: "positional",
			description: "Milestone ID",
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
		archived: {
			type: "boolean",
			description: "Archive milestone",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const body: VersionsUpdateData["body"] = {};

		if (args.name) {
			body.name = args.name;
		}
		if (args.description) {
			body.description = args.description;
		}
		if (args["start-date"]) {
			body.startDate = args["start-date"];
		}
		if (args["release-due-date"]) {
			body.releaseDueDate = args["release-due-date"];
		}
		if (args.archived !== undefined) {
			body.archived = args.archived;
		}

		const milestone = await client<BacklogMilestone>(
			`/projects/${project}/versions/${args.id}`,
			{
				method: "PATCH",
				body,
			},
		);

		consola.success(`Updated milestone #${milestone.id}: ${milestone.name}`);
	},
});

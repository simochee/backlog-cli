import type { BacklogProject } from "@repo/api";
import type { ProjectsListData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { formatProjectLine, padEnd } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "list",
		description: "List projects",
	},
	args: {
		...outputArgs,
		archived: {
			type: "boolean",
			description: "Include archived projects",
		},
		all: {
			type: "boolean",
			description: "Show all projects (admin only)",
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
	},
	async run({ args }) {
		const { client } = await getClient();
		const limit = Number.parseInt(args.limit, 10);

		const query: NonNullable<ProjectsListData["query"]> = {};
		if (args.archived != null) {
			query.archived = args.archived;
		}
		if (args.all) {
			query.all = true;
		}

		const projects = await client<BacklogProject[]>("/projects", { query });

		const displayed = projects.slice(0, limit);

		outputResult(displayed, args, (data) => {
			if (data.length === 0) {
				consola.info("No projects found.");
				return;
			}

			const header = `${padEnd("KEY", 16)}${padEnd("NAME", 30)}STATUS`;
			consola.log(header);
			for (const project of data) {
				consola.log(formatProjectLine(project));
			}
		});
	},
});

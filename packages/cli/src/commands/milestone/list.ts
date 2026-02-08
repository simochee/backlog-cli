import type { BacklogMilestone } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate, padEnd } from "#utils/format.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "list",
		description: "List milestones",
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

		const milestones = await client<BacklogMilestone[]>(`/projects/${project}/versions`);

		if (milestones.length === 0) {
			consola.info("No milestones found.");
			return;
		}

		const header = `${padEnd("ID", 10)}${padEnd("NAME", 24)}${padEnd("START", 12)}${padEnd("DUE", 12)}STATUS`;
		consola.log(header);
		for (const milestone of milestones) {
			const id = padEnd(`${milestone.id}`, 10);
			const name = padEnd(milestone.name, 24);
			const start = padEnd(formatDate(milestone.startDate), 12);
			const due = padEnd(formatDate(milestone.releaseDueDate), 12);
			const status = milestone.archived ? "Archived" : "Active";
			consola.log(`${id}${name}${start}${due}${status}`);
		}
	},
});

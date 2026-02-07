import { type BacklogStatus } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { padEnd } from "#utils/format.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List issue statuses",
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

		const statuses = await client<BacklogStatus[]>(
			`/projects/${project}/statuses`,
		);

		if (statuses.length === 0) {
			consola.info("No statuses found.");
			return;
		}

		const header = `${padEnd("ID", 10)}${padEnd("NAME", 24)}COLOR`;
		consola.log(header);
		for (const status of statuses) {
			const id = padEnd(`${status.id}`, 10);
			const name = padEnd(status.name, 24);
			consola.log(`${id}${name}${status.color}`);
		}
	},
});

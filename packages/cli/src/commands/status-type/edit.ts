import type { BacklogStatus } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit an issue status",
	},
	args: {
		id: {
			type: "positional",
			description: "Status ID",
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
			description: "Status name",
		},
		color: {
			type: "string",
			description: "Display color (#hex)",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const body: Record<string, unknown> = {};

		if (args.name) {
			body.name = args.name;
		}
		if (args.color) {
			body.color = args.color;
		}

		const status = await client<BacklogStatus>(
			`/projects/${project}/statuses/${args.id}`,
			{
				method: "PATCH",
				body,
			},
		);

		consola.success(`Updated status #${status.id}: ${status.name}`);
	},
});

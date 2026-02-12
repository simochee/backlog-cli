import type { BacklogStatus } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import promptRequired from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create an issue status",
	},
	args: {
		...outputArgs,
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

		const name = await promptRequired("Status name:", args.name);
		const color = await promptRequired("Display color (#hex):", args.color);

		const status = await client<BacklogStatus>(`/projects/${project}/statuses`, {
			method: "POST",
			body: new URLSearchParams({ name, color }),
		});

		outputResult(status, args, (data) => {
			consola.success(`Created status #${data.id}: ${data.name}`);
		});
	},
});

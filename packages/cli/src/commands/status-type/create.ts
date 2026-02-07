import { type BacklogStatus } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create an issue status",
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

		const status = await client<BacklogStatus>(
			`/projects/${project}/statuses`,
			{
				method: "POST",
				body: { name, color },
			},
		);

		consola.success(`Created status #${status.id}: ${status.name}`);
	},
});

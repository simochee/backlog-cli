import type { BacklogWiki } from "@repo/api";
import type { WikisCreateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import { resolveProjectArg, resolveProjectId } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a wiki page",
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
			description: "Page name",
		},
		body: {
			type: "string",
			alias: "b",
			description: "Page content",
		},
		notify: {
			type: "boolean",
			description: "Send email notification",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const name = await promptRequired("Page name:", args.name);
		const body = await promptRequired("Page content:", args.body);

		const projectId = await resolveProjectId(client, project);

		const requestBody: WikisCreateData["body"] = {
			projectId,
			name,
			content: body,
		};

		if (args.notify) {
			requestBody.mailNotify = true;
		}

		const wiki = await client<BacklogWiki>("/wikis", {
			method: "POST",
			body: requestBody,
		});

		consola.success(`Created wiki page #${wiki.id}: ${wiki.name}`);
	},
});

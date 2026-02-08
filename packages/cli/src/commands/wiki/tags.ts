import type { BacklogWikiTag } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { padEnd } from "#utils/format.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "tags",
		description: "List wiki tags",
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

		const tags = await client<BacklogWikiTag[]>("/wikis/tags", {
			query: { projectIdOrKey: project },
		});

		if (tags.length === 0) {
			consola.info("No wiki tags found.");
			return;
		}

		const header = `${padEnd("ID", 10)}NAME`;
		consola.log(header);
		for (const tag of tags) {
			consola.log(`${padEnd(`${tag.id}`, 10)}${tag.name}`);
		}
	},
});

import type { BacklogWikiTag } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "tags",
		description: "List wiki tags",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const tags = await client<BacklogWikiTag[]>("/wikis/tags", {
			query: { projectIdOrKey: args.project },
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

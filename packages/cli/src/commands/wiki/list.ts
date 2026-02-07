import type { BacklogWiki } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate, padEnd } from "#utils/format.ts";
import { resolveProjectArg } from "#utils/resolve.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List wiki pages",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		keyword: {
			type: "string",
			alias: "k",
			description: "Keyword search",
		},
		sort: {
			type: "string",
			description: "Sort key",
			default: "updated",
		},
		order: {
			type: "string",
			description: "Sort order: asc or desc",
			default: "desc",
		},
		offset: {
			type: "string",
			description: "Offset for pagination",
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);

		const { client } = await getClient();

		const query: Record<string, unknown> = {
			projectIdOrKey: project,
			sort: args.sort,
			order: args.order,
			count: Number.parseInt(args.limit, 10),
		};

		if (args.keyword) {
			query.keyword = args.keyword;
		}
		if (args.offset) {
			query.offset = Number.parseInt(args.offset, 10);
		}

		const wikis = await client<BacklogWiki[]>("/wikis", { query });

		if (wikis.length === 0) {
			consola.info("No wiki pages found.");
			return;
		}

		const header = `${padEnd("ID", 10)}${padEnd("NAME", 40)}${padEnd("UPDATED", 12)}CREATED BY`;
		consola.log(header);
		for (const wiki of wikis) {
			const id = padEnd(`${wiki.id}`, 10);
			const name = padEnd(wiki.name, 40);
			const updated = padEnd(formatDate(wiki.updated), 12);
			const createdBy = wiki.createdUser.name;
			consola.log(`${id}${name}${updated}${createdBy}`);
		}
	},
});

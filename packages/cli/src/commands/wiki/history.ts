import { type BacklogWikiHistory } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate, padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "history",
		description: "Show wiki page history",
	},
	args: {
		"wiki-id": {
			type: "positional",
			description: "Wiki page ID",
			required: true,
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
		offset: {
			type: "string",
			description: "Offset for pagination",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const query: Record<string, unknown> = {
			count: Number.parseInt(args.limit, 10),
		};

		if (args.offset) {
			query.offset = Number.parseInt(args.offset, 10);
		}

		const history = await client<BacklogWikiHistory[]>(
			`/wikis/${args["wiki-id"]}/history`,
			{ query },
		);

		if (history.length === 0) {
			consola.info("No history found.");
			return;
		}

		const header = `${padEnd("VERSION", 10)}${padEnd("NAME", 30)}${padEnd("DATE", 12)}AUTHOR`;
		consola.log(header);
		for (const entry of history) {
			const version = padEnd(`v${entry.version}`, 10);
			const name = padEnd(entry.name, 30);
			const date = padEnd(formatDate(entry.created), 12);
			consola.log(`${version}${name}${date}${entry.createdUser.name}`);
		}
	},
});

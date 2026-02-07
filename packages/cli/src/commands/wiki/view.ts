import type { BacklogWiki } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { openUrl, wikiUrl } from "#utils/url.ts";

export default defineCommand({
	meta: {
		name: "view",
		description: "View a wiki page",
	},
	args: {
		"wiki-id": {
			type: "positional",
			description: "Wiki page ID",
			required: true,
		},
		web: {
			type: "boolean",
			description: "Open in browser",
		},
	},
	async run({ args }) {
		const { client, host } = await getClient();

		const wiki = await client<BacklogWiki>(`/wikis/${args["wiki-id"]}`);

		if (args.web) {
			const url = wikiUrl(host, wiki.id);
			consola.info(`Opening ${url}`);
			await openUrl(url);
			return;
		}

		consola.log("");
		consola.log(`  ${wiki.name}`);
		consola.log("");
		consola.log(`    ID:          ${wiki.id}`);
		consola.log(`    Created by:  ${wiki.createdUser.name}`);
		consola.log(`    Created:     ${formatDate(wiki.created)}`);
		consola.log(`    Updated by:  ${wiki.updatedUser.name}`);
		consola.log(`    Updated:     ${formatDate(wiki.updated)}`);

		if (wiki.tags.length > 0) {
			consola.log(
				`    Tags:        ${wiki.tags.map((t) => t.name).join(", ")}`,
			);
		}

		if (wiki.attachments.length > 0) {
			consola.log(`    Attachments: ${wiki.attachments.length} file(s)`);
		}

		if (wiki.content) {
			consola.log("");
			consola.log("  Content:");
			consola.log(
				wiki.content
					.split("\n")
					.map((line: string) => `    ${line}`)
					.join("\n"),
			);
		}

		consola.log("");
	},
});

import type { BacklogWiki } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { openUrl, wikiUrl } from "#utils/url.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View a wiki page",
	},
	args: {
		...outputArgs,
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

		outputResult(wiki, args, (data) => {
			consola.log("");
			consola.log(`  ${data.name}`);
			consola.log("");
			consola.log(`    ID:          ${data.id}`);
			consola.log(`    Created by:  ${data.createdUser.name}`);
			consola.log(`    Created:     ${formatDate(data.created)}`);
			consola.log(`    Updated by:  ${data.updatedUser.name}`);
			consola.log(`    Updated:     ${formatDate(data.updated)}`);

			if (data.tags.length > 0) {
				consola.log(`    Tags:        ${data.tags.map((t) => t.name).join(", ")}`);
			}

			if (data.attachments.length > 0) {
				consola.log(`    Attachments: ${data.attachments.length} file(s)`);
			}

			if (data.content) {
				consola.log("");
				consola.log("  Content:");
				consola.log(
					data.content
						.split("\n")
						.map((line: string) => `    ${line}`)
						.join("\n"),
				);
			}

			consola.log("");
		});
	},
});

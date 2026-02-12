import type { BacklogDocumentDetail } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { documentUrl, openUrl } from "#utils/url.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View a document",
	},
	args: {
		...outputArgs,
		"document-id": {
			type: "positional",
			description: "Document ID",
			required: true,
		},
		web: {
			type: "boolean",
			description: "Open in browser",
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key (required for --web)",
		},
	},
	async run({ args }) {
		const { client, host } = await getClient();

		const doc = await client<BacklogDocumentDetail>(`/documents/${args["document-id"]}`);

		if (args.web) {
			const projectKey = args.project || process.env.BACKLOG_PROJECT;
			if (!projectKey) {
				consola.error("Project key is required for --web. Specify --project (-p) or set BACKLOG_PROJECT.");
				process.exit(1);
			}
			const url = documentUrl(host, projectKey, doc.id);
			consola.info(`Opening ${url}`);
			await openUrl(url);
			return;
		}

		outputResult(doc, args, (data) => {
			consola.log("");
			consola.log(`  ${data.emoji ? `${data.emoji} ` : ""}${data.title}`);
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

			if (data.plain) {
				consola.log("");
				consola.log("  Content:");
				consola.log(
					data.plain
						.split("\n")
						.map((line: string) => `    ${line}`)
						.join("\n"),
				);
			}

			consola.log("");
		});
	},
});

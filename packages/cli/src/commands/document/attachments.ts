import type { BacklogDocumentDetail } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { padEnd } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "attachments",
		description: "List document attachments",
	},
	args: {
		...outputArgs,
		"document-id": {
			type: "positional",
			description: "Document ID",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const doc = await client<BacklogDocumentDetail>(`/documents/${args["document-id"]}`);

		outputResult(doc.attachments, args, (data) => {
			if (data.length === 0) {
				consola.info("No attachments found.");
				return;
			}

			const header = `${padEnd("ID", 10)}${padEnd("NAME", 40)}SIZE`;
			consola.log(header);
			for (const attachment of data) {
				const id = padEnd(`${attachment.id}`, 10);
				const name = padEnd(attachment.name, 40);
				consola.log(`${id}${name}${attachment.size}`);
			}
		});
	},
});

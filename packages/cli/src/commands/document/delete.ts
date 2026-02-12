import type { BacklogDocument } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete a document",
	},
	args: {
		"document-id": {
			type: "positional",
			description: "Document ID",
			required: true,
		},
		yes: {
			type: "boolean",
			alias: "y",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const proceed = await confirmOrExit(`Are you sure you want to delete document ${args["document-id"]}?`, args.yes);
		if (!proceed) return;

		const document = await client<BacklogDocument>(`/documents/${args["document-id"]}`, {
			method: "DELETE",
		});

		consola.success(`Deleted document ${document.id}: ${document.title}`);
	},
});

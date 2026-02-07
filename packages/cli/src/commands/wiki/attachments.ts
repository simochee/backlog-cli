import { type BacklogWikiAttachment } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate, padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "attachments",
		description: "List wiki page attachments",
	},
	args: {
		"wiki-id": {
			type: "positional",
			description: "Wiki page ID",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const attachments = await client<BacklogWikiAttachment[]>(
			`/wikis/${args["wiki-id"]}/attachments`,
		);

		if (attachments.length === 0) {
			consola.info("No attachments found.");
			return;
		}

		const header = `${padEnd("ID", 10)}${padEnd("NAME", 30)}${padEnd("SIZE", 12)}${padEnd("DATE", 12)}CREATED BY`;
		consola.log(header);
		for (const attachment of attachments) {
			const id = padEnd(`${attachment.id}`, 10);
			const name = padEnd(attachment.name, 30);
			const size = padEnd(`${attachment.size}`, 12);
			const date = padEnd(formatDate(attachment.created), 12);
			consola.log(`${id}${name}${size}${date}${attachment.createdUser.name}`);
		}
	},
});

import type { BacklogWebhook } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate, padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List webhooks",
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

		const webhooks = await client<BacklogWebhook[]>(
			`/projects/${args.project}/webhooks`,
		);

		if (webhooks.length === 0) {
			consola.info("No webhooks found.");
			return;
		}

		const header = `${padEnd("ID", 10)}${padEnd("NAME", 30)}${padEnd("URL", 40)}${padEnd("UPDATED", 12)}ALL EVENTS`;
		consola.log(header);
		for (const webhook of webhooks) {
			const id = padEnd(`${webhook.id}`, 10);
			const name = padEnd(webhook.name, 30);
			const url = padEnd(webhook.hookUrl, 40);
			const updated = padEnd(formatDate(webhook.updated), 12);
			const allEvent = webhook.allEvent ? "Yes" : "No";
			consola.log(`${id}${name}${url}${updated}${allEvent}`);
		}
	},
});

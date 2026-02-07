import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "read",
		description: "Mark a watching as read",
	},
	args: {
		"watching-id": {
			type: "positional",
			description: "Watching ID",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		await client(`/watchings/${args["watching-id"]}/markAsRead`, {
			method: "POST",
		});

		consola.success(`Marked watching ${args["watching-id"]} as read.`);
	},
});

import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "read",
		description: "Mark a notification as read",
	},
	args: {
		id: {
			type: "positional",
			description: "Notification ID",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		await client(`/notifications/${args.id}/markAsRead`, {
			method: "POST",
		});

		consola.success(`Marked notification ${args.id} as read.`);
	},
});

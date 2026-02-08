import { getClient } from "#utils/client.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "read-all",
		description: "Mark all notifications as read",
	},
	args: {},
	async run() {
		const { client } = await getClient();

		await client("/notifications/markAsRead", {
			method: "POST",
		});

		consola.success("Marked all notifications as read.");
	},
});

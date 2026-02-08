import type { BacklogSpaceNotification } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "notification",
		description: "Show space notification",
	},
	args: {},
	async run() {
		const { client } = await getClient();

		const notification = await client<BacklogSpaceNotification>("/space/notification");

		if (!notification.content) {
			consola.info("No space notification set.");
			return;
		}

		consola.log("");
		consola.log("  Space Notification");
		consola.log("");
		consola.log(`    Updated: ${formatDate(notification.updated)}`);
		consola.log("");
		consola.log("  Content:");
		consola.log(
			notification.content
				.split("\n")
				.map((line: string) => `    ${line}`)
				.join("\n"),
		);
		consola.log("");
	},
});

import { type BacklogSpace } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "info",
		description: "Show space information",
	},
	args: {},
	async run() {
		const { client } = await getClient();

		const space = await client<BacklogSpace>("/space");

		consola.log("");
		consola.log(`  ${space.name}`);
		consola.log("");
		consola.log(`    Space Key:           ${space.spaceKey}`);
		consola.log(`    Owner ID:            ${space.ownerId}`);
		consola.log(`    Language:             ${space.lang}`);
		consola.log(`    Timezone:             ${space.timezone}`);
		consola.log(`    Text Formatting:      ${space.textFormattingRule}`);
		consola.log(`    Report Send Time:     ${space.reportSendTime}`);
		consola.log(`    Created:              ${space.created}`);
		consola.log(`    Updated:              ${space.updated}`);
		consola.log("");
	},
});

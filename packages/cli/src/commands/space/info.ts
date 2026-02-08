import type { BacklogSpace } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "info",
		description: "Show space information",
	},
	args: {
		...outputArgs,
	},
	async run({ args }) {
		const { client } = await getClient();

		const space = await client<BacklogSpace>("/space");

		outputResult(space, args, (data) => {
			consola.log("");
			consola.log(`  ${data.name}`);
			consola.log("");
			consola.log(`    Space Key:           ${data.spaceKey}`);
			consola.log(`    Owner ID:            ${data.ownerId}`);
			consola.log(`    Language:             ${data.lang}`);
			consola.log(`    Timezone:             ${data.timezone}`);
			consola.log(`    Text Formatting:      ${data.textFormattingRule}`);
			consola.log(`    Report Send Time:     ${data.reportSendTime}`);
			consola.log(`    Created:              ${data.created}`);
			consola.log(`    Updated:              ${data.updated}`);
			consola.log("");
		});
	},
});

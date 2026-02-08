import type { BacklogUser } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View user details",
	},
	args: {
		...outputArgs,
		"user-id": {
			type: "positional",
			description: "User ID (numeric)",
			required: true,
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const user = await client<BacklogUser>(`/users/${args["user-id"]}`);

		outputResult(user, args, (data) => {
			const roleNames: Record<number, string> = {
				1: "Admin",
				2: "Normal",
				3: "Reporter",
				4: "Viewer",
				5: "Guest Reporter",
				6: "Guest Viewer",
			};

			consola.log("");
			consola.log(`  ${data.name}`);
			consola.log("");
			consola.log(`    ID:          ${data.id}`);
			consola.log(`    User ID:     ${data.userId}`);
			consola.log(`    Email:       ${data.mailAddress}`);
			consola.log(`    Role:        ${roleNames[data.roleType] ?? `Role ${data.roleType}`}`);
			consola.log(`    Language:    ${data.lang ?? "Not set"}`);
			consola.log(`    Last login:  ${formatDate(data.lastLoginTime)}`);
			consola.log("");
		});
	},
});

import type { BacklogUser } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { formatDate } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "me",
		description: "Show current user information",
	},
	args: {},
	async run() {
		const { client } = await getClient();

		const user = await client<BacklogUser>("/users/myself");

		const roleNames: Record<number, string> = {
			1: "Admin",
			2: "Normal",
			3: "Reporter",
			4: "Viewer",
			5: "Guest Reporter",
			6: "Guest Viewer",
		};

		consola.log("");
		consola.log(`  ${user.name}`);
		consola.log("");
		consola.log(`    ID:          ${user.id}`);
		consola.log(`    User ID:     ${user.userId}`);
		consola.log(`    Email:       ${user.mailAddress}`);
		consola.log(
			`    Role:        ${roleNames[user.roleType] ?? `Role ${user.roleType}`}`,
		);
		consola.log(`    Language:    ${user.lang ?? "Not set"}`);
		consola.log(`    Last login:  ${formatDate(user.lastLoginTime)}`);
		consola.log("");
	},
});

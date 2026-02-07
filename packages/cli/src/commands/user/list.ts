import type { BacklogUser } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List users",
	},
	args: {},
	async run() {
		const { client } = await getClient();

		const users = await client<BacklogUser[]>("/users");

		if (users.length === 0) {
			consola.info("No users found.");
			return;
		}

		const roleNames: Record<number, string> = {
			1: "Admin",
			2: "Normal",
			3: "Reporter",
			4: "Viewer",
			5: "Guest Reporter",
			6: "Guest Viewer",
		};

		const header = `${padEnd("ID", 10)}${padEnd("USER ID", 20)}${padEnd("NAME", 20)}${padEnd("ROLE", 16)}EMAIL`;
		consola.log(header);
		for (const user of users) {
			const id = padEnd(`${user.id}`, 10);
			const userId = padEnd(user.userId, 20);
			const name = padEnd(user.name, 20);
			const role = padEnd(
				roleNames[user.roleType] ?? `Role ${user.roleType}`,
				16,
			);
			consola.log(`${id}${userId}${name}${role}${user.mailAddress}`);
		}
	},
});

import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "notification",
		description: "Manage notifications",
	},
	subCommands: {
		list: () => import("./list.ts").then((m) => m.default),
		count: () => import("./count.ts").then((m) => m.default),
		read: () => import("./read.ts").then((m) => m.default),
		"read-all": () => import("./read-all.ts").then((m) => m.default),
	},
});

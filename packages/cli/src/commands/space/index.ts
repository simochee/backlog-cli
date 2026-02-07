import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "space",
		description: "Manage Backlog space",
	},
	subCommands: {
		info: () => import("./info.ts").then((m) => m.default),
		activities: () => import("./activities.ts").then((m) => m.default),
		"disk-usage": () => import("./disk-usage.ts").then((m) => m.default),
		notification: () => import("./notification.ts").then((m) => m.default),
	},
});

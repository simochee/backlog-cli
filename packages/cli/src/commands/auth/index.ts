import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "auth",
		description: "Manage authentication",
	},
	subCommands: {
		login: () => import("./login.ts").then((m) => m.default),
		logout: () => import("./logout.ts").then((m) => m.default),
		status: () => import("./status.ts").then((m) => m.default),
		token: () => import("./token.ts").then((m) => m.default),
		refresh: () => import("./refresh.ts").then((m) => m.default),
		switch: () => import("./switch.ts").then((m) => m.default),
	},
});

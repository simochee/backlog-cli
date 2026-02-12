import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "document",
		description: "Manage documents",
	},
	subCommands: {
		create: () => import("./create.ts").then((m) => m.default),
		delete: () => import("./delete.ts").then((m) => m.default),
	},
});

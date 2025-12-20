import { defineCommand, runMain } from "citty";

const main = defineCommand({
	meta: {
		name: "backlog-cli",
	},
	subCommands: {},
});

await runMain(main);

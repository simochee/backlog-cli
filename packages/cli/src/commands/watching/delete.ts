import { getClient } from "#utils/client.ts";
import { confirmOrExit } from "#utils/prompt.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete a watching",
	},
	args: {
		"watching-id": {
			type: "positional",
			description: "Watching ID",
			required: true,
		},
		yes: {
			type: "boolean",
			alias: "y",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const proceed = await confirmOrExit(`Are you sure you want to delete watching ${args["watching-id"]}?`, args.yes);
		if (!proceed) return;

		await client(`/watchings/${args["watching-id"]}`, {
			method: "DELETE",
		});

		consola.success(`Deleted watching ${args["watching-id"]}.`);
	},
});

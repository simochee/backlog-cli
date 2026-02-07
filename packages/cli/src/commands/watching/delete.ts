import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

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
		confirm: {
			type: "boolean",
			description: "Skip confirmation prompt",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		if (!args.confirm) {
			const confirmed = await consola.prompt(
				`Are you sure you want to delete watching ${args["watching-id"]}?`,
				{ type: "confirm" },
			);
			if (!confirmed) {
				consola.info("Cancelled.");
				return;
			}
		}

		await client(`/watchings/${args["watching-id"]}`, {
			method: "DELETE",
		});

		consola.success(`Deleted watching ${args["watching-id"]}.`);
	},
});

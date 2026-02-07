import { type BacklogComment } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";

export default defineCommand({
	meta: {
		name: "comment",
		description: "Add a comment to an issue",
	},
	args: {
		issueKey: {
			type: "positional",
			description: "Issue key (e.g., PROJECT-123)",
			required: true,
		},
		body: {
			type: "string",
			alias: "b",
			description: 'Comment body (use "-" for stdin)',
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		let content = args.body;

		// Read from stdin if "-"
		if (content === "-") {
			const chunks: Uint8Array[] = [];
			for await (const chunk of process.stdin) {
				chunks.push(chunk);
			}
			content = Buffer.concat(chunks).toString("utf-8").trim();
		}

		// Prompt for body if not provided
		if (!content) {
			content = await promptRequired("Comment body:");
		}

		const comment = await client<BacklogComment>(
			`/issues/${args.issueKey}/comments`,
			{
				method: "POST",
				body: { content },
			},
		);

		consola.success(
			`Added comment to ${args.issueKey} by ${comment.createdUser.name}`,
		);
	},
});

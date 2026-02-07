import type { BacklogRepository } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "clone",
		description: "Clone a Git repository",
	},
	args: {
		repoName: {
			type: "positional",
			description: "Repository name",
			required: true,
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
			required: true,
		},
		directory: {
			type: "string",
			alias: "d",
			description: "Clone destination directory",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const repo = await client<BacklogRepository>(
			`/projects/${args.project}/git/repositories/${args.repoName}`,
		);

		const cloneArgs = ["git", "clone", repo.httpUrl];
		if (args.directory) {
			cloneArgs.push(args.directory);
		}

		consola.info(`Cloning ${repo.httpUrl}...`);

		const proc = Bun.spawn(cloneArgs, {
			stdout: "inherit",
			stderr: "inherit",
		});

		const exitCode = await proc.exited;
		if (exitCode !== 0) {
			consola.error(`git clone failed with exit code ${exitCode}`);
			return process.exit(exitCode);
		}

		consola.success(`Cloned ${repo.name}`);
	},
});

import type { BacklogUser } from "@repo/api";
import { createClient } from "@repo/api";
import {
	addSpace,
	loadConfig,
	resolveSpace,
	updateSpaceAuth,
	writeConfig,
} from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

const readStdin = async (): Promise<string> => {
	const chunks: Uint8Array[] = [];
	for await (const chunk of process.stdin) {
		chunks.push(chunk);
	}
	return Buffer.concat(chunks).toString("utf-8").trim();
};

export default defineCommand({
	meta: {
		name: "login",
		description: "Authenticate with a Backlog space",
	},
	args: {
		hostname: {
			type: "string",
			alias: "h",
			description: "Space hostname (e.g., xxx.backlog.com)",
		},
		method: {
			type: "string",
			alias: "m",
			description: "Auth method: api-key or oauth",
			default: "api-key",
		},
		"with-token": {
			type: "boolean",
			description: "Read token from stdin",
		},
	},
	async run({ args }) {
		const method = args.method;

		if (method !== "api-key") {
			consola.error("Only api-key authentication is currently supported.");
			return process.exit(1);
		}

		// Resolve hostname
		let hostname = args.hostname;
		if (!hostname) {
			hostname = await consola.prompt("Backlog space hostname:", {
				type: "text",
				placeholder: "xxx.backlog.com",
			});

			if (typeof hostname !== "string" || !hostname) {
				consola.error("Hostname is required.");
				return process.exit(1);
			}
		}

		// Resolve API key
		let apiKey: string;
		if (args["with-token"]) {
			apiKey = await readStdin();
		} else {
			const input = await consola.prompt("API key:", {
				type: "text",
			});

			if (typeof input !== "string" || !input) {
				consola.error("API key is required.");
				return process.exit(1);
			}

			apiKey = input;
		}

		// Verify the credentials by calling /users/myself
		consola.start(`Authenticating with ${hostname}...`);

		const client = createClient({ host: hostname, apiKey });
		let user: BacklogUser;
		try {
			user = await client<BacklogUser>("/users/myself");
		} catch {
			consola.error(
				`Authentication failed. Could not connect to ${hostname} with the provided API key.`,
			);
			return process.exit(1);
		}

		// Save to config
		const host = hostname as `${string}.backlog.com` | `${string}.backlog.jp`;
		const existing = await resolveSpace(hostname);
		if (existing) {
			await updateSpaceAuth(host, { method: "api-key", apiKey });
		} else {
			await addSpace({
				host,
				auth: { method: "api-key", apiKey },
			});
		}

		// Set as default space if none is configured
		const config = await loadConfig();
		if (!config.defaultSpace) {
			await writeConfig({ ...config, defaultSpace: hostname });
		}

		consola.success(
			`Logged in to ${hostname} as ${user.name} (${user.userId})`,
		);
	},
});

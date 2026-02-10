import { startCallbackServer } from "#utils/oauth-callback.ts";
import promptRequired from "#utils/prompt.ts";
import readStdin from "#utils/stdin.ts";
import { openUrl } from "#utils/url.ts";
import { type BacklogUser, createClient, exchangeAuthorizationCode } from "@repo/api";
import { addSpace, loadConfig, resolveSpace, updateSpaceAuth, writeConfig } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "login",
		description: "Authenticate with a Backlog space",
	},
	args: {
		space: {
			type: "string",
			alias: "s",
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
		"client-id": {
			type: "string",
			description: "OAuth Client ID",
		},
		"client-secret": {
			type: "string",
			description: "OAuth Client Secret",
		},
	},
	async run({ args }) {
		const method = args.method;

		if (method !== "api-key" && method !== "oauth") {
			consola.error('Invalid auth method. Use "api-key" or "oauth".');
			return process.exit(1);
		}

		// Resolve hostname
		const hostname = await promptRequired("Backlog space hostname:", args.space || process.env["BACKLOG_SPACE"], {
			placeholder: "xxx.backlog.com",
		});

		if (method === "api-key") {
			await loginWithApiKey(hostname, args);
		} else {
			await loginWithOAuth(hostname, args);
		}
	},
});

async function loginWithApiKey(hostname: string, args: { "with-token"?: boolean }): Promise<void> {
	const apiKey = args["with-token"] ? await readStdin() : await promptRequired("API key:");

	consola.start(`Authenticating with ${hostname}...`);

	const client = createClient({ host: hostname, apiKey });
	let user: BacklogUser;
	try {
		user = await client<BacklogUser>("/users/myself");
	} catch {
		consola.error(`Authentication failed. Could not connect to ${hostname} with the provided API key.`);
		return process.exit(1);
	}

	await saveSpace(hostname, { method: "api-key", apiKey });
	consola.success(`Logged in to ${hostname} as ${user.name} (${user.userId})`);
}

async function loginWithOAuth(
	hostname: string,
	args: { "client-id"?: string; "client-secret"?: string },
): Promise<void> {
	// Resolve client ID
	const clientId = await promptRequired(
		"OAuth Client ID:",
		args["client-id"] ?? process.env["BACKLOG_OAUTH_CLIENT_ID"],
	);

	// Resolve client secret
	const clientSecret = await promptRequired(
		"OAuth Client Secret:",
		args["client-secret"] ?? process.env["BACKLOG_OAUTH_CLIENT_SECRET"],
	);

	// Start callback server
	const callbackServer = startCallbackServer();
	const redirectUri = `http://localhost:${callbackServer.port}/callback`;
	const state = crypto.randomUUID();

	// Build authorization URL
	const authUrl = new URL(`https://${hostname}/OAuth2AccessRequest.action`);
	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("client_id", clientId);
	authUrl.searchParams.set("redirect_uri", redirectUri);
	authUrl.searchParams.set("state", state);

	consola.info("Opening browser for authorization...");
	consola.info(`If the browser doesn't open, visit: ${authUrl.toString()}`);

	await openUrl(authUrl.toString());

	// Wait for callback
	let code: string;
	try {
		code = await callbackServer.waitForCallback(state);
	} catch (error) {
		callbackServer.stop();
		consola.error(`OAuth authorization failed: ${error instanceof Error ? error.message : String(error)}`);
		return process.exit(1);
	} finally {
		callbackServer.stop();
	}

	// Exchange code for tokens
	consola.start("Exchanging authorization code for tokens...");

	let tokenResponse: Awaited<ReturnType<typeof exchangeAuthorizationCode>>;
	try {
		tokenResponse = await exchangeAuthorizationCode({
			host: hostname,
			code,
			clientId,
			clientSecret,
			redirectUri,
		});
	} catch {
		consola.error("Failed to exchange authorization code for tokens.");
		return process.exit(1);
	}

	// Verify the tokens
	const client = createClient({ host: hostname, accessToken: tokenResponse.access_token });
	let user: BacklogUser;
	try {
		user = await client<BacklogUser>("/users/myself");
	} catch {
		consola.error("Authentication verification failed.");
		return process.exit(1);
	}

	await saveSpace(hostname, {
		method: "oauth",
		accessToken: tokenResponse.access_token,
		refreshToken: tokenResponse.refresh_token,
		clientId,
		clientSecret,
	});
	consola.success(`Logged in to ${hostname} as ${user.name} (${user.userId})`);
}

async function saveSpace(
	hostname: string,
	auth:
		| { method: "api-key"; apiKey: string }
		| {
				method: "oauth";
				accessToken: string;
				refreshToken: string;
				clientId: string;
				clientSecret: string;
		  },
): Promise<void> {
	const host = hostname as `${string}.backlog.com` | `${string}.backlog.jp`;
	const existing = await resolveSpace(hostname);
	if (existing) {
		await updateSpaceAuth(host, auth);
	} else {
		await addSpace({ host, auth });
	}

	const config = await loadConfig();
	if (!config.defaultSpace) {
		await writeConfig({ ...config, defaultSpace: hostname });
	}
}

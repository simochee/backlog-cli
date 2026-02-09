import { type $Fetch, createClient, formatResetTime, refreshAccessToken } from "@repo/api";
import { resolveSpace, updateSpaceAuth } from "@repo/config";
import consola from "consola";
import { type FetchOptions, ofetch } from "ofetch";
import { joinURL } from "ufo";

/** The type of the authenticated API client returned by `createClient`. */
export type BacklogClient = ReturnType<typeof createClient>;

/**
 * Resolves the active space and creates an authenticated API client.
 *
 * Authentication is resolved in priority order:
 * 1. Configured space (via --space flag, BACKLOG_SPACE env, or defaultSpace)
 * 2. BACKLOG_API_KEY + BACKLOG_SPACE environment variables (lowest priority fallback)
 *
 * For OAuth authentication, automatically refreshes the access token when it expires (401 error).
 *
 * @param hostname - Optional explicit space hostname (--space flag).
 * @returns The authenticated client and host string.
 */
export async function getClient(hostname?: string): Promise<{
	client: BacklogClient;
	host: string;
}> {
	const space = await resolveSpace(hostname);

	if (space) {
		if (space.auth.method === "api-key") {
			return {
				client: createClient({ host: space.host, apiKey: space.auth.apiKey }),
				host: space.host,
			};
		}

		// OAuth: Create client with automatic token refresh on 401
		if (space.auth.method !== "oauth") {
			throw new Error("Expected OAuth authentication");
		}

		const oauthAuth = space.auth;
		let currentAccessToken = oauthAuth.accessToken;
		let refreshPromise: Promise<void> | null = null;

		// Helper to refresh the token
		const refreshTokenIfNeeded = async (): Promise<void> => {
			if (refreshPromise) {
				await refreshPromise;
				return;
			}

			const { clientId, clientSecret, refreshToken } = oauthAuth;

			if (!clientId || !clientSecret || !refreshToken) {
				consola.error("OAuth credentials missing. Please re-authenticate with `backlog auth login -m oauth`.");
				throw new Error("OAuth credentials missing");
			}

			refreshPromise = (async () => {
				try {
					consola.start("Access token expired. Refreshing...");
					const tokenResponse = await refreshAccessToken({
						host: space.host,
						refreshToken,
						clientId,
						clientSecret,
					});

					currentAccessToken = tokenResponse.access_token;

					await updateSpaceAuth(space.host, {
						method: "oauth",
						accessToken: tokenResponse.access_token,
						refreshToken: tokenResponse.refresh_token,
						clientId,
						clientSecret,
					});

					consola.success("Token refreshed successfully");
				} catch (error) {
					consola.error("Failed to refresh token. Please re-authenticate with `backlog auth login -m oauth`.");
					throw error;
				} finally {
					refreshPromise = null;
				}
			})();

			await refreshPromise;
		};

		// Create base client
		const baseClient = ofetch.create({
			baseURL: joinURL(`https://${space.host}`, "/api/v2"),
			headers: {
				get Authorization() {
					return `Bearer ${currentAccessToken}`;
				},
			},
			onResponseError({ response }) {
				// Handle rate limiting
				if (response.status === 429) {
					const resetEpoch = response.headers.get("X-RateLimit-Reset");
					const resetMessage = resetEpoch
						? `Rate limit resets at ${formatResetTime(Number(resetEpoch))}.`
						: "Please wait and try again later.";
					throw new Error(`API rate limit exceeded. ${resetMessage}`);
				}
			},
		});

		// Wrap client to handle 401 and retry with refreshed token
		const client = (async (url: string, options?: FetchOptions) => {
			try {
				return await baseClient(url, options);
			} catch (error: unknown) {
				// Check if it's a 401 error
				if (error && typeof error === "object" && "status" in error && error.status === 401) {
					await refreshTokenIfNeeded();
					// Retry with new token
					return await baseClient(url, options);
				}
				throw error;
			}
		}) as $Fetch;

		return {
			client,
			host: space.host,
		};
	}

	// Fallback: BACKLOG_API_KEY + BACKLOG_SPACE environment variables
	const envApiKey = process.env["BACKLOG_API_KEY"];
	const envHost = hostname ?? process.env["BACKLOG_SPACE"];

	if (envApiKey && envHost) {
		return {
			client: createClient({ host: envHost, apiKey: envApiKey }),
			host: envHost,
		};
	}

	consola.error("No space configured. Run `backlog auth login` to authenticate.");
	return process.exit(1);
}

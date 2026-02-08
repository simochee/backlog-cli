import { type $Fetch, ofetch } from "ofetch";
import { joinURL } from "ufo";

export interface BacklogClientConfig {
	/** Backlog space hostname (e.g., "example.backlog.com") */
	host: string;
	/** API Key for authentication. Mutually exclusive with accessToken. */
	apiKey?: string;
	/** OAuth access token. Mutually exclusive with apiKey. */
	accessToken?: string;
}

/**
 * Formats a UTC epoch seconds value into a localized date-time string.
 */
export function formatResetTime(epochSeconds: number): string {
	const date = new Date(epochSeconds * 1000);
	return date.toLocaleString();
}

/**
 * Creates a pre-configured HTTP client for the Backlog API v2.
 *
 * Supports both API Key (query parameter) and OAuth 2.0 (Bearer token) authentication.
 */
export function createClient(config: BacklogClientConfig): $Fetch {
	return ofetch.create({
		baseURL: joinURL(`https://${config.host}`, "/api/v2"),
		headers: config.accessToken ? { Authorization: `Bearer ${config.accessToken}` } : {},
		query: config.apiKey ? { apiKey: config.apiKey } : {},
		onResponseError({ response }) {
			if (response.status === 429) {
				const resetEpoch = response.headers.get("X-RateLimit-Reset");
				const resetMessage = resetEpoch
					? `Rate limit resets at ${formatResetTime(Number(resetEpoch))}.`
					: "Please wait and try again later.";
				throw new Error(`API rate limit exceeded. ${resetMessage}`);
			}
		},
	});
}

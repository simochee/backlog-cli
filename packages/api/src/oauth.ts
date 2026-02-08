import { ofetch } from "ofetch";

export interface OAuthTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
}

export interface ExchangeAuthorizationCodeParams {
	host: string;
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

export interface RefreshAccessTokenParams {
	host: string;
	refreshToken: string;
	clientId: string;
	clientSecret: string;
}

/**
 * Exchanges an authorization code for access and refresh tokens.
 */
export function exchangeAuthorizationCode(params: ExchangeAuthorizationCodeParams): Promise<OAuthTokenResponse> {
	return ofetch<OAuthTokenResponse>(`https://${params.host}/api/v2/oauth2/token`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code: params.code,
			client_id: params.clientId,
			client_secret: params.clientSecret,
			redirect_uri: params.redirectUri,
		}).toString(),
	});
}

/**
 * Refreshes an access token using a refresh token.
 */
export function refreshAccessToken(params: RefreshAccessTokenParams): Promise<OAuthTokenResponse> {
	return ofetch<OAuthTokenResponse>(`https://${params.host}/api/v2/oauth2/token`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			client_id: params.clientId,
			client_secret: params.clientSecret,
			refresh_token: params.refreshToken,
		}).toString(),
	});
}

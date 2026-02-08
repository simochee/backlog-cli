/** 5 minutes in milliseconds */
const CALLBACK_TIMEOUT_MS = 300_000;
const CALLBACK_PORT = 5_033;

const SUCCESS_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Authentication Successful</title></head>
<body style="font-family:system-ui;text-align:center;padding:2em">
<h1>Authentication Successful</h1>
<p>You can close this window and return to the terminal.</p>
</body></html>`;

const ERROR_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Authentication Failed</title></head>
<body style="font-family:system-ui;text-align:center;padding:2em">
<h1>Authentication Failed</h1>
<p>Something went wrong. Please try again.</p>
</body></html>`;

export interface CallbackServer {
	port: number;
	waitForCallback: (expectedState: string) => Promise<string>;
	stop: () => void;
}

/**
 * Starts a local HTTP server to receive the OAuth callback.
 *
 * Listens on port 5033 (Nulab's stock code).
 */
export function startCallbackServer(): CallbackServer {
	let resolveCode: ((code: string) => void) | null = null;
	let rejectCode: ((error: Error) => void) | null = null;

	const server = Bun.serve({
		port: CALLBACK_PORT,
		fetch(request) {
			const url = new URL(request.url);

			if (url.pathname !== "/callback") {
				return new Response("Not Found", { status: 404 });
			}

			const code = url.searchParams.get("code");
			const state = url.searchParams.get("state");
			const error = url.searchParams.get("error");

			if (error) {
				rejectCode?.(new Error(`OAuth error: ${error}`));
				return new Response(ERROR_HTML, {
					headers: { "Content-Type": "text/html" },
				});
			}

			if (!code || !state) {
				rejectCode?.(new Error("Missing code or state parameter"));
				return new Response(ERROR_HTML, {
					headers: { "Content-Type": "text/html" },
				});
			}

			resolveCode?.(`${code}:${state}`);
			return new Response(SUCCESS_HTML, {
				headers: { "Content-Type": "text/html" },
			});
		},
	});

	return {
		port: server.port,
		waitForCallback(expectedState: string): Promise<string> {
			return new Promise<string>((resolve, reject) => {
				const timeout = setTimeout(() => {
					reject(new Error("OAuth callback timed out after 5 minutes"));
					server.stop();
				}, CALLBACK_TIMEOUT_MS);

				resolveCode = (codeAndState: string) => {
					clearTimeout(timeout);
					const [code, state] = codeAndState.split(":");
					if (state === expectedState) {
						resolve(code!);
					} else {
						reject(new Error("OAuth state mismatch — possible CSRF attack"));
					}
				};

				rejectCode = (error: Error) => {
					clearTimeout(timeout);
					reject(error);
				};
			});
		},
		stop() {
			server.stop();
		},
	};
}

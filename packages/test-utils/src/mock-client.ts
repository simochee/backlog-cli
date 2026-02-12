import { mock } from "bun:test";

/**
 * Sets up a mock client with `getClient` returning `{ client, host }`.
 * Returns the mock client function for configuring per-test responses.
 */
export function setupMockClient(getClientMock: (...args: never[]) => unknown, host = "example.backlog.com") {
	const mockClient = mock();
	(getClientMock as any).mockResolvedValue({ client: mockClient as never, host });
	return mockClient;
}

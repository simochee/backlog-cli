import { vi } from "vitest";

/**
 * Sets up a mock client with `getClient` returning `{ client, host }`.
 * Returns the mock client function for configuring per-test responses.
 */
export function setupMockClient(getClientMock: (...args: unknown[]) => unknown, host = "example.backlog.com") {
	const mockClient = vi.fn();
	vi.mocked(getClientMock).mockResolvedValue({ client: mockClient as never, host });
	return mockClient;
}

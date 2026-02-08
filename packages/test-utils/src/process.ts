import { vi } from "vitest";

/**
 * Spies on `process.exit` and suppresses the actual exit.
 * Returns the spy for assertions. Call `.mockRestore()` when done.
 */
export function spyOnProcessExit() {
	return vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
}

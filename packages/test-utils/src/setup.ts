import { beforeEach } from "bun:test";

import mockConsola from "./mock-consola.ts";

// Clear shared mock state between tests (bun:test shares mocks globally across files)
beforeEach(() => {
	for (const fn of Object.values(mockConsola)) {
		fn.mockClear();
	}
});

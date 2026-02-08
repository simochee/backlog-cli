import { vi } from "vitest";

export default {
	log: vi.fn(),
	info: vi.fn(),
	success: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
	start: vi.fn(),
	prompt: vi.fn(),
	debug: vi.fn(),
};

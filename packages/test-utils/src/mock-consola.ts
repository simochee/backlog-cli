import { mock } from "bun:test";

const mockConsola = {
	log: mock(),
	info: mock(),
	success: mock(),
	warn: mock(),
	error: mock(),
	start: mock(),
	prompt: mock(),
	debug: mock(),
};

export default mockConsola;

import type { FastifyInstance } from "fastify";
import { dashboardController } from "./dashboard.controller";
import { dashboardSchemas } from "./dashboard.schemas";

export async function dashboardRoutes(app: FastifyInstance) {
	app.get(
		"/summary",
		{ schema: dashboardSchemas.summary },
		dashboardController.summary,
	);
}

import Fastify from "fastify";
import { env } from "./config/env";
import { areasRoutes } from "./modules/areas/areas.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { processesRoutes } from "./modules/processes/processes.routes";
import { registerCors } from "./plugins/cors";
import { registerSwagger } from "./plugins/swagger";
import { internalErrorResponseSchema } from "./shared/docs/openapi.schemas";
import { errorHandler } from "./shared/errors/error-handler";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "development" ? "info" : "warn",
    },
  });

  await registerCors(app);
  await registerSwagger(app);

	app.get(
		"/health",
		{
			schema: {
				tags: ["Saúde"],
				summary: "Health check",
				description: "Verifica se a API está em execução.",
				response: {
					200: {
						type: "object",
						additionalProperties: false,
						required: ["status"],
						properties: {
							status: { type: "string", enum: ["ok"] },
						},
					},
					500: internalErrorResponseSchema,
				},
			},
		},
		async () => ({ status: "ok" }),
	);

  await app.register(dashboardRoutes, { prefix: "/dashboard" });
  await app.register(areasRoutes, { prefix: "/areas" });
  await app.register(processesRoutes);

  app.setErrorHandler(errorHandler);

  return app;
}

import type { FastifyInstance } from "fastify";
import { areasController } from "./areas.controller";
import { areasSchemas } from "./areas.schemas";

export async function areasRoutes(app: FastifyInstance) {
	app.get("/", { schema: areasSchemas.list }, areasController.list);
	app.post("/", { schema: areasSchemas.create }, areasController.create);
	app.get("/:id", { schema: areasSchemas.getById }, areasController.getById);
	app.put("/:id", { schema: areasSchemas.update }, areasController.update);
	app.delete("/:id", { schema: areasSchemas.remove }, areasController.remove);
}

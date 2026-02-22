import type { FastifyInstance } from "fastify";
import { processesController } from "./processes.controller";
import { processesSchemas } from "./processes.schemas";

export async function processesRoutes(app: FastifyInstance) {
	app.get(
		"/areas/:areaId/processes/tree",
		{ schema: processesSchemas.getTreeByArea },
		processesController.getTreeByArea,
	);

	app.post(
		"/areas/:areaId/processes",
		{ schema: processesSchemas.create },
		processesController.create,
	);

	app.get(
		"/processes/:id",
		{ schema: processesSchemas.getById },
		processesController.getById,
	);
	app.put(
		"/processes/:id",
		{ schema: processesSchemas.update },
		processesController.update,
	);
	app.delete(
		"/processes/:id",
		{ schema: processesSchemas.remove },
		processesController.remove,
	);

	app.post(
		"/processes/:id/tools",
		{ schema: processesSchemas.linkTool },
		processesController.linkTool,
	);
	app.delete(
		"/processes/:id/tools/:toolId",
		{ schema: processesSchemas.unlinkTool },
		processesController.unlinkTool,
	);

	app.post(
		"/processes/:id/people",
		{ schema: processesSchemas.linkPerson },
		processesController.linkPerson,
	);
	app.delete(
		"/processes/:id/people/:personId",
		{ schema: processesSchemas.unlinkPerson },
		processesController.unlinkPerson,
	);

	app.post(
		"/processes/:id/documents",
		{ schema: processesSchemas.linkDocument },
		processesController.linkDocument,
	);
	app.delete(
		"/processes/:id/documents/:documentId",
		{ schema: processesSchemas.unlinkDocument },
		processesController.unlinkDocument,
	);
}

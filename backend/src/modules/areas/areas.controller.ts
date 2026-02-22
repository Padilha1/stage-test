import type { FastifyReply, FastifyRequest } from "fastify";
import {
	areaParamsSchema,
	createAreaSchema,
	updateAreaSchema,
} from "./areas.dto";
import { AreasService } from "./areas.service";

const service = new AreasService();

export class AreasController {
	async list(_request: FastifyRequest, reply: FastifyReply) {
		const areas = await service.list();
		return reply.send(areas);
	}

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { id } = areaParamsSchema.parse(request.params);
		const area = await service.getById(id);
		return reply.send(area);
	}

	async create(
		request: FastifyRequest<{ Body: unknown }>,
		reply: FastifyReply,
	) {
		const payload = createAreaSchema.parse(request.body);
		const area = await service.create(payload);
		return reply.status(201).send(area);
	}

	async update(
		request: FastifyRequest<{ Params: { id: string }; Body: unknown }>,
		reply: FastifyReply,
	) {
		const { id } = areaParamsSchema.parse(request.params);
		const payload = updateAreaSchema.parse(request.body);
		const area = await service.update(id, payload);
		return reply.send(area);
	}

	async remove(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { id } = areaParamsSchema.parse(request.params);
		const result = await service.remove(id);
		return reply.send(result);
	}
}

export const areasController = new AreasController();

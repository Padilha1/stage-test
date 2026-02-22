import type { FastifyReply, FastifyRequest } from "fastify";
import {
	areaParamsSchema,
	createProcessSchema,
	linkDocumentSchema,
	linkPersonSchema,
	linkToolSchema,
	processParamsSchema,
	updateProcessSchema,
} from "./processes.dto";
import { ProcessesService } from "./processes.service";

const service = new ProcessesService();

export class ProcessesController {
	async getTreeByArea(
		request: FastifyRequest<{ Params: { areaId: string } }>,
		reply: FastifyReply,
	) {
		const { areaId } = areaParamsSchema.parse(request.params);
		const tree = await service.getTreeByArea(areaId);
		return reply.send(tree);
	}

	async create(
		request: FastifyRequest<{ Params: { areaId: string }; Body: unknown }>,
		reply: FastifyReply,
	) {
		const { areaId } = areaParamsSchema.parse(request.params);
		const payload = createProcessSchema.parse(request.body);
		const process = await service.create(areaId, payload);
		return reply.status(201).send(process);
	}

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { id } = processParamsSchema.parse(request.params);
		const process = await service.getById(id);
		return reply.send(process);
	}

	async update(
		request: FastifyRequest<{ Params: { id: string }; Body: unknown }>,
		reply: FastifyReply,
	) {
		const { id } = processParamsSchema.parse(request.params);
		const payload = updateProcessSchema.parse(request.body);
		const process = await service.update(id, payload);
		return reply.send(process);
	}

	async remove(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { id } = processParamsSchema.parse(request.params);
		const result = await service.remove(id);
		return reply.send(result);
	}

	async linkTool(
		request: FastifyRequest<{ Params: { id: string }; Body: unknown }>,
		reply: FastifyReply,
	) {
		const { id } = processParamsSchema.parse(request.params);
		const payload = linkToolSchema.parse(request.body);
		const process = await service.linkTool(id, payload);
		return reply.send(process);
	}

	async unlinkTool(
		request: FastifyRequest<{ Params: { id: string; toolId: string } }>,
		reply: FastifyReply,
	) {
		const params = processParamsSchema
			.extend({ toolId: processParamsSchema.shape.id })
			.parse(request.params);

		const result = await service.unlinkTool(params.id, params.toolId);
		return reply.send(result);
	}

	async linkPerson(
		request: FastifyRequest<{ Params: { id: string }; Body: unknown }>,
		reply: FastifyReply,
	) {
		const { id } = processParamsSchema.parse(request.params);
		const payload = linkPersonSchema.parse(request.body);
		const process = await service.linkPerson(id, payload);
		return reply.send(process);
	}

	async unlinkPerson(
		request: FastifyRequest<{ Params: { id: string; personId: string } }>,
		reply: FastifyReply,
	) {
		const params = processParamsSchema
			.extend({ personId: processParamsSchema.shape.id })
			.parse(request.params);

		const result = await service.unlinkPerson(params.id, params.personId);
		return reply.send(result);
	}

	async linkDocument(
		request: FastifyRequest<{ Params: { id: string }; Body: unknown }>,
		reply: FastifyReply,
	) {
		const { id } = processParamsSchema.parse(request.params);
		const payload = linkDocumentSchema.parse(request.body);
		const process = await service.linkDocument(id, payload);
		return reply.send(process);
	}

	async unlinkDocument(
		request: FastifyRequest<{ Params: { id: string; documentId: string } }>,
		reply: FastifyReply,
	) {
		const params = processParamsSchema
			.extend({ documentId: processParamsSchema.shape.id })
			.parse(request.params);

		const result = await service.unlinkDocument(params.id, params.documentId);
		return reply.send(result);
	}
}

export const processesController = new ProcessesController();

import type { FastifyReply, FastifyRequest } from "fastify";
import { DashboardService } from "./dashboard.service";

const service = new DashboardService();

export class DashboardController {
	async summary(_request: FastifyRequest, reply: FastifyReply) {
		const data = await service.getSummary();
		return reply.send(data);
	}
}

export const dashboardController = new DashboardController();

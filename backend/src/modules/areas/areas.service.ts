import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import type { CreateAreaInput, UpdateAreaInput } from "./areas.dto";

export class AreasService {
	async list() {
		return prisma.area.findMany({
			orderBy: { createdAt: "desc" },
		});
	}

	async getById(id: string) {
		const area = await prisma.area.findUnique({ where: { id } });

		if (!area) {
			throw new AppError({
				type: "not_found",
				message: "Área não encontrada",
				statusCode: 404,
			});
		}

		return area;
	}

	async create(payload: CreateAreaInput) {
		return prisma.area.create({
			data: payload,
		});
	}

	async update(id: string, payload: UpdateAreaInput) {
		await this.getById(id);

		return prisma.area.update({
			where: { id },
			data: payload,
		});
	}

	async remove(id: string) {
		await this.getById(id);

		await prisma.area.delete({ where: { id } });

		return { success: true };
	}
}

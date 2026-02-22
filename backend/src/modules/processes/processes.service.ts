import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import type {
	CreateProcessInput,
	LinkDocumentInput,
	LinkPersonInput,
	LinkToolInput,
	UpdateProcessInput,
} from "./processes.dto";

function notFound(message: string) {
	return new AppError({
		type: "not_found",
		message,
		statusCode: 404,
	});
}

function validationError(field: string, reason: string) {
	return new AppError({
		type: "validation_error",
		message: "Payload inválido",
		statusCode: 400,
		details: [{ field, reason }],
	});
}

export class ProcessesService {
	private async ensureAreaExists(areaId: string) {
		const area = await prisma.area.findUnique({ where: { id: areaId } });
		if (!area) throw notFound("Área não encontrada");
		return area;
	}

	async getTreeByArea(areaId: string) {
		await this.ensureAreaExists(areaId);

		const processes = await prisma.process.findMany({
			where: { areaId },
			orderBy: { createdAt: "asc" },
			include: {
				tools: { include: { tool: true } },
				people: { include: { person: true } },
				documents: { include: { document: true } },
			},
		});

		const map = new Map(
			processes.map((process) => [
				process.id,
				{
					...process,
					children: [] as Array<Record<string, unknown>>,
				},
			]),
		);

		const roots: Array<Record<string, unknown>> = [];

		for (const process of processes) {
			const node = map.get(process.id);
			if (!node) continue;

			if (process.parentId) {
				const parent = map.get(process.parentId);
				if (parent) {
					(parent.children as Array<Record<string, unknown>>).push(node);
					continue;
				}
			}

			roots.push(node);
		}

		return roots;
	}

	async create(areaId: string, payload: CreateProcessInput) {
		await this.ensureAreaExists(areaId);

		if (payload.parentId) {
			const parent = await prisma.process.findUnique({
				where: { id: payload.parentId },
			});
			if (!parent || parent.areaId !== areaId) {
				throw notFound("Processo pai não encontrado nesta área");
			}
		}

		return prisma.process.create({
			data: {
				areaId,
				parentId: payload.parentId ?? null,
				name: payload.name,
				description: payload.description,
				kind: payload.kind,
				status: payload.status,
				importance: payload.importance,
			},
		});
	}

	async getById(id: string) {
		const process = await prisma.process.findUnique({
			where: { id },
			include: {
				area: true,
				parent: true,
				children: true,
				tools: { include: { tool: true } },
				people: { include: { person: true } },
				documents: { include: { document: true } },
			},
		});

		if (!process) throw notFound("Processo não encontrado");
		return process;
	}

	async update(id: string, payload: UpdateProcessInput) {
		const existing = await prisma.process.findUnique({ where: { id } });
		if (!existing) throw notFound("Processo não encontrado");

		if (payload.parentId) {
			if (payload.parentId === id) {
				throw new AppError({
					type: "validation_error",
					message: "Um processo não pode ser pai de si mesmo",
					statusCode: 400,
					details: [{ field: "parentId", reason: "parentId inválido" }],
				});
			}

			const parent = await prisma.process.findUnique({
				where: { id: payload.parentId },
			});
			if (!parent || parent.areaId !== existing.areaId) {
				throw notFound("Processo pai não encontrado nesta área");
			}
		}

		return prisma.process.update({
			where: { id },
			data: {
				parentId: payload.parentId,
				name: payload.name,
				description: payload.description,
				kind: payload.kind,
				status: payload.status,
				importance: payload.importance,
			},
		});
	}

	async remove(id: string) {
		const existing = await prisma.process.findUnique({ where: { id } });
		if (!existing) throw notFound("Processo não encontrado");

		await prisma.process.delete({ where: { id } });
		return { success: true };
	}

	async linkTool(processId: string, payload: LinkToolInput) {
		await this.getById(processId);

		let tool = null;

		if (payload.toolId) {
			tool = await prisma.tool.findUnique({ where: { id: payload.toolId } });
		}
		if (!payload.toolId) {
			if (!payload.name) {
				throw validationError("name", "Informe o nome da ferramenta");
			}

			const toolName = payload.name.trim();
			if (!toolName) {
				throw validationError(
					"name",
					"O nome da ferramenta não pode ser vazio",
				);
			}

			tool = await prisma.tool.upsert({
				where: { name: toolName },
				create: { name: toolName, url: payload.url },
				update: { url: payload.url ?? undefined },
			});
		}

		if (!tool) throw notFound("Ferramenta não encontrada");

		await prisma.processTool.upsert({
			where: {
				processId_toolId: {
					processId,
					toolId: tool.id,
				},
			},
			create: {
				processId,
				toolId: tool.id,
			},
			update: {},
		});

		return this.getById(processId);
	}

	async unlinkTool(processId: string, toolId: string) {
		await this.getById(processId);

		await prisma.processTool.deleteMany({
			where: {
				processId,
				toolId,
			},
		});

		return { success: true };
	}

	async linkPerson(processId: string, payload: LinkPersonInput) {
		await this.getById(processId);

		let person = null;

		if (payload.personId) {
			person = await prisma.person.findUnique({ where: { id: payload.personId } });
		}
		if (!payload.personId) {
			if (!payload.name) {
				throw validationError("name", "Informe o nome do responsável");
			}

			const personName = payload.name.trim();
			if (!personName) {
				throw validationError(
					"name",
					"O nome do responsável não pode ser vazio",
				);
			}

			person = await prisma.person.create({
				data: {
					name: personName,
					email: payload.email,
				},
			});
		}

		if (!person) throw notFound("Responsável não encontrado");

		await prisma.processPerson.upsert({
			where: {
				processId_personId: {
					processId,
					personId: person.id,
				},
			},
			create: {
				processId,
				personId: person.id,
			},
			update: {},
		});

		return this.getById(processId);
	}

	async unlinkPerson(processId: string, personId: string) {
		await this.getById(processId);

		await prisma.processPerson.deleteMany({
			where: {
				processId,
				personId,
			},
		});

		return { success: true };
	}

	async linkDocument(processId: string, payload: LinkDocumentInput) {
		await this.getById(processId);

		let document = null;

		if (payload.documentId) {
			document = await prisma.document.findUnique({
				where: { id: payload.documentId },
			});
		}
		if (!payload.documentId) {
			if (!payload.title) {
				throw validationError("title", "Informe o título do documento");
			}

			const documentTitle = payload.title.trim();
			if (!documentTitle) {
				throw validationError(
					"title",
					"O título do documento não pode ser vazio",
				);
			}

			document = await prisma.document.create({
				data: {
					title: documentTitle,
					type: payload.type,
					url: payload.url,
					storageKey: payload.storageKey,
					mimeType: payload.mimeType,
					sizeBytes: payload.sizeBytes,
				},
			});
		}

		if (!document) throw notFound("Documento não encontrado");

		await prisma.processDocument.upsert({
			where: {
				processId_documentId: {
					processId,
					documentId: document.id,
				},
			},
			create: {
				processId,
				documentId: document.id,
			},
			update: {},
		});

		return this.getById(processId);
	}

	async unlinkDocument(processId: string, documentId: string) {
		await this.getById(processId);

		await prisma.processDocument.deleteMany({
			where: {
				processId,
				documentId,
			},
		});

		return { success: true };
	}
}

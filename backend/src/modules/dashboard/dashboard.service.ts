import { prisma } from "../../db/prisma";

export class DashboardService {
	async getSummary() {
		const [
			areasCount,
			processesCount,
			subprocessesCount,
			toolsCount,
			peopleCount,
			documentsCount,
			withoutDocumentsCount,
			withoutPeopleCount,
			byStatus,
			byKind,
			byImportance,
			topTools,
		] = await prisma.$transaction([
			prisma.area.count(),
			prisma.process.count(),
			prisma.process.count({ where: { parentId: { not: null } } }),
			prisma.tool.count(),
			prisma.person.count(),
			prisma.document.count(),
			prisma.process.count({ where: { documents: { none: {} } } }),
			prisma.process.count({ where: { people: { none: {} } } }),
			prisma.process.groupBy({
				by: ["status"],
				_count: { _all: true },
				orderBy: { status: "asc" },
			}),
			prisma.process.groupBy({
				by: ["kind"],
				_count: { _all: true },
				orderBy: { kind: "asc" },
			}),
			prisma.process.groupBy({
				by: ["importance"],
				_count: { _all: true },
				orderBy: { importance: "asc" },
			}),
			prisma.tool.findMany({
				select: {
					id: true,
					name: true,
					_count: {
						select: {
							processes: true,
						},
					},
				},
				orderBy: {
					processes: {
						_count: "desc",
					},
				},
				take: 5,
			}),
		]);

		return {
			totais: {
				areas: areasCount,
				processos: processesCount,
				subprocessos: subprocessesCount,
				ferramentas: toolsCount,
				responsaveis: peopleCount,
				documentos: documentsCount,
			},
			distribuicao: {
				porStatus: byStatus.map((row) => ({
					label: String(row.status),
					count: (row._count as { _all?: number } | undefined)?._all ?? 0,
				})),
				porTipo: byKind.map((row) => ({
					label: String(row.kind),
					count: (row._count as { _all?: number } | undefined)?._all ?? 0,
				})),
				porImportancia: byImportance.map((row) => ({
					label: String(row.importance),
					count: (row._count as { _all?: number } | undefined)?._all ?? 0,
				})),
			},
			pendencias: {
				processosSemDocumentos: withoutDocumentsCount,
				processosSemResponsaveis: withoutPeopleCount,
			},
			topFerramentas: topTools.map((tool) => ({
				id: tool.id,
				nome: tool.name,
				usoEmProcessos: tool._count.processes,
			})),
		};
	}
}

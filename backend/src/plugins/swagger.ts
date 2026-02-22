import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

export async function registerSwagger(app: FastifyInstance) {
	await app.register(swagger, {
		openapi: {
			info: {
				title: "API de Mapeamento de Processos",
				version: "0.1.0",
				description:
					"API REST para cadastro de áreas, processos, subprocessos e vínculos de ferramentas, responsáveis e documentos.",
			},
			tags: [
				{ name: "Saúde", description: "Monitoramento da aplicação" },
				{ name: "Dashboard", description: "Indicadores e visão gerencial" },
				{ name: "Áreas", description: "Gestão das áreas da empresa" },
				{ name: "Processos", description: "Gestão de processos e subprocessos" },
				{
					name: "Vínculos de Processo",
					description: "Associação de ferramentas, responsáveis e documentos",
				},
			],
		},
	});

	await app.register(swaggerUi, {
		routePrefix: "/docs",
	});
}

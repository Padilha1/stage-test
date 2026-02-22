import {
	internalErrorResponseSchema,
} from "../../shared/docs/openapi.schemas";

const distributionItemSchema = {
	type: "object",
	additionalProperties: false,
	required: ["label", "count"],
	properties: {
		label: { type: "string" },
		count: { type: "integer", minimum: 0 },
	},
} as const;

const topToolSchema = {
	type: "object",
	additionalProperties: false,
	required: ["id", "nome", "usoEmProcessos"],
	properties: {
		id: { type: "string" },
		nome: { type: "string" },
		usoEmProcessos: { type: "integer", minimum: 0 },
	},
} as const;

export const dashboardSchemas = {
	summary: {
		tags: ["Dashboard"],
		summary: "Resumo geral do dashboard",
		description:
			"Retorna totais, distribuições e pendências para visão executiva dos processos.",
		response: {
			200: {
				type: "object",
				additionalProperties: false,
				required: ["totais", "distribuicao", "pendencias", "topFerramentas"],
				properties: {
					totais: {
						type: "object",
						additionalProperties: false,
						required: [
							"areas",
							"processos",
							"subprocessos",
							"ferramentas",
							"responsaveis",
							"documentos",
						],
						properties: {
							areas: { type: "integer", minimum: 0 },
							processos: { type: "integer", minimum: 0 },
							subprocessos: { type: "integer", minimum: 0 },
							ferramentas: { type: "integer", minimum: 0 },
							responsaveis: { type: "integer", minimum: 0 },
							documentos: { type: "integer", minimum: 0 },
						},
					},
					distribuicao: {
						type: "object",
						additionalProperties: false,
						required: ["porStatus", "porTipo", "porImportancia"],
						properties: {
							porStatus: {
								type: "array",
								items: distributionItemSchema,
							},
							porTipo: {
								type: "array",
								items: distributionItemSchema,
							},
							porImportancia: {
								type: "array",
								items: distributionItemSchema,
							},
						},
					},
					pendencias: {
						type: "object",
						additionalProperties: false,
						required: ["processosSemDocumentos", "processosSemResponsaveis"],
						properties: {
							processosSemDocumentos: { type: "integer", minimum: 0 },
							processosSemResponsaveis: { type: "integer", minimum: 0 },
						},
					},
					topFerramentas: {
						type: "array",
						items: topToolSchema,
					},
				},
			},
			500: internalErrorResponseSchema,
		},
	},
} as const;

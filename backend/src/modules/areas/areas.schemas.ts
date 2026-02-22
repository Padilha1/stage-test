import {
	cuidSchema,
	dateTimeSchema,
	internalErrorResponseSchema,
	notFoundErrorResponseSchema,
	successResponseSchema,
	validationErrorResponseSchema,
} from "../../shared/docs/openapi.schemas";

const areaSchema = {
	type: "object",
	additionalProperties: false,
	required: ["id", "name", "description", "createdAt", "updatedAt"],
	properties: {
		id: cuidSchema,
		name: { type: "string" },
		description: { type: ["string", "null"] },
		createdAt: dateTimeSchema,
		updatedAt: dateTimeSchema,
	},
} as const;

const areaParamsSchema = {
	type: "object",
	additionalProperties: false,
	required: ["id"],
	properties: {
		id: cuidSchema,
	},
} as const;

const createAreaBodySchema = {
	type: "object",
	additionalProperties: false,
	required: ["name"],
	properties: {
		name: { type: "string", minLength: 1, maxLength: 120 },
		description: { type: "string", maxLength: 5000 },
	},
} as const;

const updateAreaBodySchema = {
	type: "object",
	additionalProperties: false,
	minProperties: 1,
	properties: {
		name: { type: "string", minLength: 1, maxLength: 120 },
		description: { type: "string", maxLength: 5000 },
	},
} as const;

export const areasSchemas = {
	list: {
		tags: ["Áreas"],
		summary: "Listar áreas",
		description: "Retorna todas as áreas cadastradas.",
		response: {
			200: {
				type: "array",
				items: areaSchema,
			},
			500: internalErrorResponseSchema,
		},
	},
	getById: {
		tags: ["Áreas"],
		summary: "Buscar área por ID",
		description: "Retorna os detalhes de uma área específica.",
		params: areaParamsSchema,
		response: {
			200: areaSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	create: {
		tags: ["Áreas"],
		summary: "Criar área",
		description: "Cria uma nova área da empresa.",
		body: createAreaBodySchema,
		response: {
			201: areaSchema,
			400: validationErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	update: {
		tags: ["Áreas"],
		summary: "Atualizar área",
		description: "Atualiza parcialmente os dados de uma área.",
		params: areaParamsSchema,
		body: updateAreaBodySchema,
		response: {
			200: areaSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	remove: {
		tags: ["Áreas"],
		summary: "Remover área",
		description: "Remove uma área e seus processos relacionados.",
		params: areaParamsSchema,
		response: {
			200: successResponseSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
} as const;

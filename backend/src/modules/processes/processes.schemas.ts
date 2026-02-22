import {
	cuidSchema,
	dateTimeSchema,
	internalErrorResponseSchema,
	notFoundErrorResponseSchema,
	successResponseSchema,
	validationErrorResponseSchema,
} from "../../shared/docs/openapi.schemas";

const processKindSchema = {
	type: "string",
	enum: ["MANUAL", "SYSTEM"],
} as const;

const processStatusSchema = {
	type: "string",
	enum: ["DRAFT", "ACTIVE", "DEPRECATED"],
} as const;

const processImportanceSchema = {
	type: "string",
	enum: ["LOW", "MEDIUM", "HIGH"],
} as const;

const documentTypeSchema = {
	type: "string",
	enum: ["URL", "FILE"],
} as const;

const processSchema = {
	type: "object",
	additionalProperties: false,
	required: [
		"id",
		"areaId",
		"parentId",
		"name",
		"description",
		"kind",
		"status",
		"importance",
		"createdAt",
		"updatedAt",
	],
	properties: {
		id: cuidSchema,
		areaId: cuidSchema,
		parentId: { type: ["string", "null"] },
		name: { type: "string" },
		description: { type: ["string", "null"] },
		kind: processKindSchema,
		status: processStatusSchema,
		importance: processImportanceSchema,
		createdAt: dateTimeSchema,
		updatedAt: dateTimeSchema,
	},
} as const;

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

const toolSchema = {
	type: "object",
	additionalProperties: false,
	required: ["id", "name", "url", "createdAt", "updatedAt"],
	properties: {
		id: cuidSchema,
		name: { type: "string" },
		url: { type: ["string", "null"] },
		createdAt: dateTimeSchema,
		updatedAt: dateTimeSchema,
	},
} as const;

const personSchema = {
	type: "object",
	additionalProperties: false,
	required: ["id", "name", "email", "createdAt", "updatedAt"],
	properties: {
		id: cuidSchema,
		name: { type: "string" },
		email: { type: ["string", "null"] },
		createdAt: dateTimeSchema,
		updatedAt: dateTimeSchema,
	},
} as const;

const documentSchema = {
	type: "object",
	additionalProperties: false,
	required: [
		"id",
		"title",
		"url",
		"type",
		"storageKey",
		"mimeType",
		"sizeBytes",
		"createdAt",
		"updatedAt",
	],
	properties: {
		id: cuidSchema,
		title: { type: "string" },
		url: { type: ["string", "null"] },
		type: documentTypeSchema,
		storageKey: { type: ["string", "null"] },
		mimeType: { type: ["string", "null"] },
		sizeBytes: { type: ["number", "null"] },
		createdAt: dateTimeSchema,
		updatedAt: dateTimeSchema,
	},
} as const;

const processToolSchema = {
	type: "object",
	additionalProperties: false,
	required: ["processId", "toolId", "createdAt", "tool"],
	properties: {
		processId: cuidSchema,
		toolId: cuidSchema,
		createdAt: dateTimeSchema,
		tool: toolSchema,
	},
} as const;

const processPersonSchema = {
	type: "object",
	additionalProperties: false,
	required: ["processId", "personId", "createdAt", "person"],
	properties: {
		processId: cuidSchema,
		personId: cuidSchema,
		createdAt: dateTimeSchema,
		person: personSchema,
	},
} as const;

const processDocumentSchema = {
	type: "object",
	additionalProperties: false,
	required: ["processId", "documentId", "createdAt", "document"],
	properties: {
		processId: cuidSchema,
		documentId: cuidSchema,
		createdAt: dateTimeSchema,
		document: documentSchema,
	},
} as const;

const processDetailSchema = {
	type: "object",
	additionalProperties: false,
	required: [
		"id",
		"areaId",
		"parentId",
		"name",
		"description",
		"kind",
		"status",
		"importance",
		"createdAt",
		"updatedAt",
		"area",
		"parent",
		"children",
		"tools",
		"people",
		"documents",
	],
	properties: {
		...processSchema.properties,
		area: areaSchema,
		parent: {
			anyOf: [processSchema, { type: "null" }],
		},
		children: {
			type: "array",
			items: processSchema,
		},
		tools: {
			type: "array",
			items: processToolSchema,
		},
		people: {
			type: "array",
			items: processPersonSchema,
		},
		documents: {
			type: "array",
			items: processDocumentSchema,
		},
	},
} as const;

const processTreeNodeSchema = {
	type: "object",
	additionalProperties: false,
	required: [
		"id",
		"areaId",
		"parentId",
		"name",
		"description",
		"kind",
		"status",
		"importance",
		"createdAt",
		"updatedAt",
		"tools",
		"people",
		"documents",
		"children",
	],
	properties: {
		...processSchema.properties,
		tools: {
			type: "array",
			items: processToolSchema,
		},
		people: {
			type: "array",
			items: processPersonSchema,
		},
		documents: {
			type: "array",
			items: processDocumentSchema,
		},
		children: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: true,
			},
		},
	},
} as const;

const areaParamsSchema = {
	type: "object",
	additionalProperties: false,
	required: ["areaId"],
	properties: {
		areaId: cuidSchema,
	},
} as const;

const processParamsSchema = {
	type: "object",
	additionalProperties: false,
	required: ["id"],
	properties: {
		id: cuidSchema,
	},
} as const;

const processToolParamsSchema = {
	type: "object",
	additionalProperties: false,
	required: ["id", "toolId"],
	properties: {
		id: cuidSchema,
		toolId: cuidSchema,
	},
} as const;

const processPersonParamsSchema = {
	type: "object",
	additionalProperties: false,
	required: ["id", "personId"],
	properties: {
		id: cuidSchema,
		personId: cuidSchema,
	},
} as const;

const processDocumentParamsSchema = {
	type: "object",
	additionalProperties: false,
	required: ["id", "documentId"],
	properties: {
		id: cuidSchema,
		documentId: cuidSchema,
	},
} as const;

const createProcessBodySchema = {
	type: "object",
	additionalProperties: false,
	required: ["name"],
	properties: {
		parentId: { type: ["string", "null"], minLength: 1 },
		name: { type: "string", minLength: 1, maxLength: 150 },
		description: { type: "string", maxLength: 5000 },
		kind: processKindSchema,
		status: processStatusSchema,
		importance: processImportanceSchema,
	},
} as const;

const updateProcessBodySchema = {
	type: "object",
	additionalProperties: false,
	minProperties: 1,
	properties: {
		parentId: { type: ["string", "null"], minLength: 1 },
		name: { type: "string", minLength: 1, maxLength: 150 },
		description: { type: "string", maxLength: 5000 },
		kind: processKindSchema,
		status: processStatusSchema,
		importance: processImportanceSchema,
	},
} as const;

const linkToolBodySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		toolId: cuidSchema,
		name: { type: "string", minLength: 1 },
		url: { type: "string", format: "uri" },
	},
	anyOf: [{ required: ["toolId"] }, { required: ["name"] }],
} as const;

const linkPersonBodySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		personId: cuidSchema,
		name: { type: "string", minLength: 1 },
		email: { type: "string", format: "email" },
	},
	anyOf: [{ required: ["personId"] }, { required: ["name"] }],
} as const;

const linkDocumentBodySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		documentId: cuidSchema,
		title: { type: "string", minLength: 1 },
		type: documentTypeSchema,
		url: { type: "string", format: "uri" },
		storageKey: { type: "string" },
		mimeType: { type: "string" },
		sizeBytes: { type: "integer", minimum: 0 },
	},
	anyOf: [{ required: ["documentId"] }, { required: ["title"] }],
} as const;

export const processesSchemas = {
	getTreeByArea: {
		tags: ["Processos"],
		summary: "Listar árvore de processos por área",
		description:
			"Retorna a hierarquia (processos e subprocessos) de uma área específica.",
		params: areaParamsSchema,
		response: {
			200: {
				type: "array",
				items: processTreeNodeSchema,
			},
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	create: {
		tags: ["Processos"],
		summary: "Criar processo em uma área",
		description: "Cria um processo raiz ou subprocesso dentro da área informada.",
		params: areaParamsSchema,
		body: createProcessBodySchema,
		response: {
			201: processSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	getById: {
		tags: ["Processos"],
		summary: "Buscar processo por ID",
		description: "Retorna detalhes do processo, incluindo vínculos e relacionamentos.",
		params: processParamsSchema,
		response: {
			200: processDetailSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	update: {
		tags: ["Processos"],
		summary: "Atualizar processo",
		description: "Atualiza os dados de um processo existente.",
		params: processParamsSchema,
		body: updateProcessBodySchema,
		response: {
			200: processSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	remove: {
		tags: ["Processos"],
		summary: "Remover processo",
		description: "Remove um processo e seus vínculos relacionados.",
		params: processParamsSchema,
		response: {
			200: successResponseSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	linkTool: {
		tags: ["Vínculos de Processo"],
		summary: "Vincular ferramenta ao processo",
		description:
			"Vincula uma ferramenta existente por ID ou cria pelo nome e vincula ao processo.",
		params: processParamsSchema,
		body: linkToolBodySchema,
		response: {
			200: processDetailSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	unlinkTool: {
		tags: ["Vínculos de Processo"],
		summary: "Desvincular ferramenta do processo",
		description: "Remove o vínculo entre um processo e uma ferramenta.",
		params: processToolParamsSchema,
		response: {
			200: successResponseSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	linkPerson: {
		tags: ["Vínculos de Processo"],
		summary: "Vincular responsável ao processo",
		description:
			"Vincula um responsável existente por ID ou cria pelo nome e vincula ao processo.",
		params: processParamsSchema,
		body: linkPersonBodySchema,
		response: {
			200: processDetailSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	unlinkPerson: {
		tags: ["Vínculos de Processo"],
		summary: "Desvincular responsável do processo",
		description: "Remove o vínculo entre um processo e um responsável.",
		params: processPersonParamsSchema,
		response: {
			200: successResponseSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	linkDocument: {
		tags: ["Vínculos de Processo"],
		summary: "Vincular documento ao processo",
		description:
			"Vincula um documento existente por ID ou cria pelo título e vincula ao processo.",
		params: processParamsSchema,
		body: linkDocumentBodySchema,
		response: {
			200: processDetailSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
	unlinkDocument: {
		tags: ["Vínculos de Processo"],
		summary: "Desvincular documento do processo",
		description: "Remove o vínculo entre um processo e um documento.",
		params: processDocumentParamsSchema,
		response: {
			200: successResponseSchema,
			400: validationErrorResponseSchema,
			404: notFoundErrorResponseSchema,
			500: internalErrorResponseSchema,
		},
	},
} as const;

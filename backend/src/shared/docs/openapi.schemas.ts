export const cuidSchema = {
	type: "string",
	minLength: 1,
	description: "Identificador no formato CUID.",
} as const;

export const dateTimeSchema = {
	type: "string",
	format: "date-time",
} as const;

const errorDetailSchema = {
	type: "object",
	additionalProperties: false,
	required: ["field", "reason"],
	properties: {
		field: { type: "string" },
		reason: { type: "string" },
	},
} as const;

export const validationErrorResponseSchema = {
	type: "object",
	additionalProperties: false,
	required: ["type", "message", "details"],
	properties: {
		type: { type: "string", enum: ["validation_error"] },
		message: { type: "string", example: "Payload inválido" },
		details: {
			type: "array",
			items: errorDetailSchema,
		},
	},
} as const;

export const notFoundErrorResponseSchema = {
	type: "object",
	additionalProperties: false,
	required: ["type", "message"],
	properties: {
		type: { type: "string", enum: ["not_found"] },
		message: { type: "string", example: "Recurso não encontrado" },
		details: {
			type: "array",
			items: errorDetailSchema,
			nullable: true,
		},
	},
} as const;

export const internalErrorResponseSchema = {
	type: "object",
	additionalProperties: false,
	required: ["type", "message"],
	properties: {
		type: { type: "string", enum: ["internal_error"] },
		message: { type: "string", example: "Erro inesperado" },
	},
} as const;

export const successResponseSchema = {
	type: "object",
	additionalProperties: false,
	required: ["success"],
	properties: {
		success: { type: "boolean", enum: [true] },
	},
} as const;

import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError, type ZodIssue } from "zod";
import { AppError } from "./app-error";

function translateZodReason(issue: ZodIssue) {
  if (issue.code === "custom") return issue.message;

  if (issue.code === "invalid_type") {
    return issue.received === "undefined" ? "Campo obrigatório" : "Tipo inválido";
  }

  if (issue.code === "too_small") {
    if (issue.type === "string" && issue.minimum === 1) return "Campo obrigatório";
    return `Valor abaixo do mínimo permitido (${issue.minimum})`;
  }

  if (issue.code === "too_big") {
    return `Valor acima do máximo permitido (${issue.maximum})`;
  }

  if (issue.code === "invalid_string") {
    if (issue.validation === "email") return "E-mail inválido";
    if (issue.validation === "url") return "URL inválida";
    return "Formato inválido";
  }

  if (issue.code === "invalid_enum_value") {
    return "Valor fora das opções permitidas";
  }

  return "Valor inválido";
}

export function errorHandler(
  error: FastifyError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      type: error.type,
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      type: "validation_error",
      message: "Payload inválido",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        reason: translateZodReason(issue),
      })),
    });
  }

  return reply.status(500).send({
    type: "internal_error",
    message: "Erro inesperado",
  });
}

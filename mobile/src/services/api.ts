import { notifyDataChanged } from "@./state/dataSync";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiIssue = {
	field?: string;
	reason?: string;
	message?: string;
	path?: string[];
};

const fieldLabelMap: Record<string, string> = {
	areaId: "área",
	parentId: "processo pai",
	name: "nome",
	description: "descrição",
	kind: "tipo",
	status: "status",
	importance: "importância",
	title: "título",
	url: "URL",
	email: "e-mail",
};

function parseJsonBody(rawBody: string): unknown {
	if (!rawBody) {
		return null;
	}

	try {
		return JSON.parse(rawBody);
	} catch {
		return rawBody;
	}
}

function getIssueField(issue: ApiIssue): string | null {
	if (issue.field) {
		return issue.field;
	}

	if (Array.isArray(issue.path) && issue.path.length > 0) {
		return issue.path.join(".");
	}

	return null;
}

function normalizeReason(rawReason: string, field: string | null): string {
	const trimmed = rawReason.trim();
	if (!trimmed) {
		return "Valor inválido";
	}

	const lower = trimmed.toLowerCase();
	if (lower === "invalid cuid" && field === "parentId") {
		return "Selecione um processo pai válido";
	}

	if (lower === "invalid cuid") {
		return "Identificador inválido";
	}

	if (lower === "invalid url") {
		return "URL inválida";
	}

	if (lower === "invalid email") {
		return "E-mail inválido";
	}

	return trimmed;
}

function formatIssue(issue: ApiIssue): string {
	const field = getIssueField(issue);
	const reasonSource = issue.reason ?? issue.message ?? "";
	const reason = normalizeReason(reasonSource, field);
	if (!field) {
		return reason;
	}

	const fieldLabel = fieldLabelMap[field] ?? field;
	return `${fieldLabel}: ${reason}`;
}

function extractIssues(payload: unknown): ApiIssue[] {
	if (Array.isArray(payload)) {
		return payload as ApiIssue[];
	}

	if (!payload || typeof payload !== "object") {
		return [];
	}

	const maybePayload = payload as { details?: unknown; message?: unknown };
	if (Array.isArray(maybePayload.details)) {
		return maybePayload.details as ApiIssue[];
	}

	if (Array.isArray(maybePayload.message)) {
		return maybePayload.message as ApiIssue[];
	}

	return [];
}

function getPayloadMessage(payload: unknown): string | null {
	if (typeof payload === "string") {
		return payload.trim() || null;
	}

	if (!payload || typeof payload !== "object") {
		return null;
	}

	const maybePayload = payload as { message?: unknown };
	if (typeof maybePayload.message === "string") {
		const message = maybePayload.message.trim();
		if (message) {
			return message;
		}
	}

	return null;
}

function formatApiError(payload: unknown, status: number): string {
	const issues = extractIssues(payload)
		.map(formatIssue)
		.filter((issue) => issue.trim().length > 0);

	if (issues.length > 0) {
		return issues[0] ?? "Dados inválidos";
	}

	const message = getPayloadMessage(payload);
	if (message) {
		return message;
	}

	if (status >= 500) {
		return "Erro interno. Tente novamente em instantes.";
	}

	return "Não foi possível concluir a operação.";
}

export async function apiRequest<T>(
	path: string,
	method: HttpMethod = "GET",
	body?: unknown,
): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers: {
			"Content-Type": "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	const rawBody = await response.text();
	const payload = parseJsonBody(rawBody);

	if (!response.ok) {
		throw new Error(formatApiError(payload, response.status));
	}

	if (method !== "GET") {
		notifyDataChanged();
	}

	if (!rawBody) {
		return null as T;
	}

	return payload as T;
}

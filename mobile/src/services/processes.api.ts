import { apiRequest } from "@./services/api";
import type {
	ProcessImportance,
	ProcessKind,
	ProcessNode,
	ProcessStatus,
} from "@./types/process";

export type ProcessPayload = {
	parentId?: string | null;
	name: string;
	description?: string;
	kind?: ProcessKind;
	status?: ProcessStatus;
	importance?: ProcessImportance;
};

export function getProcessTree(areaId: string) {
	return apiRequest<ProcessNode[]>(`/areas/${areaId}/processes/tree`);
}

export function getProcessById(id: string) {
	return apiRequest<ProcessNode>(`/processes/${id}`);
}

export function createProcess(areaId: string, payload: ProcessPayload) {
	return apiRequest<ProcessNode>(`/areas/${areaId}/processes`, "POST", payload);
}

export function updateProcess(id: string, payload: ProcessPayload) {
	return apiRequest<ProcessNode>(`/processes/${id}`, "PUT", payload);
}

export function linkToolToProcess(
	id: string,
	payload: { name: string; url?: string },
) {
	return apiRequest<ProcessNode>(`/processes/${id}/tools`, "POST", payload);
}

export function unlinkToolFromProcess(id: string, toolId: string) {
	return apiRequest<{ success: boolean }>(
		`/processes/${id}/tools/${toolId}`,
		"DELETE",
	);
}

export function linkPersonToProcess(
	id: string,
	payload: { name: string; email?: string },
) {
	return apiRequest<ProcessNode>(`/processes/${id}/people`, "POST", payload);
}

export function unlinkPersonFromProcess(id: string, personId: string) {
	return apiRequest<{ success: boolean }>(
		`/processes/${id}/people/${personId}`,
		"DELETE",
	);
}

export function linkDocumentToProcess(
	id: string,
	payload: { title: string; type?: "URL" | "FILE"; url?: string },
) {
	return apiRequest<ProcessNode>(`/processes/${id}/documents`, "POST", payload);
}

export function unlinkDocumentFromProcess(id: string, documentId: string) {
	return apiRequest<{ success: boolean }>(
		`/processes/${id}/documents/${documentId}`,
		"DELETE",
	);
}

import type { Document } from "@./types/document";
import type { Person } from "@./types/person";
import type { Tool } from "@./types/tool";

export type ProcessKind = "MANUAL" | "SYSTEM";
export type ProcessStatus = "DRAFT" | "ACTIVE" | "DEPRECATED";
export type ProcessImportance = "LOW" | "MEDIUM" | "HIGH";

export type ProcessNode = {
	id: string;
	areaId: string;
	parentId?: string | null;
	name: string;
	description?: string | null;
	kind: ProcessKind;
	status: ProcessStatus;
	importance: ProcessImportance;
	createdAt: string;
	updatedAt: string;
	children: ProcessNode[];
	tools?: Array<{ tool: Tool }>;
	people?: Array<{ person: Person }>;
	documents?: Array<{ document: Document }>;
};

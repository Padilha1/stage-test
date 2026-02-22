import type {
	ProcessImportance,
	ProcessKind,
	ProcessStatus,
} from "@./types/process";

export function kindLabel(kind: ProcessKind) {
	return kind === "SYSTEM" ? "Sistêmico" : "Manual";
}

export function statusLabel(status: ProcessStatus) {
	if (status === "ACTIVE") return "Ativo";
	if (status === "DEPRECATED") return "Descontinuado";
	return "Rascunho";
}

export function importanceLabel(importance: ProcessImportance) {
	if (importance === "HIGH") return "Alta";
	if (importance === "LOW") return "Baixa";
	return "Média";
}

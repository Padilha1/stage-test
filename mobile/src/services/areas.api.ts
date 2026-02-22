import { apiRequest } from "@./services/api";
import type { Area } from "@./types/area";

export function listAreas() {
	return apiRequest<Area[]>("/areas");
}

export function getArea(id: string) {
	return apiRequest<Area>(`/areas/${id}`);
}

export function createArea(payload: { name: string; description?: string }) {
	return apiRequest<Area>("/areas", "POST", payload);
}

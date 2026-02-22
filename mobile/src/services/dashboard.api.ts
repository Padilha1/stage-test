import { apiRequest } from "@./services/api";
import type { DashboardSummary } from "@./types/dashboard";

export function getDashboardSummary() {
	return apiRequest<DashboardSummary>("/dashboard/summary");
}

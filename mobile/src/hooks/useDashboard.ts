import { getDashboardSummary } from "@./services/dashboard.api";
import { subscribeDataChanges } from "@./state/dataSync";
import type { DashboardSummary } from "@./types/dashboard";
import { useCallback, useEffect, useState } from "react";

export function useDashboard() {
	const [data, setData] = useState<DashboardSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await getDashboardSummary();
			setData(response);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Falha ao carregar dashboard");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void load();
		const unsubscribe = subscribeDataChanges(() => {
			void load();
		});

		return unsubscribe;
	}, [load]);

	return { data, loading, error, reload: load };
}

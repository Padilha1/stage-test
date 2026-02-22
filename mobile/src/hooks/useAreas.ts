import { listAreas } from "@./services/areas.api";
import { subscribeDataChanges } from "@./state/dataSync";
import type { Area } from "@./types/area";
import { normalizeAreaText } from "@./utils/normalizeAreaText";
import { useCallback, useEffect, useState } from "react";

export function useAreas() {
	const [areas, setAreas] = useState<Area[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await listAreas();
			setAreas(data.map(normalizeAreaText));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Falha ao carregar áreas");
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

	return { areas, loading, error, reload: load };
}

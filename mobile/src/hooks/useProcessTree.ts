import { getProcessTree } from "@./services/processes.api";
import { subscribeDataChanges } from "@./state/dataSync";
import type { ProcessNode } from "@./types/process";
import { useCallback, useEffect, useState } from "react";

export function useProcessTree(areaId: string) {
	const [tree, setTree] = useState<ProcessNode[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await getProcessTree(areaId);
			setTree(data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Falha ao carregar árvore de processos",
			);
		} finally {
			setLoading(false);
		}
	}, [areaId]);

	useEffect(() => {
		void load();
		const unsubscribe = subscribeDataChanges(() => {
			void load();
		});

		return unsubscribe;
	}, [load]);

	return { tree, loading, error, reload: load };
}

import { MetricCard } from "@./components/ui/MetricCard";
import type { DashboardSummary } from "@./types/dashboard";
import { spacing } from "@./theme/spacing";
import { StyleSheet, View } from "react-native";

type Totals = DashboardSummary["totais"];

type MetricDefinition = {
	id: keyof Totals;
	label: string;
};

const metricDefinitions: MetricDefinition[] = [
	{ id: "areas", label: "Áreas" },
	{ id: "processos", label: "Processos" },
	{ id: "subprocessos", label: "Subprocessos" },
	{ id: "ferramentas", label: "Ferramentas" },
	{ id: "responsaveis", label: "Responsáveis" },
	{ id: "documentos", label: "Documentos" },
];

type Props = {
	totals?: Totals;
};

export function DashboardTotalsGrid({ totals }: Props) {
	return (
		<View style={styles.grid}>
			{metricDefinitions.map((metric) => (
				<MetricCard
					key={metric.id}
					label={metric.label}
					value={totals?.[metric.id] ?? 0}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.sm,
		justifyContent: "space-between",
	},
});

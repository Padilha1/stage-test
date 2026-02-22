import type { MainTabParamList, RootStackParamList } from "@./app/navigation";
import { DashboardTotalsGrid } from "@./components/dashboard/DashboardTotalsGrid";
import { AppButton } from "@./components/ui/AppButton";
import { Card } from "@./components/ui/Card";
import { useDashboard } from "@./hooks/useDashboard";
import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = CompositeScreenProps<
	BottomTabScreenProps<MainTabParamList, "Dashboard">,
	NativeStackScreenProps<RootStackParamList>
>;

type DistributionVisual = {
	color: string;
	soft: string;
};

type DistributionEntry = {
	id: string;
	label: string;
	count: number;
	color: string;
	soft: string;
};

const statusLabelMap: Record<string, string> = {
	DRAFT: "Rascunho",
	ACTIVE: "Ativo",
	DEPRECATED: "Descontinuado",
};

const typeLabelMap: Record<string, string> = {
	MANUAL: "Manual",
	SYSTEM: "Sistêmico",
};

const importanceLabelMap: Record<string, string> = {
	LOW: "Baixa",
	MEDIUM: "Média",
	HIGH: "Alta",
};

const statusVisualMap: Record<string, DistributionVisual> = {
	DRAFT: { color: colors.muted, soft: colors.mutedSoft },
	ACTIVE: { color: colors.success, soft: colors.successSoft },
	DEPRECATED: { color: colors.danger, soft: colors.dangerSoft },
};

const typeVisualMap: Record<string, DistributionVisual> = {
	MANUAL: { color: colors.secondary, soft: colors.secondarySoft },
	SYSTEM: { color: colors.primary, soft: colors.primarySoft },
};

const importanceVisualMap: Record<string, DistributionVisual> = {
	LOW: { color: colors.muted, soft: colors.mutedSoft },
	MEDIUM: { color: colors.warning, soft: colors.warningSoft },
	HIGH: { color: colors.danger, soft: colors.dangerSoft },
};

const fallbackDistributionVisual: DistributionVisual = {
	color: colors.primary,
	soft: colors.primarySoft,
};

function buildDistributionEntries(
	items: Array<{ label: string; count: number }>,
	labelMap: Record<string, string>,
	visualMap: Record<string, DistributionVisual>,
): DistributionEntry[] {
	return items.map((item) => {
		const visual = visualMap[item.label] ?? fallbackDistributionVisual;
		return {
			id: item.label,
			label: labelMap[item.label] ?? item.label,
			count: item.count,
			color: visual.color,
			soft: visual.soft,
		};
	});
}

function getDistributionPercent(count: number, total: number) {
	if (total <= 0) {
		return 0;
	}

	return Math.round((count / total) * 100);
}

export function DashboardScreen({ navigation }: Props) {
	const { data, loading, error } = useDashboard();
	const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
	const totalProcessos = data?.totais.processos ?? 0;
	const processosSemDocumentos = data?.pendencias.processosSemDocumentos ?? 0;
	const processosSemResponsaveis = data?.pendencias.processosSemResponsaveis ?? 0;
	const pendenciasTotais = processosSemDocumentos + processosSemResponsaveis;
	const semDocumentosPercent = getDistributionPercent(
		processosSemDocumentos,
		totalProcessos,
	);
	const semResponsaveisPercent = getDistributionPercent(
		processosSemResponsaveis,
		totalProcessos,
	);
	const statusEntries = buildDistributionEntries(
		data?.distribuicao.porStatus ?? [],
		statusLabelMap,
		statusVisualMap,
	);
	const typeEntries = buildDistributionEntries(
		data?.distribuicao.porTipo ?? [],
		typeLabelMap,
		typeVisualMap,
	);
	const importanceEntries = buildDistributionEntries(
		data?.distribuicao.porImportancia ?? [],
		importanceLabelMap,
		importanceVisualMap,
	);
	const statusTotal = statusEntries.reduce((sum, entry) => sum + entry.count, 0);
	const typeTotal = typeEntries.reduce((sum, entry) => sum + entry.count, 0);
	const importanceTotal = importanceEntries.reduce(
		(sum, entry) => sum + entry.count,
		0,
	);

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<Text style={styles.subtitle}>
				Visão geral do mapeamento de processos
			</Text>

			{loading ? (
				<Text style={styles.muted}>Carregando indicadores...</Text>
			) : null}
			{error ? <Text style={styles.error}>{error}</Text> : null}

			<DashboardTotalsGrid totals={data?.totais} />

			<Card>
				<Text style={styles.sectionTitle}>Pendências</Text>
				<View style={styles.pendingList}>
					<View
						style={[
							styles.pendingCard,
							{
								backgroundColor: colors.warningSoft,
								borderColor: colors.warning,
							},
						]}
					>
						<View style={styles.pendingHeader}>
							<Text style={styles.pendingLabel}>Sem documentos</Text>
							<Text style={[styles.pendingValue, { color: colors.warning }]}>
								{processosSemDocumentos}
							</Text>
						</View>
						<View style={styles.pendingTrack}>
							<View
								style={[
									styles.pendingFill,
									{
										backgroundColor: colors.warning,
										width: `${semDocumentosPercent}%`,
									},
								]}
							/>
						</View>
						<Text style={styles.pendingMeta}>
							{semDocumentosPercent}% do total de processos
						</Text>
					</View>

					<View
						style={[
							styles.pendingCard,
							{
								backgroundColor: colors.dangerSoft,
								borderColor: colors.danger,
							},
						]}
					>
						<View style={styles.pendingHeader}>
							<Text style={styles.pendingLabel}>Sem responsáveis</Text>
							<Text style={[styles.pendingValue, { color: colors.danger }]}>
								{processosSemResponsaveis}
							</Text>
						</View>
						<View style={styles.pendingTrack}>
							<View
								style={[
									styles.pendingFill,
									{
										backgroundColor: colors.danger,
										width: `${semResponsaveisPercent}%`,
									},
								]}
							/>
						</View>
						<Text style={styles.pendingMeta}>
							{semResponsaveisPercent}% do total de processos
						</Text>
					</View>
				</View>
				<Text style={styles.pendingSummary}>
					Total de pendências: {pendenciasTotais}
				</Text>
			</Card>

			<Card>
				<Text style={styles.sectionTitle}>Análises detalhadas</Text>
				<Text style={styles.muted}>
					Use quando precisar explorar distribuições e tendências.
				</Text>
				<AppButton
					label={
						showAdvancedAnalytics
							? "Ocultar análises detalhadas"
							: "Ver análises detalhadas"
					}
					variant="secondary"
					onPress={() => setShowAdvancedAnalytics((prev) => !prev)}
					fullWidth
				/>
			</Card>

			{showAdvancedAnalytics ? (
				<>
					<Card>
						<Text style={styles.sectionTitle}>Distribuição por tipo</Text>
						{typeEntries.length === 0 ? (
							<Text style={styles.muted}>Sem dados de tipo.</Text>
						) : (
							<View style={styles.distributionList}>
								{typeEntries.map((entry) => {
									const percent = getDistributionPercent(entry.count, typeTotal);
									return (
										<View
											key={entry.id}
											style={[
												styles.typeCard,
												{
													backgroundColor: entry.soft,
													borderColor: entry.color,
												},
											]}
										>
											<Text style={[styles.typeTitle, { color: entry.color }]}>
												{entry.label}
											</Text>
											<Text style={styles.typeValue}>{entry.count}</Text>
											<Text style={styles.typePercent}>
												{percent}% dos processos
											</Text>
										</View>
									);
								})}
							</View>
						)}
					</Card>

					<Card>
						<Text style={styles.sectionTitle}>Distribuição por status</Text>
						{statusEntries.length === 0 ? (
							<Text style={styles.muted}>Sem dados de status.</Text>
						) : (
							<View style={styles.distributionList}>
								{statusEntries.map((entry) => {
									const percent = getDistributionPercent(entry.count, statusTotal);
									return (
										<View key={entry.id} style={styles.distributionItem}>
											<View style={styles.distributionHeader}>
												<View style={styles.distributionLabelWrap}>
													<View
														style={[
															styles.distributionDot,
															{ backgroundColor: entry.color },
														]}
													/>
													<Text style={styles.distributionLabel}>
														{entry.label}
													</Text>
												</View>
												<View
													style={[
														styles.distributionCountPill,
														{
															backgroundColor: entry.soft,
															borderColor: entry.color,
														},
													]}
												>
													<Text
														style={[
															styles.distributionCountText,
															{ color: entry.color },
														]}
													>
														{entry.count}
													</Text>
												</View>
											</View>
											<View style={styles.distributionTrack}>
												<View
													style={[
														styles.distributionFill,
														{
															backgroundColor: entry.color,
															width: `${percent}%`,
														},
													]}
												/>
											</View>
										</View>
									);
								})}
							</View>
						)}
					</Card>

					<Card>
						<Text style={styles.sectionTitle}>Distribuição por importância</Text>
						{importanceEntries.length === 0 ? (
							<Text style={styles.muted}>Sem dados de importância.</Text>
						) : (
							<View style={styles.distributionList}>
								{importanceEntries.map((entry) => {
									const percent = getDistributionPercent(
										entry.count,
										importanceTotal,
									);
									return (
										<View key={entry.id} style={styles.distributionItem}>
											<View style={styles.distributionHeader}>
												<Text style={styles.distributionLabel}>{entry.label}</Text>
												<Text style={styles.distributionMeta}>
													{entry.count} ({percent}%)
												</Text>
											</View>
											<View style={styles.distributionTrack}>
												<View
													style={[
														styles.distributionFill,
														{
															backgroundColor: entry.color,
															width: `${percent}%`,
														},
													]}
												/>
											</View>
										</View>
									);
								})}
							</View>
						)}
					</Card>

					<Card>
						<Text style={styles.sectionTitle}>Top ferramentas</Text>
						{(data?.topFerramentas ?? []).length === 0 ? (
							<Text style={styles.muted}>Nenhuma ferramenta vinculada ainda.</Text>
						) : (
							(data?.topFerramentas ?? []).map((item) => (
								<Text key={item.id} style={styles.itemText}>
									• {item.nome} ({item.usoEmProcessos} processos)
								</Text>
							))
						)}
					</Card>
				</>
			) : null}

			<AppButton
				label="Ir para áreas"
				onPress={() => navigation.navigate("Areas")}
				fullWidth
			/>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		padding: spacing.lg,
		gap: spacing.md,
		paddingBottom: spacing.xl,
	},
	subtitle: {
		color: colors.muted,
		fontSize: 14,
	},
	sectionTitle: {
		color: colors.text,
		fontWeight: "700",
		fontSize: 16,
	},
	itemText: {
		color: colors.text,
		fontSize: 14,
	},
	pendingList: {
		gap: spacing.sm,
	},
	pendingCard: {
		borderRadius: 12,
		borderWidth: 1,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		gap: spacing.xs,
	},
	pendingHeader: {
		flexDirection: "row",
		alignItems: "baseline",
		justifyContent: "space-between",
	},
	pendingLabel: {
		color: colors.text,
		fontSize: 14,
		fontWeight: "600",
	},
	pendingValue: {
		fontSize: 28,
		fontWeight: "700",
		lineHeight: 30,
	},
	pendingTrack: {
		height: 6,
		borderRadius: 999,
		backgroundColor: colors.surface,
		overflow: "hidden",
	},
	pendingFill: {
		height: "100%",
		borderRadius: 999,
	},
	pendingMeta: {
		color: colors.textMuted,
		fontSize: 12,
		fontWeight: "600",
	},
	pendingSummary: {
		color: colors.text,
		fontSize: 13,
		fontWeight: "600",
	},
	distributionList: {
		gap: spacing.sm,
	},
	distributionItem: {
		gap: spacing.xs,
	},
	distributionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	distributionLabelWrap: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	distributionDot: {
		width: 8,
		height: 8,
		borderRadius: 999,
	},
	distributionLabel: {
		color: colors.text,
		fontSize: 14,
		fontWeight: "600",
	},
	distributionMeta: {
		color: colors.muted,
		fontSize: 12,
		fontWeight: "600",
	},
	distributionCountPill: {
		minWidth: 32,
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs / 2,
		alignItems: "center",
	},
	distributionCountText: {
		fontSize: 12,
		fontWeight: "700",
	},
	distributionTrack: {
		height: 7,
		borderRadius: 999,
		backgroundColor: colors.mutedSoft,
		overflow: "hidden",
	},
	distributionFill: {
		height: "100%",
		borderRadius: 999,
	},
	typeCard: {
		borderRadius: 12,
		borderWidth: 1,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	},
	typeTitle: {
		fontSize: 13,
		fontWeight: "700",
	},
	typeValue: {
		color: colors.text,
		fontSize: 24,
		fontWeight: "700",
		lineHeight: 28,
	},
	typePercent: {
		color: colors.textMuted,
		fontSize: 12,
	},
	muted: {
		color: colors.muted,
	},
	error: {
		color: colors.danger,
	},
});

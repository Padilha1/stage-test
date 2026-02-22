import type { RootStackParamList } from "@./app/navigation";
import { AppButton } from "@./components/ui/AppButton";
import { useProcessTree } from "@./hooks/useProcessTree";
import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { ProcessNode, ProcessStatus } from "@./types/process";
import { kindLabel, statusLabel } from "@./utils/mapEnumsToUI";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import {
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Svg, { G, Path, Rect, Text as SvgText } from "react-native-svg";

type Props = NativeStackScreenProps<RootStackParamList, "ProcessGraph">;

type PositionedNode = {
	id: string;
	parentId: string | null;
	hasChildren: boolean;
	name: string;
	kindLabel: string;
	statusLabel: string;
	status: ProcessStatus;
	x: number;
	y: number;
};

const nodeWidth = 200;
const nodeHeight = 68;
const horizontalGap = 250;
const verticalGap = 110;
const canvasPadding = 36;

const statusVisualMap: Record<ProcessStatus, { border: string; fill: string }> =
	{
		DRAFT: { border: colors.muted, fill: colors.mutedSoft },
		ACTIVE: { border: colors.success, fill: colors.successSoft },
		DEPRECATED: { border: colors.danger, fill: colors.dangerSoft },
	};

function buildLayout(nodes: ProcessNode[]) {
	const positioned: PositionedNode[] = [];
	let row = 0;
	let maxDepth = 0;

	function walk(items: ProcessNode[], depth: number, parentId: string | null) {
		for (const node of items) {
			const x = canvasPadding + depth * horizontalGap;
			const y = canvasPadding + row * verticalGap;

			positioned.push({
				id: node.id,
				parentId,
				hasChildren: node.children.length > 0,
				name: node.name,
				kindLabel: kindLabel(node.kind),
				statusLabel: statusLabel(node.status),
				status: node.status,
				x,
				y,
			});

			row += 1;
			if (depth > maxDepth) {
				maxDepth = depth;
			}

			walk(node.children, depth + 1, node.id);
		}
	}

	walk(nodes, 0, null);

	const width = canvasPadding * 2 + (maxDepth + 1) * horizontalGap + nodeWidth;
	const height = canvasPadding * 2 + Math.max(row, 1) * verticalGap;

	return { positioned, width, height };
}

export function ProcessGraphScreen({ route, navigation }: Props) {
	const { areaId, areaName } = route.params;
	const { tree, loading, error } = useProcessTree(areaId);
	const [isExportModalOpen, setIsExportModalOpen] = useState(false);

	const layout = useMemo(() => buildLayout(tree), [tree]);
	const nodeMap = useMemo(
		() =>
			new Map(
				layout.positioned.map((node) => [node.id, { x: node.x, y: node.y }]),
			),
		[layout.positioned],
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{areaName}</Text>
			<Text style={styles.subtitle}>
				Fluxo visual da hierarquia de processos da área.
			</Text>
			<AppButton
				label="Exportar PDF"
				variant="secondary"
				onPress={() => setIsExportModalOpen(true)}
			/>

			{loading ? (
				<Text style={styles.muted}>Carregando diagrama...</Text>
			) : null}
			{error ? <Text style={styles.error}>{error}</Text> : null}
			{!loading && !error && layout.positioned.length === 0 ? (
				<Text style={styles.muted}>Nenhum processo cadastrado nesta área.</Text>
			) : null}

			{layout.positioned.length > 0 ? (
				<ScrollView horizontal contentContainerStyle={styles.horizontalScroll}>
					<ScrollView contentContainerStyle={styles.verticalScroll}>
						<Svg width={layout.width} height={layout.height}>
							{layout.positioned.map((node) => {
								if (!node.parentId) {
									return null;
								}

								const parent = nodeMap.get(node.parentId);
								if (!parent) {
									return null;
								}

								const startX = parent.x + nodeWidth;
								const startY = parent.y + nodeHeight / 2;
								const endX = node.x;
								const endY = node.y + nodeHeight / 2;
								const curveX = (startX + endX) / 2;

								return (
									<Path
										key={`${node.parentId}-${node.id}`}
										d={`M ${startX} ${startY} C ${curveX} ${startY}, ${curveX} ${endY}, ${endX} ${endY}`}
										stroke={colors.borderStrong}
										strokeWidth={2}
										fill="none"
									/>
								);
							})}

							{layout.positioned.map((node) => {
								const statusVisual = statusVisualMap[node.status];
								const isRootNode = node.parentId === null;
								const fillColor = isRootNode
									? colors.primarySoft
									: statusVisual.fill;
								const borderColor = isRootNode
									? colors.primary
									: statusVisual.border;
								const subtitleColor = isRootNode
									? colors.primary
									: colors.textMuted;

								return (
									<G
										key={node.id}
										onPress={() =>
											navigation.navigate("ProcessDetail", {
												processId: node.id,
											})
										}
									>
										<Rect
											x={node.x}
											y={node.y}
											width={nodeWidth}
											height={nodeHeight}
											rx={14}
											ry={14}
											fill={fillColor}
											stroke={borderColor}
											strokeWidth={1.5}
										/>
										<SvgText
											x={node.x + 14}
											y={node.y + 25}
											fill={colors.text}
											fontSize={15}
											fontWeight="700"
										>
											{node.name.length > 20
												? `${node.name.slice(0, 20)}...`
												: node.name}
										</SvgText>
										<SvgText
											x={node.x + 14}
											y={node.y + 48}
											fill={subtitleColor}
											fontSize={11}
											fontWeight="600"
										>
											{node.kindLabel} • {node.statusLabel}
										</SvgText>
									</G>
								);
							})}
						</Svg>
					</ScrollView>
				</ScrollView>
			) : null}

			<Modal
				visible={isExportModalOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsExportModalOpen(false)}
			>
				<View style={styles.modalRoot}>
					<Pressable
						style={styles.modalBackdrop}
						onPress={() => setIsExportModalOpen(false)}
					/>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>Exportação em PDF</Text>
						<Text style={styles.modalDescription}>
							Feature a ser implementada. PDF nesse caso teria que enviar por
							email e pela API.
						</Text>
						<AppButton
							label="Fechar"
							onPress={() => setIsExportModalOpen(false)}
							fullWidth
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		padding: spacing.lg,
		gap: spacing.sm,
	},
	title: {
		color: colors.text,
		fontSize: 22,
		fontWeight: "700",
	},
	subtitle: {
		color: colors.muted,
		fontSize: 13,
	},
	horizontalScroll: {
		paddingVertical: spacing.sm,
	},
	verticalScroll: {
		paddingBottom: spacing.xl,
	},
	muted: {
		color: colors.muted,
	},
	error: {
		color: colors.danger,
	},
	modalRoot: {
		flex: 1,
		justifyContent: "center",
		padding: spacing.lg,
	},
	modalBackdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: colors.overlay,
	},
	modalCard: {
		backgroundColor: colors.surface,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.lg,
		gap: spacing.md,
	},
	modalTitle: {
		color: colors.text,
		fontSize: 18,
		fontWeight: "700",
	},
	modalDescription: {
		color: colors.textMuted,
		fontSize: 14,
		lineHeight: 20,
	},
});

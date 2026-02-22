import type { RootStackParamList } from "@./app/navigation";
import { Breadcrumbs } from "@./components/process/Breadcrumbs";
import { SearchBar } from "@./components/process/SearchBar";
import { TreeView } from "@./components/process/TreeView";
import { AppButton } from "@./components/ui/AppButton";
import { useProcessTree } from "@./hooks/useProcessTree";
import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { ProcessNode } from "@./types/process";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "ProcessTree">;

function findPath(
	tree: ProcessNode[],
	id: string,
	path: string[] = [],
): string[] {
	for (const node of tree) {
		const nextPath = [...path, node.name];
		if (node.id === id) return nextPath;
		const childPath = findPath(node.children, id, nextPath);
		if (childPath.length) return childPath;
	}
	return [];
}

export function ProcessTreeScreen({ route, navigation }: Props) {
	const { areaId, areaName } = route.params;
	const { tree, loading, error, reload } = useProcessTree(areaId);
	const [search, setSearch] = useState("");
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

	useFocusEffect(
		useCallback(() => {
			void reload();
		}, [reload]),
	);

	const breadcrumbs = useMemo(
		() => (selectedNodeId ? findPath(tree, selectedNodeId) : []),
		[tree, selectedNodeId],
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{areaName}</Text>
			<View style={styles.actionsRow}>
				<AppButton
					label="Visualização gráfica"
					variant="secondary"
					onPress={() => navigation.navigate("ProcessGraph", { areaId, areaName })}
					style={styles.actionButton}
				/>
				<AppButton
					label="Novo processo"
					onPress={() => navigation.navigate("ProcessForm", { areaId })}
					style={styles.actionButton}
				/>
			</View>
			<SearchBar value={search} onChange={setSearch} />
			<Breadcrumbs items={breadcrumbs} />

			{loading ? <Text style={styles.muted}>Carregando processos...</Text> : null}
			{error ? <Text style={styles.error}>{error}</Text> : null}
			{!loading && !error && tree.length === 0 ? (
				<Text style={styles.muted}>Nenhum processo cadastrado nesta área.</Text>
			) : null}

			<ScrollView contentContainerStyle={styles.treeWrap}>
				<TreeView
					nodes={tree}
					searchTerm={search}
					onSelectNode={(id) => {
						setSelectedNodeId(id);
						navigation.navigate("ProcessDetail", { processId: id });
					}}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		padding: spacing.lg,
		gap: spacing.md,
	},
	title: {
		color: colors.text,
		fontSize: 24,
		fontWeight: "700",
	},
	actionsRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	actionButton: {
		flex: 1,
	},
	muted: {
		color: colors.muted,
	},
	error: {
		color: colors.danger,
	},
	treeWrap: {
		gap: spacing.md,
		paddingBottom: spacing.xl,
	},
});

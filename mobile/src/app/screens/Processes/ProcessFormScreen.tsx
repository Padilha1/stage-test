import type { RootStackParamList } from "@./app/navigation";
import { AppButton } from "@./components/ui/AppButton";
import { AppDropdownSelect } from "@./components/ui/AppDropdownSelect";
import { AppInput } from "@./components/ui/AppInput";
import { AppSelect } from "@./components/ui/AppSelect";
import { Card } from "@./components/ui/Card";
import {
	createProcess,
	getProcessById,
	getProcessTree,
	updateProcess,
} from "@./services/processes.api";
import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type {
	ProcessImportance,
	ProcessKind,
	ProcessNode,
	ProcessStatus,
} from "@./types/process";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "ProcessForm">;

const kindOptions = [
	{ label: "Manual", value: "MANUAL" },
	{ label: "Sistêmico", value: "SYSTEM" },
];

const statusOptions = [
	{ label: "Rascunho", value: "DRAFT" },
	{ label: "Ativo", value: "ACTIVE" },
	{ label: "Descontinuado", value: "DEPRECATED" },
];

const importanceOptions = [
	{ label: "Baixa", value: "LOW" },
	{ label: "Média", value: "MEDIUM" },
	{ label: "Alta", value: "HIGH" },
];

type ParentOption = { label: string; value: string; level: number };

const emptyParentOption: ParentOption = {
	label: "Sem processo pai (processo raiz)",
	value: "",
	level: 0,
};

function findNodeById(nodes: ProcessNode[], id: string): ProcessNode | null {
	for (const node of nodes) {
		if (node.id === id) {
			return node;
		}

		const childFound = findNodeById(node.children, id);
		if (childFound) {
			return childFound;
		}
	}

	return null;
}

function collectIds(node: ProcessNode, ids: Set<string>) {
	ids.add(node.id);
	for (const child of node.children) {
		collectIds(child, ids);
	}
}

function toParentOptions(
	nodes: ProcessNode[],
	depth: number,
	blockedIds: Set<string>,
): ParentOption[] {
	const options: ParentOption[] = [];

	for (const node of nodes) {
		if (!blockedIds.has(node.id)) {
			options.push({
				label: node.name,
				value: node.id,
				level: depth,
			});
		}

		const childrenOptions = toParentOptions(node.children, depth + 1, blockedIds);
		for (const childOption of childrenOptions) {
			options.push(childOption);
		}
	}

	return options;
}

function buildParentOptions(
	tree: ProcessNode[],
	currentProcessId: string | null,
): ParentOption[] {
	const blockedIds = new Set<string>();
	if (currentProcessId) {
		blockedIds.add(currentProcessId);
		const currentNode = findNodeById(tree, currentProcessId);
		if (currentNode) {
			for (const child of currentNode.children) {
				collectIds(child, blockedIds);
			}
		}
	}

	const options = toParentOptions(tree, 0, blockedIds);
	return [emptyParentOption, ...options];
}

export function ProcessFormScreen({ route, navigation }: Props) {
	const { areaId, processId } = route.params;
	const currentProcessId = processId ?? null;
	const requestVersionRef = useRef(0);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [parentId, setParentId] = useState("");
	const [kind, setKind] = useState<ProcessKind>("MANUAL");
	const [status, setStatus] = useState<ProcessStatus>("DRAFT");
	const [importance, setImportance] = useState<ProcessImportance>("MEDIUM");
	const [loading, setLoading] = useState(Boolean(currentProcessId));
	const [loadingParentOptions, setLoadingParentOptions] = useState(true);
	const [parentOptions, setParentOptions] = useState<ParentOption[]>([
		emptyParentOption,
	]);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [parentOptionsError, setParentOptionsError] = useState<string | null>(null);

	const loadScreenData = useCallback(async () => {
		const nextRequestVersion = requestVersionRef.current + 1;
		requestVersionRef.current = nextRequestVersion;

		setError(null);
		setParentOptionsError(null);
		setLoadingParentOptions(true);
		setLoading(Boolean(currentProcessId));

		const processPromise = currentProcessId
			? getProcessById(currentProcessId)
			: Promise.resolve(null);

		const [treeResult, processResult] = await Promise.allSettled([
			getProcessTree(areaId),
			processPromise,
		]);

		if (nextRequestVersion !== requestVersionRef.current) {
			return;
		}

		if (treeResult.status === "fulfilled") {
			setParentOptions(buildParentOptions(treeResult.value, currentProcessId));
		}
		if (treeResult.status === "rejected") {
			setParentOptions([emptyParentOption]);
			setParentOptionsError(
				"Não foi possível carregar os processos para seleção de processo pai.",
			);
		}

		if (!currentProcessId) {
			setLoading(false);
			setLoadingParentOptions(false);
			return;
		}

		if (processResult.status === "fulfilled" && processResult.value) {
			const process = processResult.value;
			setName(process.name);
			setDescription(process.description ?? "");
			setParentId(process.parentId ?? "");
			setKind(process.kind);
			setStatus(process.status);
			setImportance(process.importance);
		}
		if (processResult.status === "rejected") {
			const message =
				processResult.reason instanceof Error
					? processResult.reason.message
					: "Falha ao carregar processo";
			setError(message);
		}

		setLoading(false);
		setLoadingParentOptions(false);
	}, [areaId, currentProcessId]);

	useFocusEffect(
		useCallback(() => {
			void loadScreenData();

			return () => {
				requestVersionRef.current += 1;
			};
		}, [loadScreenData]),
	);

	const handleSubmit = async () => {
		const trimmedName = name.trim();
		if (!trimmedName) {
			setError("O nome do processo é obrigatório.");
			return;
		}

		const selectedParentId = parentId.trim();
		const hasValidParentOption = parentOptions.some(
			(option) => option.value === selectedParentId,
		);
		if (!hasValidParentOption) {
			setError("Selecione um processo pai válido.");
			return;
		}

		setError(null);
		setSaving(true);

		try {
			const payload = {
				name: trimmedName,
				description: description.trim() || undefined,
				parentId: selectedParentId || null,
				kind,
				status,
				importance,
			};

			if (currentProcessId) {
				await updateProcess(currentProcessId, payload);
				navigation.goBack();
				return;
			}

			await createProcess(areaId, payload);
			navigation.goBack();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Falha ao salvar processo");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.container}>
				<Text style={styles.muted}>Carregando dados do processo...</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<Text style={styles.title}>
				{currentProcessId ? "Editar processo" : "Novo processo"}
			</Text>

			<Card>
				<AppInput
					label="Nome do processo"
					placeholder="Ex.: Recrutamento e Seleção"
					value={name}
					onChangeText={setName}
				/>

				<AppInput
					label="Descrição"
					placeholder="Descreva o objetivo e o escopo do processo"
					value={description}
					onChangeText={setDescription}
					multiline
					numberOfLines={4}
				/>

				<View style={styles.advancedSection}>
					<AppDropdownSelect
						label="Processo pai (opcional)"
						value={parentId}
						onChange={setParentId}
						options={parentOptions}
						helperText="Selecione um processo existente ou deixe como raiz."
					/>
					{loadingParentOptions ? (
						<Text style={styles.mutedInline}>
							Carregando opções de processo pai...
						</Text>
					) : null}
					{parentOptionsError ? (
						<Text style={styles.error}>{parentOptionsError}</Text>
					) : null}

					<AppSelect
						label="Tipo"
						value={kind}
						onChange={(value) => setKind(value as ProcessKind)}
						options={kindOptions}
					/>

					<AppSelect
						label="Status"
						value={status}
						onChange={(value) => setStatus(value as ProcessStatus)}
						options={statusOptions}
					/>

					<AppSelect
						label="Importância"
						value={importance}
						onChange={(value) => setImportance(value as ProcessImportance)}
						options={importanceOptions}
					/>
				</View>

				{error ? <Text style={styles.error}>{error}</Text> : null}

				<View style={styles.actionsRow}>
					<AppButton
						label="Cancelar"
						variant="secondary"
						onPress={() => navigation.goBack()}
					/>
					<AppButton
						label={currentProcessId ? "Salvar alterações" : "Cadastrar processo"}
						onPress={() => void handleSubmit()}
						loading={saving}
					/>
				</View>
			</Card>
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
	},
	title: {
		color: colors.text,
		fontSize: 26,
		fontWeight: "700",
	},
	actionsRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	muted: {
		color: colors.muted,
		padding: spacing.lg,
	},
	mutedInline: {
		color: colors.muted,
		fontSize: 12,
	},
	advancedSection: {
		gap: spacing.sm,
	},
	error: {
		color: colors.danger,
		fontWeight: "600",
	},
});

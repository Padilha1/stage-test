import type { RootStackParamList } from "@./app/navigation";
import { AppButton } from "@./components/ui/AppButton";
import { AppInput } from "@./components/ui/AppInput";
import { Card } from "@./components/ui/Card";
import {
	getProcessById,
	linkDocumentToProcess,
	linkPersonToProcess,
	linkToolToProcess,
	unlinkDocumentFromProcess,
	unlinkPersonFromProcess,
	unlinkToolFromProcess,
} from "@./services/processes.api";
import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { ProcessNode } from "@./types/process";
import { importanceLabel, kindLabel, statusLabel } from "@./utils/mapEnumsToUI";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "ProcessDetail">;

export function ProcessDetailScreen({ route, navigation }: Props) {
	const { processId } = route.params;
	const [process, setProcess] = useState<ProcessNode | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);

	const [toolName, setToolName] = useState("");
	const [toolUrl, setToolUrl] = useState("");
	const [personName, setPersonName] = useState("");
	const [personEmail, setPersonEmail] = useState("");
	const [documentTitle, setDocumentTitle] = useState("");
	const [documentUrl, setDocumentUrl] = useState("");

	const [savingTool, setSavingTool] = useState(false);
	const [savingPerson, setSavingPerson] = useState(false);
	const [savingDocument, setSavingDocument] = useState(false);
	const [removingId, setRemovingId] = useState<string | null>(null);

	const loadProcess = useCallback(async () => {
		setError(null);
		try {
			const data = await getProcessById(processId);
			setProcess(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Falha ao carregar processo");
		} finally {
			setLoading(false);
		}
	}, [processId]);

	useEffect(() => {
		void loadProcess();
	}, [loadProcess]);

	useFocusEffect(
		useCallback(() => {
			void loadProcess();
		}, [loadProcess]),
	);

	const handleAddTool = async () => {
		setActionError(null);

		const name = toolName.trim();
		if (!name) {
			setActionError("Informe o nome da ferramenta.");
			return;
		}

		setSavingTool(true);
		try {
			await linkToolToProcess(processId, {
				name,
				url: toolUrl.trim() || undefined,
			});
			setToolName("");
			setToolUrl("");
			await loadProcess();
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Falha ao vincular ferramenta");
		} finally {
			setSavingTool(false);
		}
	};

	const handleAddPerson = async () => {
		setActionError(null);

		const name = personName.trim();
		if (!name) {
			setActionError("Informe o nome do responsável.");
			return;
		}

		setSavingPerson(true);
		try {
			await linkPersonToProcess(processId, {
				name,
				email: personEmail.trim() || undefined,
			});
			setPersonName("");
			setPersonEmail("");
			await loadProcess();
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Falha ao vincular responsável");
		} finally {
			setSavingPerson(false);
		}
	};

	const handleAddDocument = async () => {
		setActionError(null);

		const title = documentTitle.trim();
		if (!title) {
			setActionError("Informe o título do documento.");
			return;
		}

		setSavingDocument(true);
		try {
			await linkDocumentToProcess(processId, {
				title,
				type: "URL",
				url: documentUrl.trim() || undefined,
			});
			setDocumentTitle("");
			setDocumentUrl("");
			await loadProcess();
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Falha ao vincular documento");
		} finally {
			setSavingDocument(false);
		}
	};

	const handleRemoveTool = async (toolId: string) => {
		setActionError(null);
		setRemovingId(toolId);
		try {
			await unlinkToolFromProcess(processId, toolId);
			await loadProcess();
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Falha ao remover ferramenta");
		} finally {
			setRemovingId(null);
		}
	};

	const handleRemovePerson = async (personId: string) => {
		setActionError(null);
		setRemovingId(personId);
		try {
			await unlinkPersonFromProcess(processId, personId);
			await loadProcess();
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Falha ao remover responsável");
		} finally {
			setRemovingId(null);
		}
	};

	const handleRemoveDocument = async (documentId: string) => {
		setActionError(null);
		setRemovingId(documentId);
		try {
			await unlinkDocumentFromProcess(processId, documentId);
			await loadProcess();
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Falha ao remover documento");
		} finally {
			setRemovingId(null);
		}
	};

	if (loading) {
		return (
			<View style={styles.container}>
				<Text style={styles.muted}>Carregando...</Text>
			</View>
		);
	}

	if (!process) {
		return (
			<View style={styles.container}>
				<Text style={styles.error}>Processo não encontrado</Text>
			</View>
		);
	}

	const tools = process.tools ?? [];
	const people = process.people ?? [];
	const documents = process.documents ?? [];

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<Card>
				<Text style={styles.title}>{process.name}</Text>
				<Text style={styles.muted}>{process.description ?? "Sem descrição"}</Text>
				<Text style={styles.meta}>Tipo: {kindLabel(process.kind)}</Text>
				<Text style={styles.meta}>Status: {statusLabel(process.status)}</Text>
				<Text style={styles.meta}>Importância: {importanceLabel(process.importance)}</Text>
				<AppButton
					label="Editar processo"
					onPress={() =>
						navigation.navigate("ProcessForm", {
							areaId: process.areaId,
							processId: process.id,
						})
					}
				/>
			</Card>

			{error ? <Text style={styles.error}>{error}</Text> : null}
			{actionError ? <Text style={styles.error}>{actionError}</Text> : null}

			<Card>
				<Text style={styles.sectionTitle}>Ferramentas</Text>
				{tools.length === 0 ? <Text style={styles.muted}>Nenhuma ferramenta</Text> : null}
				{tools.length > 0
					? tools.map((item) => (
							<View key={item.tool.id} style={styles.itemRow}>
								<View style={styles.itemTextWrap}>
									<Text style={styles.itemText}>{item.tool.name}</Text>
									{item.tool.url ? (
										<Text style={styles.itemSubText}>{item.tool.url}</Text>
									) : null}
								</View>
								<AppButton
									label="Remover"
									variant="danger"
									onPress={() => void handleRemoveTool(item.tool.id)}
									loading={removingId === item.tool.id}
								/>
							</View>
						))
					: null}

				<AppInput
					label="Nova ferramenta"
					placeholder="Ex.: Trello"
					value={toolName}
					onChangeText={setToolName}
				/>
				<AppInput
					label="URL da ferramenta (opcional)"
					placeholder="https://..."
					value={toolUrl}
					onChangeText={setToolUrl}
					autoCapitalize="none"
				/>
				<AppButton label="Vincular ferramenta" onPress={() => void handleAddTool()} loading={savingTool} />
			</Card>

			<Card>
				<Text style={styles.sectionTitle}>Responsáveis</Text>
				{people.length === 0 ? <Text style={styles.muted}>Nenhum responsável</Text> : null}
				{people.length > 0
					? people.map((item) => (
							<View key={item.person.id} style={styles.itemRow}>
								<View style={styles.itemTextWrap}>
									<Text style={styles.itemText}>{item.person.name}</Text>
									{item.person.email ? (
										<Text style={styles.itemSubText}>{item.person.email}</Text>
									) : null}
								</View>
								<AppButton
									label="Remover"
									variant="danger"
									onPress={() => void handleRemovePerson(item.person.id)}
									loading={removingId === item.person.id}
								/>
							</View>
						))
					: null}

				<AppInput
					label="Novo responsável"
					placeholder="Ex.: Equipe de RH"
					value={personName}
					onChangeText={setPersonName}
				/>
				<AppInput
					label="E-mail (opcional)"
					placeholder="responsavel@empresa.com"
					value={personEmail}
					onChangeText={setPersonEmail}
					autoCapitalize="none"
				/>
				<AppButton label="Vincular responsável" onPress={() => void handleAddPerson()} loading={savingPerson} />
			</Card>

			<Card>
				<Text style={styles.sectionTitle}>Documentos</Text>
				{documents.length === 0 ? <Text style={styles.muted}>Nenhum documento</Text> : null}
				{documents.length > 0
					? documents.map((item) => (
							<View key={item.document.id} style={styles.itemRow}>
								<View style={styles.itemTextWrap}>
									<Text style={styles.itemText}>{item.document.title}</Text>
									{item.document.url ? (
										<Text style={styles.itemSubText}>{item.document.url}</Text>
									) : null}
								</View>
								<AppButton
									label="Remover"
									variant="danger"
									onPress={() => void handleRemoveDocument(item.document.id)}
									loading={removingId === item.document.id}
								/>
							</View>
						))
					: null}

				<AppInput
					label="Novo documento"
					placeholder="Ex.: Fluxo de recrutamento"
					value={documentTitle}
					onChangeText={setDocumentTitle}
				/>
				<AppInput
					label="URL do documento (opcional)"
					placeholder="https://..."
					value={documentUrl}
					onChangeText={setDocumentUrl}
					autoCapitalize="none"
				/>
				<AppButton label="Vincular documento" onPress={() => void handleAddDocument()} loading={savingDocument} />
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
		paddingBottom: spacing.xl,
	},
	title: {
		color: colors.text,
		fontSize: 22,
		fontWeight: "700",
	},
	sectionTitle: {
		color: colors.text,
		fontWeight: "700",
		marginBottom: spacing.xs,
	},
	meta: {
		color: colors.muted,
	},
	muted: {
		color: colors.muted,
	},
	error: {
		color: colors.danger,
		paddingHorizontal: spacing.xs,
	},
	itemRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	itemTextWrap: {
		flex: 1,
		gap: spacing.xs,
	},
	itemText: {
		color: colors.text,
		fontSize: 15,
		fontWeight: "600",
	},
	itemSubText: {
		color: colors.muted,
		fontSize: 13,
	},
});

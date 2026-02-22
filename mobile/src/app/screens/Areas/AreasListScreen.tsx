import type { MainTabParamList, RootStackParamList } from "@./app/navigation";
import { AppButton } from "@./components/ui/AppButton";
import { AppInput } from "@./components/ui/AppInput";
import { Card } from "@./components/ui/Card";
import { useAreas } from "@./hooks/useAreas";
import { createArea } from "@./services/areas.api";
import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = CompositeScreenProps<
	BottomTabScreenProps<MainTabParamList, "Areas">,
	NativeStackScreenProps<RootStackParamList>
>;

export function AreasListScreen({ navigation }: Props) {
	const { areas, loading, error } = useAreas();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const handleCreateArea = async () => {
		const trimmedName = name.trim();
		if (!trimmedName) {
			setActionError("Informe o nome da área.");
			return;
		}

		setActionError(null);
		setIsSaving(true);

		try {
			const createdArea = await createArea({
				name: trimmedName,
				description: description.trim() || undefined,
			});
			setName("");
			setDescription("");
			setIsCreateModalOpen(false);
			navigation.navigate("ProcessTree", {
				areaId: createdArea.id,
				areaName: createdArea.name,
			});
		} catch (err) {
			setActionError(
				err instanceof Error ? err.message : "Falha ao cadastrar área",
			);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.subtitle}>
				Cadastre e organize as áreas para estruturar os processos da empresa.
			</Text>
			<AppButton
				label="Criar área"
				onPress={() => {
					setActionError(null);
					setIsCreateModalOpen(true);
				}}
				fullWidth
			/>

			{loading ? <Text style={styles.muted}>Carregando áreas...</Text> : null}
			{error ? <Text style={styles.error}>{error}</Text> : null}

			<ScrollView contentContainerStyle={styles.list}>
				{!loading && areas.length === 0 ? (
					<Card>
						<Text style={styles.emptyTitle}>Nenhuma área cadastrada</Text>
						<Text style={styles.muted}>
							Cadastre a primeira área para começar o mapeamento de processos.
						</Text>
					</Card>
				) : null}

				{areas.map((area) => (
					<Card key={area.id}>
						<Text style={styles.itemTitle}>{area.name}</Text>
						<Text style={styles.muted}>
							{area.description ?? "Sem descrição"}
						</Text>
						<AppButton
							label="Abrir área"
							variant="secondary"
							onPress={() =>
								navigation.navigate("ProcessTree", {
									areaId: area.id,
									areaName: area.name,
								})
							}
						/>
					</Card>
				))}
			</ScrollView>

			<Modal
				visible={isCreateModalOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsCreateModalOpen(false)}
			>
				<View style={styles.modalRoot}>
					<Pressable
						style={styles.modalBackdrop}
						onPress={() => setIsCreateModalOpen(false)}
					/>
					<Card style={styles.modalCard}>
						<Text style={styles.sectionTitle}>Nova área</Text>
						<AppInput
							label="Nome"
							placeholder="Ex.: Pessoas"
							value={name}
							onChangeText={setName}
						/>
						<AppInput
							label="Descrição"
							placeholder="Descreva o objetivo da área"
							value={description}
							onChangeText={setDescription}
							multiline
							numberOfLines={3}
						/>
						{actionError ? <Text style={styles.error}>{actionError}</Text> : null}
						<View style={styles.modalActions}>
							<AppButton
								label="Cancelar"
								variant="secondary"
								onPress={() => setIsCreateModalOpen(false)}
								style={styles.modalActionButton}
							/>
							<AppButton
								label="Cadastrar área"
								onPress={() => void handleCreateArea()}
								loading={isSaving}
								style={styles.modalActionButton}
							/>
						</View>
					</Card>
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
		gap: spacing.md,
	},
	subtitle: {
		color: colors.muted,
		fontSize: 14,
	},
	sectionTitle: {
		color: colors.text,
		fontSize: 18,
		fontWeight: "700",
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
		width: "100%",
	},
	modalActions: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	modalActionButton: {
		flex: 1,
	},
	list: {
		gap: spacing.md,
		paddingBottom: spacing.xl,
	},
	emptyTitle: {
		color: colors.text,
		fontSize: 18,
		fontWeight: "700",
	},
	itemTitle: {
		color: colors.text,
		fontSize: 18,
		fontWeight: "700",
	},
	muted: {
		color: colors.muted,
	},
	error: {
		color: colors.danger,
	},
});

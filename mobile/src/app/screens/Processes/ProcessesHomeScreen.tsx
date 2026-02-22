import type { MainTabParamList, RootStackParamList } from "@./app/navigation";
import { AppButton } from "@./components/ui/AppButton";
import { Card } from "@./components/ui/Card";
import { useAreas } from "@./hooks/useAreas";
import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = CompositeScreenProps<
	BottomTabScreenProps<MainTabParamList, "Processos">,
	NativeStackScreenProps<RootStackParamList>
>;

export function ProcessesHomeScreen({ navigation }: Props) {
	const { areas, loading, error } = useAreas();

	return (
		<View style={styles.container}>
			<Text style={styles.subtitle}>
				Selecione uma área para visualizar e gerenciar a árvore de processos.
			</Text>

			{loading ? <Text style={styles.muted}>Carregando áreas...</Text> : null}
			{error ? <Text style={styles.error}>{error}</Text> : null}

			<ScrollView contentContainerStyle={styles.list}>
				{!loading && areas.length === 0 ? (
					<Card>
						<Text style={styles.muted}>Nenhuma área cadastrada.</Text>
						<AppButton
							label="Ir para cadastro de áreas"
							onPress={() => navigation.navigate("Areas")}
						/>
					</Card>
				) : null}

				{areas.map((area) => (
					<Card key={area.id}>
						<Text style={styles.itemTitle}>{area.name}</Text>
						<Text style={styles.muted}>
							{area.description ?? "Sem descrição"}
						</Text>
						<View style={styles.actionsRow}>
							<AppButton
								label="Abrir árvore"
								variant="secondary"
								onPress={() =>
									navigation.navigate("ProcessTree", {
										areaId: area.id,
										areaName: area.name,
									})
								}
							/>
							<AppButton
								label="Novo processo"
								onPress={() =>
									navigation.navigate("ProcessForm", {
										areaId: area.id,
									})
								}
							/>
						</View>
					</Card>
				))}
			</ScrollView>
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
	subtitle: {
		color: colors.muted,
		fontSize: 14,
	},
	list: {
		gap: spacing.md,
		paddingBottom: spacing.xl,
	},
	itemTitle: {
		color: colors.text,
		fontSize: 18,
		fontWeight: "700",
	},
	actionsRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	muted: {
		color: colors.muted,
	},
	error: {
		color: colors.danger,
	},
});

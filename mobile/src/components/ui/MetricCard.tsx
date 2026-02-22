import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import { StyleSheet, Text, View } from "react-native";

type Props = {
	label: string;
	value: number;
};

export function MetricCard({ label, value }: Props) {
	return (
		<View style={styles.card}>
			<Text style={styles.value}>{value}</Text>
			<Text style={styles.label}>{label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.md,
		minWidth: "47%",
		gap: spacing.xs,
	},
	value: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.text,
	},
	label: {
		fontSize: 13,
		color: colors.muted,
	},
});

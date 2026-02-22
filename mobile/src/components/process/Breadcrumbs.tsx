import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import { StyleSheet, Text, View } from "react-native";

export function Breadcrumbs({ items }: { items: string[] }) {
	if (!items.length) return null;

	return (
		<View style={styles.row}>
			<Text style={styles.text}>{items.join(" > ")}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		marginTop: spacing.md / 2,
	},
	text: {
		color: colors.muted,
		fontSize: 12,
	},
});

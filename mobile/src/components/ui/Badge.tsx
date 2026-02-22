import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

export function Badge({ children }: PropsWithChildren) {
	return (
		<View style={styles.badge}>
			<Text style={styles.text}>{children}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	badge: {
		alignSelf: "flex-start",
		backgroundColor: colors.primarySoft,
		borderWidth: 1,
		borderColor: colors.primarySoftBorder,
		borderRadius: 999,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
	},
	text: {
		color: colors.primary,
		fontSize: 12,
		fontWeight: "600",
	},
});

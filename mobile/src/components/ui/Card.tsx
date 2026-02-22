import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

type Props = PropsWithChildren<{
	style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, style }: Props) {
	return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.lg,
		gap: spacing.sm,
	},
});

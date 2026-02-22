import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";

type AppButtonVariant = "primary" | "secondary" | "danger";

type Props = {
	label: string;
	onPress: (event: GestureResponderEvent) => void;
	variant?: AppButtonVariant;
	disabled?: boolean;
	loading?: boolean;
	fullWidth?: boolean;
	style?: StyleProp<ViewStyle>;
};

export function AppButton({
	label,
	onPress,
	variant = "primary",
	disabled = false,
	loading = false,
	fullWidth = false,
	style,
}: Props) {
	const isDisabled = disabled || loading;

	return (
		<Pressable
			onPress={onPress}
			disabled={isDisabled}
			style={({ pressed }) => [
				styles.base,
				variantStyles[variant],
				fullWidth && styles.fullWidth,
				pressed && !isDisabled && styles.pressed,
				isDisabled && styles.disabled,
				style,
			]}
		>
			<Text style={[styles.text, textVariantStyles[variant]]}>
				{loading ? "Carregando..." : label}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		borderRadius: 10,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.lg,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
	},
	fullWidth: {
		width: "100%",
	},
	pressed: {
		opacity: 0.85,
	},
	disabled: {
		opacity: 0.55,
	},
	text: {
		fontWeight: "700",
		fontSize: 14,
	},
});

const variantStyles: Record<AppButtonVariant, ViewStyle> = {
	primary: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	secondary: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
	},
	danger: {
		backgroundColor: colors.danger,
		borderColor: colors.danger,
	},
};

const textVariantStyles: Record<AppButtonVariant, { color: string }> = {
	primary: { color: colors.primaryContent },
	secondary: { color: colors.text },
	danger: { color: colors.textInverse },
};

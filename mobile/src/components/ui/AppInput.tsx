import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { TextInputProps } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
	label?: string;
	errorText?: string;
	helperText?: string;
} & TextInputProps;

export function AppInput({ label, errorText, helperText, style, ...props }: Props) {
	const hasError = Boolean(errorText);

	return (
		<View style={styles.container}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<TextInput
				placeholderTextColor={colors.muted}
				style={[styles.input, hasError && styles.inputError, style]}
				{...props}
			/>
			{hasError ? <Text style={styles.error}>{errorText}</Text> : null}
			{!hasError && helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: spacing.xs,
	},
	label: {
		color: colors.text,
		fontWeight: "600",
		fontSize: 14,
	},
	input: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		color: colors.text,
		fontSize: 15,
	},
	inputError: {
		borderColor: colors.danger,
	},
	helper: {
		color: colors.muted,
		fontSize: 12,
	},
	error: {
		color: colors.danger,
		fontSize: 12,
	},
});

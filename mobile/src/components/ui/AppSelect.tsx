import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SelectOption = {
	label: string;
	value: string;
};

type Props = {
	label?: string;
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	helperText?: string;
};

export function AppSelect({ label, value, onChange, options, helperText }: Props) {
	return (
		<View style={styles.container}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<View style={styles.optionsWrap}>
				{options.map((option) => {
					const isActive = option.value === value;
					return (
						<Pressable
							key={option.value}
							onPress={() => onChange(option.value)}
							style={[styles.option, isActive && styles.optionActive]}
						>
							<Text style={[styles.optionText, isActive && styles.optionTextActive]}>
								{option.label}
							</Text>
						</Pressable>
					);
				})}
			</View>
			{helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
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
	optionsWrap: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.sm,
	},
	option: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 999,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
	},
	optionActive: {
		backgroundColor: colors.primarySoft,
		borderColor: colors.primary,
	},
	optionText: {
		color: colors.text,
		fontSize: 13,
		fontWeight: "600",
	},
	optionTextActive: {
		color: colors.primary,
	},
	helper: {
		color: colors.muted,
		fontSize: 12,
	},
});

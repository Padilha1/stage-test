import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import { useMemo, useState } from "react";
import {
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

type SelectOption = {
	label: string;
	value: string;
	level?: number;
};

type Props = {
	label?: string;
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	helperText?: string;
	placeholder?: string;
};

export function AppDropdownSelect({
	label,
	value,
	onChange,
	options,
	helperText,
	placeholder = "Selecione uma opção",
}: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const selectedLabel = useMemo(() => {
		const selected = options.find((option) => option.value === value);
		return selected?.label ?? placeholder;
	}, [options, placeholder, value]);

	return (
		<View style={styles.container}>
			{label ? <Text style={styles.label}>{label}</Text> : null}

			<Pressable style={styles.field} onPress={() => setIsOpen(true)}>
				<Text style={styles.fieldText}>{selectedLabel}</Text>
				<Text style={styles.chevron}>v</Text>
			</Pressable>

			{helperText ? <Text style={styles.helper}>{helperText}</Text> : null}

			<Modal
				visible={isOpen}
				transparent
				animationType="slide"
				onRequestClose={() => setIsOpen(false)}
			>
				<View style={styles.modalRoot}>
					<Pressable style={styles.backdrop} onPress={() => setIsOpen(false)} />
					<View style={styles.sheet}>
						<Text style={styles.sheetTitle}>{label ?? "Selecione"}</Text>
						<ScrollView style={styles.optionsScroll}>
							{options.map((option) => {
								const isSelected = option.value === value;
								const optionLevel = Math.max(option.level ?? 0, 0);
								const isNestedOption = optionLevel > 0 && option.value !== "";
								const isRootOption = option.value === "";
								const nestedOffset = Math.min(optionLevel, 4) * spacing.md;

								return (
									<Pressable
										key={option.value || "__empty__"}
										style={[
											styles.option,
											isRootOption && styles.optionRoot,
											isNestedOption && styles.optionNested,
											{ marginLeft: nestedOffset },
											isSelected && styles.optionSelected,
										]}
										onPress={() => {
											onChange(option.value);
											setIsOpen(false);
										}}
									>
										{isNestedOption ? (
											<View style={styles.nestedMetaRow}>
												<View style={styles.nestedGuide} />
												<Text style={styles.nestedMetaText}>
													Subprocesso nível {optionLevel}
												</Text>
											</View>
										) : null}

										<Text
											style={[
												styles.optionText,
												isSelected && styles.optionTextSelected,
											]}
										>
											{option.label}
										</Text>
									</Pressable>
								);
							})}
						</ScrollView>
					</View>
				</View>
			</Modal>
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
	field: {
		borderRadius: 16,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	fieldText: {
		color: colors.text,
		fontSize: 16,
		flex: 1,
	},
	chevron: {
		color: colors.muted,
		fontSize: 16,
		paddingLeft: spacing.sm,
	},
	helper: {
		color: colors.muted,
		fontSize: 12,
	},
	modalRoot: {
		flex: 1,
		justifyContent: "flex-end",
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: colors.overlay,
	},
	sheet: {
		backgroundColor: colors.surface,
		width: "100%",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.md,
		paddingBottom: spacing.xl,
		maxHeight: "60%",
	},
	sheetTitle: {
		color: colors.text,
		fontWeight: "700",
		fontSize: 16,
		marginBottom: spacing.sm,
	},
	optionsScroll: {
		maxHeight: 320,
	},
	option: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: colors.border,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		marginBottom: spacing.xs,
	},
	optionRoot: {
		borderColor: colors.primary,
		backgroundColor: colors.primarySoft,
	},
	optionNested: {
		borderLeftWidth: 3,
		borderLeftColor: colors.primarySoftBorder,
	},
	optionSelected: {
		borderColor: colors.primary,
		backgroundColor: colors.primarySoft,
	},
	nestedMetaRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginBottom: spacing.xs,
	},
	nestedGuide: {
		width: spacing.sm,
		height: 2,
		borderRadius: 999,
		backgroundColor: colors.primarySoftBorder,
	},
	nestedMetaText: {
		color: colors.textSubtle,
		fontSize: 11,
		fontWeight: "600",
	},
	optionText: {
		color: colors.text,
		fontSize: 15,
	},
	optionTextSelected: {
		color: colors.primary,
		fontWeight: "600",
	},
});

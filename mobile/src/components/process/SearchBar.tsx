import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import { StyleSheet, TextInput, View } from "react-native";

export function SearchBar({
	value,
	onChange,
}: {
	value: string;
	onChange: (text: string) => void;
}) {
	return (
		<View style={styles.container}>
			<TextInput
				value={value}
				onChangeText={onChange}
				placeholder="Buscar processo"
				placeholderTextColor={colors.muted}
				style={styles.input}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.surface,
		borderRadius: 10,
		borderColor: colors.border,
		borderWidth: 1,
		paddingHorizontal: spacing.md,
	},
	input: {
		height: 44,
		color: colors.text,
	},
});

import { Badge } from "@./components/ui/Badge";
import { Card } from "@./components/ui/Card";
import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import type { ProcessNode } from "@./types/process";
import { kindLabel, statusLabel } from "@./utils/mapEnumsToUI";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
	node: ProcessNode;
	level: number;
	expanded: boolean;
	onToggle: (id: string) => void;
	onPress: (id: string) => void;
};

export function ProcessNodeItem({
	node,
	level,
	expanded,
	onToggle,
	onPress,
}: Props) {
	const hasChildren = node.children.length > 0;
	const isChild = level > 0;

		return (
			<View
				style={[
					styles.container,
					{
						marginLeft: level * spacing.sm,
						marginRight: level * spacing.xs,
					},
				]}
			>
			<Card style={isChild ? styles.childCard : undefined}>
				<View style={styles.header}>
					<Pressable style={styles.titlePressable} onPress={() => onPress(node.id)}>
						<Text style={styles.title}>{node.name}</Text>
					</Pressable>

					<View style={styles.actions}>
						{hasChildren ? (
							<Pressable onPress={() => onToggle(node.id)}>
								<Text style={styles.toggle}>
									{expanded ? "Recolher" : "Expandir"}
								</Text>
							</Pressable>
						) : null}
						<Ionicons
							name="pencil-outline"
							size={18}
							color={colors.muted}
							style={styles.pencil}
						/>
					</View>
				</View>

				<View style={styles.tags}>
					<Badge>{kindLabel(node.kind)}</Badge>
					<Badge>{statusLabel(node.status)}</Badge>
				</View>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: "stretch",
	},
	childCard: {
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.md,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	titlePressable: {
		flex: 1,
		paddingRight: spacing.sm,
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	title: {
		color: colors.text,
		fontSize: 16,
		fontWeight: "600",
		flexShrink: 1,
	},
	toggle: {
		color: colors.primary,
		fontWeight: "600",
	},
	pencil: {
		opacity: 0.9,
	},
	tags: {
		flexDirection: "row",
		gap: spacing.sm,
	},
});

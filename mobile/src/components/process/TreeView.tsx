import { ProcessNodeItem } from "@./components/process/ProcessNodeItem";
import { spacing } from "@./theme/spacing";
import type { ProcessNode } from "@./types/process";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

function filterNodes(nodes: ProcessNode[], term: string): ProcessNode[] {
	if (!term) return nodes;

	const normalized = term.toLowerCase();

	return nodes
		.map((node) => {
			const children = filterNodes(node.children, term);
			const matches = node.name.toLowerCase().includes(normalized);

			if (!matches && children.length === 0) {
				return null;
			}

			return {
				...node,
				children,
			};
		})
		.filter(Boolean) as ProcessNode[];
}

type Props = {
	nodes: ProcessNode[];
	searchTerm: string;
	onSelectNode: (id: string) => void;
};

export function TreeView({ nodes, searchTerm, onSelectNode }: Props) {
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});

	const filtered = useMemo(
		() => filterNodes(nodes, searchTerm),
		[nodes, searchTerm],
	);

	const toggle = (id: string) => {
		setExpanded((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const renderNode = (node: ProcessNode, level: number): JSX.Element => {
		const isExpanded = expanded[node.id] ?? false;

		return (
			<View key={node.id} style={styles.nodeWrap}>
				<ProcessNodeItem
					node={node}
					level={level}
					expanded={isExpanded}
					onToggle={toggle}
					onPress={onSelectNode}
				/>
				{isExpanded
					? node.children.map((child) => renderNode(child, level + 1))
					: null}
			</View>
		);
	};

	return (
		<View style={styles.treeWrap}>
			{filtered.map((node) => renderNode(node, 0))}
		</View>
	);
}

const styles = StyleSheet.create({
	nodeWrap: {
		gap: spacing.xs,
	},
	treeWrap: {
		gap: spacing.xs,
	},
});

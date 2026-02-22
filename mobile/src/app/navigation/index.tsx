import { AreasListScreen } from "@./app/screens/Areas/AreasListScreen";
import { DashboardScreen } from "@./app/screens/Dashboard/DashboardScreen";
import { ProcessDetailScreen } from "@./app/screens/Processes/ProcessDetailScreen";
import { ProcessesHomeScreen } from "@./app/screens/Processes/ProcessesHomeScreen";
import { ProcessFormScreen } from "@./app/screens/Processes/ProcessFormScreen";
import { ProcessGraphScreen } from "@./app/screens/Processes/ProcessGraphScreen";
import { ProcessTreeScreen } from "@./app/screens/Processes/ProcessTreeScreen";
import { colors } from "@./theme/colors";
import { spacing } from "@./theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type MainTabParamList = {
	Dashboard: undefined;
	Areas: undefined;
	Processos: undefined;
};

export type RootStackParamList = {
	MainTabs: undefined;
	ProcessTree: { areaId: string; areaName: string };
	ProcessGraph: { areaId: string; areaName: string };
	ProcessDetail: { processId: string };
	ProcessForm: { areaId: string; processId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function getTabIconName(
	routeName: keyof MainTabParamList,
	focused: boolean,
): keyof typeof Ionicons.glyphMap {
	if (routeName === "Dashboard") {
		return focused ? "speedometer" : "speedometer-outline";
	}

	if (routeName === "Areas") {
		return focused ? "layers" : "layers-outline";
	}

	return focused ? "git-network" : "git-network-outline";
}

function MainTabsNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="Dashboard"
			screenOptions={({ route }) => ({
				headerStyle: { backgroundColor: colors.surface3 },
				headerShadowVisible: false,
				headerTitleStyle: {
					color: colors.text,
					fontWeight: "700",
				},
				tabBarStyle: {
					height: 66,
					paddingBottom: spacing.md - spacing.xs / 2,
					paddingTop: spacing.sm,
					backgroundColor: colors.surface3,
					borderTopColor: colors.borderStrong,
					borderTopWidth: 1,
				},
				tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.muted,
				tabBarIcon: ({ color, size, focused }) => (
					<Ionicons
						name={getTabIconName(route.name, focused)}
						size={size - 1}
						color={color}
					/>
				),
			})}
		>
			<Tab.Screen
				name="Dashboard"
				component={DashboardScreen}
				options={{ title: "Dashboard", tabBarLabel: "Dashboard" }}
			/>
			<Tab.Screen
				name="Areas"
				component={AreasListScreen}
				options={{ title: "Áreas", tabBarLabel: "Áreas" }}
			/>
			<Tab.Screen
				name="Processos"
				component={ProcessesHomeScreen}
				options={{ title: "Processos", tabBarLabel: "Processos" }}
			/>
		</Tab.Navigator>
	);
}

export function AppNavigator() {
	return (
		<Stack.Navigator
			initialRouteName="MainTabs"
			screenOptions={{
				headerStyle: { backgroundColor: colors.surface3 },
				headerTitleStyle: {
					color: colors.text,
					fontWeight: "700",
				},
				headerShadowVisible: false,
				headerBackTitle: "Voltar",
				headerBackButtonDisplayMode: "generic",
			}}
		>
			<Stack.Screen
				name="MainTabs"
				component={MainTabsNavigator}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ProcessTree"
				component={ProcessTreeScreen}
				options={{ title: "Árvore de Processos" }}
			/>
			<Stack.Screen
				name="ProcessGraph"
				component={ProcessGraphScreen}
				options={{ title: "Visualização Gráfica" }}
			/>
			<Stack.Screen
				name="ProcessDetail"
				component={ProcessDetailScreen}
				options={{ title: "Detalhes do Processo" }}
			/>
			<Stack.Screen
				name="ProcessForm"
				component={ProcessFormScreen}
				options={{ title: "Formulário de Processo" }}
			/>
		</Stack.Navigator>
	);
}

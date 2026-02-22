import { Text } from "react-native";

type IconName = "manual" | "system";

const icons: Record<IconName, string> = {
  manual: "🧩",
  system: "⚙️",
};

export function Icon({ name }: { name: IconName }) {
  return <Text>{icons[name]}</Text>;
}

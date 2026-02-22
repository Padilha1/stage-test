import type { Area } from "@./types/area";

const LEGACY_DEMO_NAME_EN = "Operations";
const LEGACY_DEMO_DESC_EN = "Core operational process area";

export function normalizeAreaText(area: Area): Area {
	const normalizedName =
		area.name.trim() === LEGACY_DEMO_NAME_EN ? "Operações" : area.name;

	const normalizedDescription =
		area.description?.trim() === LEGACY_DEMO_DESC_EN
			? "Área operacional principal"
			: area.description;

	return {
		...area,
		name: normalizedName,
		description: normalizedDescription,
	};
}

export const colors = {
	background: "#f4f7fb",
	surface: "#ffffff",
	surface2: "#f8fafc",
	surface3: "#eef2f7",

	text: "#152238",
	textMuted: "#6b7a90",
	textSubtle: "#8a97ab",
	textInverse: "#ffffff",

	border: "#d9e1ec",
	borderStrong: "#c6d2e3",
	divider: "#e6edf6",

	primary: "#1758d6",
	primaryHover: "#134ab6",
	primaryPressed: "#0f3f9b",
	primarySoft: "#e8f0ff",
	primarySoftBorder: "#cfe0ff",
	primaryContent: "#ffffff",

	secondary: "#6d28d9",
	secondaryHover: "#5b21b6",
	secondaryPressed: "#4c1d95",
	secondarySoft: "#f0e9ff",
	secondarySoftBorder: "#e1d4ff",
	secondaryContent: "#ffffff",

	muted: "#6b7a90",
	mutedSoft: "#eef2f7",
	mutedContent: "#152238",
	neutral: "#334155",
	neutralSoft: "#e2e8f0",
	neutralContent: "#0f172a",

	success: "#1f8a3d",
	successHover: "#187032",
	successSoft: "#e7f6ec",
	successContent: "#0b3b1a",

	warning: "#b7791f",
	warningHover: "#976318",
	warningSoft: "#fff5e6",
	warningContent: "#4a2c0b",

	danger: "#b83232",
	dangerHover: "#962929",
	dangerSoft: "#fde8e8",
	dangerContent: "#4b0d0d",

	info: "#0ea5e9",
	infoHover: "#0284c7",
	infoSoft: "#e6f6ff",
	infoContent: "#083344",

	focusRing: "#93c5fd",
	overlay: "rgba(15, 23, 42, 0.45)",

	disabledBg: "#eef2f7",
	disabledText: "#9aa8bd",
	disabledBorder: "#e2e8f0",

	shadow: "rgba(15, 23, 42, 0.10)",
} as const;

export const processKindUI = {
	MANUAL: { icon: "hand", color: colors.secondary },
	SYSTEM: { icon: "cpu", color: colors.primary },
} as const;

export const processStatusUI = {
	DRAFT: { label: "Rascunho", color: colors.muted, soft: colors.mutedSoft },
	ACTIVE: { label: "Ativo", color: colors.success, soft: colors.successSoft },
	DEPRECATED: {
		label: "Descontinuado",
		color: colors.danger,
		soft: colors.dangerSoft,
	},
} as const;

export const processImportanceUI = {
	LOW: { label: "Baixa", color: colors.muted, soft: colors.mutedSoft },
	MEDIUM: { label: "Média", color: colors.warning, soft: colors.warningSoft },
	HIGH: { label: "Alta", color: colors.danger, soft: colors.dangerSoft },
} as const;

export const colorSystem603010 = {
	base60: [colors.background, colors.surface, colors.surface2, colors.surface3],
	support30: [
		colors.border,
		colors.borderStrong,
		colors.divider,
		colors.textMuted,
	],
	accent10: [
		colors.primary,
		colors.secondary,
		colors.info,
		colors.success,
		colors.warning,
		colors.danger,
	],
} as const;

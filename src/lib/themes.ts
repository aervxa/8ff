export const THEMES = [
	'default',
	'bubblegum',
	'caffeine',
	'catppuccin',
	'darkmatter',
	'notebook'
] as const;

export type Theme = (typeof THEMES)[number];

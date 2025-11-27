export const THEMES = [
	'default',
	'bubblegum',
	'catppuccin',
	'notebook'
] as const;

export type Theme = (typeof THEMES)[number];

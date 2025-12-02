export const THEMES = [
	'default',
	'bubblegum',
	'catppuccin',
	'notebook',
	'blood-moon'
] as const;

export type Theme = (typeof THEMES)[number];

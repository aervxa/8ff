<script lang="ts">
	import { THEMES, type Theme } from '$lib/themes';
	import { onMount } from 'svelte';
	import ThemeItem from './ThemeItem.svelte';
	import * as Select from './ui/select';

	let theme: Theme = $state('default');
	// vars to track mouse pos when changing theme
	let x: number;
	let y: number;

	const updateTheme = async (value: string) => {
		await document.startViewTransition(() => {
			document.documentElement.dataset.theme = value;
			localStorage.setItem('8ff-app-theme', value);
		}).ready;

		// If the circle start from 0,0 the circle must have a radius of the diagonal of the screen to animate "fully"
		// Basic trigonometry (a² + b² = c²) where a is height, b is width, and c is the diagonal
		const diagonal = Math.sqrt(window.innerHeight ** 2 + window.innerWidth ** 2);

		x = x || window.innerWidth;
		y = y || 0;

		document.documentElement.animate(
			{
				clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${diagonal}px at ${x}px ${y}px)`]
			},
			{
				duration: 800,
				easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
				pseudoElement: '::view-transition-new(root)',
			}
		);
	};

	onMount(() => {
		const localTheme = localStorage.getItem('8ff-app-theme') as Theme | null;
		if (theme != localTheme) {
			theme = localTheme || theme;
			updateTheme(theme);
		}
	});
</script>

<Select.Root type="single" bind:value={theme} onValueChange={updateTheme}>
	<Select.Trigger>
		{theme}
	</Select.Trigger>
	<Select.Content align="end">
		<Select.Group>
			<Select.Label>Themes</Select.Label>
			{#each THEMES as THEME}
				<Select.Item
					value={THEME}
					label={THEME}
					disabled={THEME == theme}
					onclick={(e) => {
						x = e.clientX;
						y = e.clientY;
					}}
				>
					<ThemeItem theme={THEME} />
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

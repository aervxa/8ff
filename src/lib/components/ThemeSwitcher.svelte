<script lang="ts">
	import { THEMES, type Theme } from '$lib/themes';
	import { onMount } from 'svelte';
	import ThemeItem from './ThemeItem.svelte';
	import * as Select from './ui/select';

	let theme: Theme = $state('default');

	const updateTheme = (value: string) => {
		document.documentElement.dataset.theme = value;
		localStorage.setItem('8ff-app-theme', value);
	};

	onMount(() => {
		const localTheme = localStorage.getItem('8ff-app-theme') as Theme | null;
		theme = localTheme || theme;
		updateTheme(theme);
	});
</script>

<Select.Root type="single" bind:value={theme} onValueChange={updateTheme}>
	<Select.Trigger class="w-[180px].">
		{theme}
	</Select.Trigger>
	<Select.Content align="end">
		<Select.Group>
			<Select.Label>Themes</Select.Label>
			{#each THEMES as THEME}
				<Select.Item value={THEME} label={THEME} disabled={THEME == theme}>
					<ThemeItem theme={THEME} />
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

<script lang="ts">
	import type { Theme } from '$lib/themes';

	const { theme }: { theme: Theme } = $props();
</script>

<div class="flex items-center-safe gap-3 px-1 py-0.5" data-theme={theme}>
	<div class="translate-y-0.5. flex gap-1">
		<!--
		  'suggestCanonicalClasses' errors can be ignored since each theme has it's own rounding,
			but in the theme selector, the roundness should be theme-agnostic to have a uniform look
		-->
		<span class="size-3 rounded-[4px] border border-white/40 bg-primary"></span>
		<span class="size-3 rounded-[4px] border border-white/40 bg-secondary"></span>
		<span class="size-3 rounded-[4px] border border-white/40 bg-accent"></span>
		<span class="size-3 rounded-[4px] border border-white/40 bg-background"></span>
	</div>
	<p class="font-medium opacity-80">{theme.replace(/^./, (c) => c.toUpperCase())}</p>
</div>

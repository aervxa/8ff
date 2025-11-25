<script lang="ts">
	import Words from '$lib/components/Words.svelte';
	import type { TypingResults } from '$lib/utils';

	let results: TypingResults | null = $state(null);
</script>

<main
	class="flex h-full w-full flex-col items-center-safe justify-center-safe bg-background font-mono font-medium"
>
	{#if results}
		{JSON.stringify(results)}
	{:else}
		<Words
			onComplete={(r) => {
				results = r;
			}}
		/>
	{/if}
</main>

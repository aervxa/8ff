<script lang="ts">
	import Result from '$lib/components/Result.svelte';
	import Words from '$lib/components/Words.svelte';
	import type { TypingResults } from '$lib/utils';

	let results: TypingResults | null = $state(null);
</script>

<main
	class="relative flex h-full w-full flex-1 flex-col items-center-safe justify-center-safe bg-background"
>
	{#if results}
		<Result
			{results}
			playAgain={() => {
				results = null;
			}}
		/>
	{:else}
		<Words
			onComplete={(r) => {
				results = r;
			}}
		/>
	{/if}
</main>

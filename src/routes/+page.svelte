<script lang="ts">
	import Result from '$lib/components/Result.svelte';
	import Words from '$lib/components/Words.svelte';
	import type { TypingResults } from '$lib/utils';

	let results: TypingResults | null = $state(null);
</script>

<main
	class="flex h-full w-full flex-col items-center-safe justify-center-safe bg-background pt-16 pb-64 font-mono font-medium"
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

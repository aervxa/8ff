<script lang="ts">
	import Result from '$lib/components/Result.svelte';
	import * as Kbd from '$lib/components/ui/kbd';
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

	<!-- Hints -->
	<div
		class="sized-40 absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col pb-8 whitespace-nowrap [&_span]:text-sm"
	>
		<Kbd.Group>
			<Kbd.Root>tab</Kbd.Root>
			<span>+</span>
			<Kbd.Root>enter</Kbd.Root>
			<span>-</span>
			<span>restart test</span>
		</Kbd.Group>
	</div>
</main>

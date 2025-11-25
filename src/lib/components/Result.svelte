<script lang="ts">
	import { randomFace } from '$lib/faces';
	import type { TypingResults } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Button } from './ui/button';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import clsx from 'clsx';
	import { getLine } from '$lib/punchLines';

	const { results, playAgain }: { results: TypingResults; playAgain: () => void } = $props();

	// Give it empty states for it to take space in the layout
	// (opacity will be applied until they are given another value)
	let face = $state('^^');
	let punchLine = $state('none');

	onMount(() => {
		face = randomFace();
		punchLine = getLine(results.wpm);
	});
</script>

<div class="flex flex-col items-center gap-6">
	<p
		class={clsx(face == '^^' && 'opacity-0', 'text-5xl leading-relaxed font-semibold text-primary')}
	>
		{face}
	</p>

	<p
		class={clsx(
			punchLine == 'none' && 'opacity-0',
			'text-3xl font-medium tracking-wide opacity-80'
		)}
	>
		{punchLine}
	</p>

	<div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
		<div class="flex flex-col text-center font-semibold">
			<p class="text-xl tracking-wide opacity-60">wpm</p>
			<p class="text-4xl leading-relaxed">{results.wpm}</p>
		</div>
		<div class="flex flex-col text-center font-semibold">
			<p class="text-xl tracking-wide opacity-60">acc</p>
			<p class="text-4xl leading-relaxed">{results.acc}<span class="ml-1">%</span></p>
		</div>

		<div class="flex flex-col text-center font-medium">
			<p class="text-base tracking-wide opacity-60">rwpm</p>
			<p class="text-2xl leading-snug opacity-80">{results.rwpm}</p>
		</div>
		<div class="flex flex-col text-center font-medium">
			<p class="text-base tracking-wide opacity-60">rawpm</p>
			<p class="text-2xl leading-snug opacity-80">{results.rawpm}</p>
		</div>
	</div>

	<div class="mt-2 text-center">
		<p class="text-sm opacity-40">test type:</p>
		<p class="opacity-60">30s random words</p>
	</div>
	<Button
		variant="outline"
		onclick={() => {
			playAgain();
		}}
	>
		<ChevronRight />
		Play again
	</Button>
</div>

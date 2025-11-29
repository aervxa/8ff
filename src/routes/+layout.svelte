<script lang="ts">
	import './layout.css';
	import '@fontsource-variable/red-hat-mono/wght';
	import '@fontsource-variable/red-hat-mono/wght-italic';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
	<title>Typing Test | 8fastfingers | 8ff</title>
</svelte:head>

<div class="flex min-h-full flex-col px-6 font-mono sm:px-8">
	<Nav />

	{@render children()}

	<footer class="mt-auto flex justify-between border-t px-6 py-4 text-sm select-none">
		<p class="font-light tracking-wide opacity-80">
			Built by <a
				href="https://www.github.com/aervxa"
				target="_blank"
				class="font-medium text-primary underline">@aervxa</a
			>
		</p>
		<p class="font-extralight tracking-wide opacity-60">CS50x 2025</p>
	</footer>
</div>

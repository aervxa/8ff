<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import '@fontsource-variable/red-hat-mono/wght-italic.css';
	import '@fontsource-variable/red-hat-mono/wght.css';
	import Logo from '$lib/components/Logo.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-full flex-col px-6 font-mono sm:px-8">
	<nav
		class="mx-auto flex h-13 w-full max-w-prose translate-y-4 justify-between self-center rounded-xl border border-border p-3 text-3xl"
	>
		<div class="flex gap-3 px-1 select-none [&>svg]:shrink-0 [&>svg]:opacity-80">
			<Logo />
			<div class="relative whitespace-nowrap">
				<p class="text-2xl leading-none font-semibold tracking-wide opacity-80">
					<i class="text-primary opacity-80">8f</i>ast<i class="text-primary opacity-80">f</i>ingers
				</p>
				<p class="absolute top-full text-xs leading-1 opacity-60">not 10</p>
			</div>
		</div>
	</nav>

	{@render children()}

	<footer class="mt-auto flex justify-between border-t px-6 py-4 select-none text-sm">
		<p class="font-light tracking-wide opacity-80">
			Built by <span class="font-medium text-primary">@aervxa</span>
		</p>
		<p class="font-extralight tracking-wide opacity-60">CS50x 2025</p>
	</footer>
</div>

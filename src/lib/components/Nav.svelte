<script>
	import Logo from './Logo.svelte';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
</script>

<nav
	class="mx-auto flex h-13 w-full max-w-prose translate-y-4 justify-between self-center rounded-xl border border-border p-2 text-3xl"
>
	<div class="flex gap-3 px-2 py-1 select-none [&>svg]:shrink-0 [&>svg]:opacity-80">
		<Logo />
		<div class="relative whitespace-nowrap">
			<p class="text-2xl leading-none font-semibold tracking-wide opacity-80">
				<i class="text-primary opacity-80">8f</i>ast<i class="text-primary opacity-80">f</i>ingers
			</p>
			<p class="absolute top-full text-xs leading-1 opacity-60">not 10</p>
		</div>
	</div>
	<div class="flex gap-3">
		<ThemeSwitcher />
	</div>
</nav>

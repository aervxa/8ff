<script lang="ts">
	import { lang, LANGS, type LangCode } from '$lib/lang.svelte';
	import { onMount } from 'svelte';
	import * as Select from './ui/select';

	onMount(() => {
		lang.init();
	});
</script>

<Select.Root
	type="single"
	onValueChange={(value) => {
		lang.value = value as LangCode;
	}}
>
	<Select.Trigger>
		{lang.value}
	</Select.Trigger>
	<Select.Content align="end">
		<Select.Group>
			<Select.Label>Themes</Select.Label>
			{#each LANGS as LANG}
				<Select.Item value={LANG} label={LANG} disabled={LANG == lang.value}>
					{LANG}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

<script>
	import ChartMinutes from './ChartMinutes.svelte';
	import ChartWeeks from './ChartWeeks.svelte';
	import ChartTags from './ChartTags.svelte';

	export let list;
</script>

<h2>Charts</h2>

<div class="flex flex-col sm:flex-row justify-between">
	<ChartWeeks {list} />
	<ChartMinutes {list} />
</div>

<ChartTags {list} />

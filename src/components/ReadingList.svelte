<script>
	import ReadingListItem from '../components/ReadingListItem.svelte';
	import { calculateWeeksAgo, getWeeksAgo } from '../utils';

	export let list;
</script>

<h2>Reading List ({list.length})</h2>

<ul>
	{#each list as item, index}
		{#if item.time_added}
			{#if index === 0 || calculateWeeksAgo(item.time_added) !== calculateWeeksAgo(list[index - 1].time_added)}
				<h3>{getWeeksAgo(item.time_added)}</h3>
			{/if}
		{/if}
		<ReadingListItem {item} />
	{/each}
</ul>

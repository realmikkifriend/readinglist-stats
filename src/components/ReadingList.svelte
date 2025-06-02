<script>
	import ReadingListItem from '../components/ReadingListItem.svelte';
	import { calculateWeeksAgo, getWeeksAgo } from '../utils';

	export let list;
</script>

<h2>Reading List ({list.count})</h2>

<ul>
	{#each list as item, index}
		{#if item.type === 'bookmark'}
			{#if item.time}
				{#if index === 0 || calculateWeeksAgo(item.time) !== calculateWeeksAgo(list[index - 1].time)}
					<h3>{getWeeksAgo(item.time)}</h3>
				{/if}
			{/if}
			<ReadingListItem {item} />
		{/if}
	{/each}
</ul>

<script>
	import { get } from 'svelte/store';
	import { Body } from 'svelte-body';
	import { readingList } from '../stores';
	import QuickReference from '../components/QuickReference.svelte';
	import Charts from '../components/Charts.svelte';
	import ReadingList from '../components/ReadingList.svelte';
	// import { getFilteredList } from '../utils';

	let list;
	$: list = get(readingList);
</script>

<Body />

<div class="flex justify-center items-start min-h-screen bg-primary mx-2">
	<div class="max-w-xl w-full bg-secondary p-6 rounded-lg shadow-md mt-8 relative">
		<h1 class="mb-4">Reading List Stats</h1>

		{#if typeof list !== 'object'}
			<div class="flex flex-col sm:flex-row items-center">
				<p class="text-center sm:text-left">
					This mini-app will grab a copy of your current reading list and then display some stats
					and charts.
				</p>
			</div>
		{:else if list.filter((item) => item.type === 'bookmark').length > 0}
			<!-- <QuickReference {list} /> -->
			<!-- <Charts {list} /> -->
			<ReadingList {list} />
		{:else}
			List empty
		{/if}

		<footer>
			<a href="https://github.com/realmikkifriend/readinglist-stats">open-source app</a> created by
			<a href="https://github.com/realmikkifriend/">Mikki Friend</a><br />
			not endorsed by any app &bull; no personal data is stored
		</footer>
	</div>
</div>

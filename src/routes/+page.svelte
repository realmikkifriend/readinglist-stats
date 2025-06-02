<script>
	import { onMount } from 'svelte';
	import { Body } from 'svelte-body';
	import QuickReference from '../components/QuickReference.svelte';
	import Charts from '../components/Charts.svelte';
	import ReadingList from '../components/ReadingList.svelte';
	import { getFilteredList } from '../utils';

	export let data;

	let authUri, list, token;

	onMount(() => {
		authUri = data.authUri;
		token = data.accessToken;
		list = getFilteredList(data.response);
	});
</script>

<Body />

<div class="flex justify-center items-start min-h-screen bg-primary mx-2">
	<div class="max-w-xl w-full bg-secondary p-6 rounded-lg shadow-md mt-8 relative">
		<h1 class="mb-4">Reading List Stats</h1>

		{#if typeof token !== 'string' || token.length === 0}
			<div class="flex flex-col sm:flex-row items-center">
				<button class="mr-2 my-1 h-fit">
					<a href={authUri} class="button whitespace-nowrap">Authorize to Access Reading List</a>
				</button>
				<p class="text-center sm:text-left">
					This mini-app will grab a copy of your current reading list and then display some stats
					and charts.
				</p>
			</div>
		{:else if list.length > 0}
			<QuickReference {list} />
			<Charts {list} />
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

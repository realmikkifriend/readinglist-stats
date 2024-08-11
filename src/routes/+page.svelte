<script>
	import { onMount } from 'svelte';
	import { Body } from 'svelte-body';
	import QuickReference from '../components/QuickReference.svelte';
	import Charts from '../components/Charts.svelte';
	import ReadingList from '../components/ReadingList.svelte';
	import { getFilteredList } from '../utils';
	import { themeStore } from '../stores';

	export let data;

	let authUri, list, token;
	let theme;

	$: theme = $themeStore;

	onMount(() => {
		authUri = data.authUri;
		token = data.accessToken;
		list = getFilteredList(data.response);
	});

	function handleClassChange(event) {
		themeStore.set(event.target.value);
	}
</script>

<Body class={theme} />

<div class="flex justify-center items-start min-h-screen bg-primary">
	<div class="max-w-xl w-full bg-secondary p-6 rounded-lg shadow-md mt-8 relative">
		<h1 class="mb-4">Pocket Stats</h1>

		<select
			bind:value={theme}
			on:change={handleClassChange}
			class="absolute top-4 right-4 p-2 bg-primary text-link rounded"
		>
			<option value="dark">Dark</option>
			<option value="forest">Forest</option>
			<option value="winter">Winter</option>
			<option value="extreme">Extreme</option>
		</select>

		{#if typeof token !== 'string' || token.length === 0}
			<button>
				<a href={authUri} class="button">Authorize Pocket</a>
			</button>
		{:else if list.length > 0}
			<QuickReference {list} />
			<Charts {list} />
			<ReadingList {list} />
		{:else}
			List empty
		{/if}

		<footer>
			created by <a href="https://github.com/realmikkifriend/">Mikki Friend</a>, not endorsed by
			Pocket, no data is stored
		</footer>
	</div>
</div>

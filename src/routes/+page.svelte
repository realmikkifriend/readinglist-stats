<script>
	import { enhance } from '$app/forms';
	import { get } from 'svelte/store';
	import { Body } from 'svelte-body';
	import { readingList } from '../stores';
	import QuickReference from '../components/QuickReference.svelte';
	// import Charts from '../components/Charts.svelte';
	import ReadingList from '../components/ReadingList.svelte';

	export let form;
	let successValue;
	$: if (form?.success !== undefined) {
		if (form.success === true) {
			successValue = 'logged in, reloading';
			window.location.reload();
		} else {
			successValue = 'login error, check details and try again';
		}
	}

	let list;
	$: list = get(readingList);
</script>

<Body />

<div class="flex justify-center items-start min-h-screen bg-primary mx-2">
	<div class="max-w-xl w-full bg-secondary p-6 rounded-lg shadow-md mt-8 relative">
		<h1 class="mb-4">Reading List Stats</h1>
		{#if typeof list !== 'object'}
			<div class="flex flex-col items-center">
				<p class="text-center">
					This mini-app will grab a copy of your current reading list and then display some stats
					and charts.
				</p>

				<form class="px-4 py-6" method="POST" action="?/login" use:enhance>
					<label class="block text-primary text-sm font-bold mb-2" for="username">
						Instapaper username/email
					</label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-accent leading-tight focus:outline-none focus:shadow-outline"
						name="username"
						type="text"
						placeholder="username/email"
						required
					/>
					<label class="block text-primary text-sm font-bold mb-2 mt-2" for="password">
						Instapaper password (if any)
					</label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-accent leading-tight focus:outline-none focus:shadow-outline"
						name="password"
						type="password"
					/>
					<div class="flex items-center justify-between py-2">
						<button
							class="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Log In
						</button>
					</div>
				</form>
				{#if successValue}
					<p class="text-red-500 text-sm mt-2">{successValue}</p>
				{/if}
			</div>
		{:else if typeof list === 'object' && list?.filter((item) => item.type === 'bookmark').length > 0}
			<QuickReference {list} />
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

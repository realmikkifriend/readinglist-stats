<script>
	import { onMount } from 'svelte';
	import { calculateWeeksAgo } from '../utils';

	export let list;

	let oldestArticle, longestArticle, shortestArticle;
	let noTagArticles = [];
	let noTimeToReadArticles = [];
	let showNoTagArticles = false;
	let showNoTimeToReadArticles = false;

	onMount(() => {
		if (list.length > 0) {
			oldestArticle = list.reduce((prev, current) => {
				return prev.time_added < current.time_added ? prev : current;
			});

			const validArticles = list.filter((article) => article.time_to_read != null);

			if (validArticles.length > 0) {
				longestArticle = validArticles.reduce((prev, current) => {
					return prev.time_to_read > current.time_to_read ? prev : current;
				});
				shortestArticle = validArticles.reduce((prev, current) => {
					return prev.time_to_read < current.time_to_read ? prev : current;
				});
			}

			noTagArticles = list.filter(
				(article) => !article.tags || Object.keys(article.tags).length === 0
			);

			noTimeToReadArticles = list.filter((article) => article.time_to_read == null);
		}
	});

	const toggleNoTagArticles = () => {
		showNoTagArticles = !showNoTagArticles;
	};

	const toggleNoTimeToReadArticles = () => {
		showNoTimeToReadArticles = !showNoTimeToReadArticles;
	};
</script>

<h2>Quick Reference</h2>
<table id="quickreference" class="table-auto">
	<tbody>
		<tr>
			<td>Total Articles</td>
			<td>{list.length}</td>
		</tr>
		{#if oldestArticle}
			<tr>
				<td>Oldest</td>
				<td>
					<a href={oldestArticle.resolved_url}>{oldestArticle.resolved_title}</a>
					<span class="meta">
						saved {calculateWeeksAgo(oldestArticle.time_added)} weeks ago
					</span>
				</td>
			</tr>
		{/if}

		{#if longestArticle}
			<tr>
				<td>Longest</td>
				<td>
					<a href={longestArticle.resolved_url}>{longestArticle.resolved_title}</a>
					<span class="meta">
						{longestArticle.time_to_read} minutes to read
					</span>
				</td>
			</tr>
		{/if}

		{#if shortestArticle}
			<tr>
				<td>Shortest</td>
				<td>
					<a href={shortestArticle.resolved_url}>{shortestArticle.resolved_title}</a>
					<span class="meta">
						{shortestArticle.time_to_read} minutes to read
					</span>
				</td>
			</tr>
		{/if}
	</tbody>
</table>

<div class="flex space-x-2 text-sm mt-2">
	{#if noTagArticles.length > 0}
		<button on:click={toggleNoTagArticles}>
			{noTagArticles.length} Articles Without Tags
			{#if showNoTagArticles}
				&#9660;
			{/if}
		</button>
	{/if}

	{#if noTimeToReadArticles.length > 0}
		<button on:click={toggleNoTimeToReadArticles}>
			{noTimeToReadArticles.length} Articles Without Time to Read
			{#if showNoTimeToReadArticles}
				&#9660;
			{/if}
		</button>
	{/if}
</div>

{#if showNoTagArticles}
	<h3 class="mt-4">Articles Without Tags:</h3>
	<ul class="list-disc pl-5">
		{#each noTagArticles as article}
			<li>
				<a href={article.resolved_url}>{article.resolved_title}</a>
			</li>
		{/each}
	</ul>
{/if}

{#if showNoTimeToReadArticles}
	<h3 class="mt-4">Articles Without Time to Read:</h3>
	<ul class="list-disc pl-5">
		{#each noTimeToReadArticles as article}
			<li>
				<a href={article.resolved_url}>{article.resolved_title}</a>
			</li>
		{/each}
	</ul>
{/if}

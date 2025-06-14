<script>
	import { onMount } from 'svelte';
	import { calculateWeeksAgo } from '../utils';
	import ReadingListItem from './ReadingListItem.svelte';

	export let list;

	let suggestedArticle, suggestionLogic;
	let oldestArticle;
	let furthestArticle;
	// let longestArticle, shortestArticle;
	// let noTagArticles = [];
	// let noTimeToReadArticles = [];
	// let showNoTagArticles = false;
	// let showNoTimeToReadArticles = false;
	// let totalMinutes = 0;
	// let averageMinutes = 0;

	if (list.count > 0) {
		oldestArticle = list.reduce((prev, current) => {
			return prev.time < current.time ? prev : current;
		});

		furthestArticle = list.reduce((prev, current) => {
			if (current.progress != null && current.progress !== 0) {
				return prev === null || prev.progress > current.progress ? prev : current;
			}
			return prev;
		}, null);

		// 	totalMinutes = list.reduce((sum, article) => sum + (article.time_to_read || 0), 0);
		// 	averageMinutes = Math.floor(totalMinutes / list.count);
		// 	const validArticles = list.filter((article) => article.time_to_read != null);
		// 	if (validArticles.length > 0) {
		// 		longestArticle = validArticles.reduce((prev, current) => {
		// 			return prev.time_to_read > current.time_to_read ? prev : current;
		// 		});
		// 		shortestArticle = validArticles.reduce((prev, current) => {
		// 			return prev.time_to_read < current.time_to_read ? prev : current;
		// 		});
		// 	}
		// 	noTagArticles = list.filter(
		// 		(article) => !article.tags || Object.keys(article.tags).length === 0
		// 	);
		// 	noTimeToReadArticles = list.filter(
		// 		(article) => article.time_to_read == null || article.time_to_read < 1
		// 	);
		// 	if (noTagArticles.length > 0) {
		// 		suggestionLogic = 'because article has no tag';
		// 		suggestedArticle = noTagArticles.reduce((prev, current) => {
		// 			return prev.time < current.time ? prev : current;
		// 		});
		// 	} else if (noTimeToReadArticles.length > 0) {
		// 		suggestionLogic = 'because article has no estimated time to read';
		// 		suggestedArticle = noTimeToReadArticles.reduce((prev, current) => {
		// 			return prev.time < current.time ? prev : current;
		// 		});
		// 	} else
		if (furthestArticle) {
			suggestionLogic = "because you've already started this one";
			suggestedArticle = furthestArticle;
		} else if (oldestArticle.time * 1000 < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
			suggestionLogic = 'because article was added 30+ days ago';
			suggestedArticle = oldestArticle;
		} else if (list.count > 30) {
			suggestionLogic = 'because reading list is too long';
			suggestedArticle = furthestArticle ? furthestArticle : oldestArticle; // ideally `shortestArticle`
		} else {
			suggestionLogic = 'random';
			suggestedArticle = list[Math.floor(Math.random() * list.count)];
		}
	}

	// const toggleNoTagArticles = () => {
	// 	showNoTagArticles = !showNoTagArticles;
	// };

	// const toggleNoTimeToReadArticles = () => {
	// 	showNoTimeToReadArticles = !showNoTimeToReadArticles;
	// };
</script>

{#if suggestedArticle}
	<h2 class="">
		<dfn title={suggestionLogic}>Suggested</dfn>
	</h2>
	<ReadingListItem item={suggestedArticle} />
{/if}

<h2>Quick Reference</h2>

<table id="quickreference" class="table-auto">
	<tbody>
		<tr>
			<td>Total Articles</td>
			<td>
				{list.count}
				<!-- (~{totalMinutes > 59
					? (totalMinutes / 60).toFixed(1) + ' hours'
					: totalMinutes + ' minutes'}
				to read, ~{averageMinutes} minutes average) -->
			</td>
		</tr>

		{#if oldestArticle}
			<tr>
				<td>Oldest</td>
				<td>
					<a href={oldestArticle.url}>{oldestArticle.title}</a>
					<span class="meta">
						saved {calculateWeeksAgo(oldestArticle.time)} weeks ago
					</span>
				</td>
			</tr>
		{/if}

		<!-- redundant to suggestion section -->
		<!-- {#if furthestArticle}
			<tr>
				<td>Continue...</td>
				<td>
					<a href={furthestArticle.url}>{furthestArticle.title}</a>
					<span class="meta">
						read {Math.round(furthestArticle.progress * 100, 2)}%
					</span>
				</td>
			</tr>
		{/if} -->

		<!-- {#if longestArticle}
			<tr>
				<td>Longest</td>
				<td>
					<a href={longestArticle.resolved_url}>{longestArticle.resolved_title}</a>
					<span class="meta">
						{longestArticle.time_to_read} minutes to read
					</span>
				</td>
			</tr>
		{/if} -->

		<!-- {#if shortestArticle}
			<tr>
				<td>Shortest</td>
				<td>
					<a href={shortestArticle.resolved_url}>{shortestArticle.resolved_title}</a>
					<span class="meta">
						{shortestArticle.time_to_read} minutes to read
					</span>
				</td>
			</tr>
		{/if} -->
	</tbody>
</table>

<div class="flex space-x-2 text-sm mt-2">
	<!-- {#if noTagArticles.length > 0}
		<button on:click={toggleNoTagArticles}>
			{noTagArticles.length} article(s) without tags
			{#if showNoTagArticles}
				&#9660;
			{/if}
		</button>
	{/if} -->

	<!-- {#if noTimeToReadArticles.length > 0}
		<button on:click={toggleNoTimeToReadArticles}>
			{noTimeToReadArticles.length} article(s) without estimated time to read
			{#if showNoTimeToReadArticles}
				&#9660;
			{/if}
		</button>
	{/if} -->
</div>

<!-- {#if showNoTagArticles}
	<ul class="list-disc pl-5">
		{#each noTagArticles as article}
			<li>
				<a href={article.resolved_url}>{article.resolved_title}</a>
			</li>
		{/each}
	</ul>
{/if} -->

<!-- {#if showNoTimeToReadArticles}
	<ul class="list-disc pl-5">
		{#each noTimeToReadArticles as article}
			<li>
				<a href={article.resolved_url}>{article.resolved_title}</a>
			</li>
		{/each}
	</ul>
{/if} -->

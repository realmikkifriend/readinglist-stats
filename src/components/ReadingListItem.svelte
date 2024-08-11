<script>
	export let item;

	function getDomain(url) {
		try {
			const domain = new URL(url).hostname;
			return domain.replace('www.', '');
		} catch (error) {
			console.error('Invalid URL:', error);
			return '';
		}
	}
	console.log(item);
</script>

<li class="my-4 min-h-[6.75rem] line-clamp-3">
	{#if item.top_image_url}
		<img
			src={item.top_image_url}
			alt={item.resolved_title}
			class="rounded float-right w-2/5 max-h-28 object-cover mt-1 ml-1.5"
		/>
	{/if}
	<h4 class="line-clamp-2">
		<a href={item.resolved_url}>
			{item.resolved_title ? item.resolved_title : 'New article'}
		</a>
	</h4>

	<div class="min-h-14">
		<p class="text-sm">
			<span class="meta">
				{getDomain(item.resolved_url)}
				{@html typeof item.time_to_read === 'number' ? `&bull; ${item.time_to_read} minutes` : ''}
				{#if item.tags && Object.keys(item.tags).length > 0}
					&bull; tagged
					{#each Object.values(item.tags) as tag, index}
						'{tag.tag}'{#if index < Object.values(item.tags).length - 1},
						{/if}
					{/each}
				{/if}
			</span>

			{@html item.excerpt ? item.excerpt : '<i>Article excerpt will appear here...</i>'}
		</p>
	</div>
</li>

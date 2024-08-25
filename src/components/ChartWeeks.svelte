<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { calculateWeeksAgo } from '../utils';

	export let list;

	onMount(() => {
		const data = list.map((item) => {
			return {
				count: 1,
				weeks_ago: calculateWeeksAgo(item.time_added)
			};
		});

		const groupedData = Array.from(
			d3.rollup(
				data,
				(v) => d3.sum(v, (d) => d.count),
				(d) => d.weeks_ago
			),
			([weeks_ago, count]) => ({ weeks_ago, count })
		).sort((a, b) => b.weeks_ago - a.weeks_ago);

		const svg = d3.select('#chart-weeks').attr('width', 250).attr('height', 250);
		const margin = { top: 20, right: 8, bottom: 15, left: 50 };
		const width = +svg.attr('width') - margin.right;
		const height = +svg.attr('height') - margin.top - margin.bottom;

		const x = d3
			.scaleBand()
			.domain(groupedData.map((d) => d.weeks_ago))
			.range([margin.left, width - margin.right])
			.padding(0.1);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(groupedData, (d) => d.count)])
			.nice()
			.range([height - margin.bottom, margin.top]);

		const colorScale = d3
			.scaleLinear()
			.domain([
				d3.min(groupedData, (d) => d.weeks_ago),
				(d3.min(groupedData, (d) => d.weeks_ago) + d3.max(groupedData, (d) => d.weeks_ago)) / 2,
				d3.max(groupedData, (d) => d.weeks_ago)
			])
			.range(['#C0CCE6', '#283C67', '#0E1524']);

		svg.selectAll('*').remove();

		svg
			.append('g')
			.selectAll('rect')
			.data(groupedData)
			.enter()
			.append('rect')
			.attr('x', (d) => x(d.weeks_ago))
			.attr('y', (d) => y(d.count))
			.attr('height', (d) => y(0) - y(d.count))
			.attr('width', x.bandwidth())
			.attr('fill', (d) => colorScale(d.weeks_ago));

		svg
			.append('g')
			.attr('transform', `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x));

		const yAxisGroup = svg
			.append('g')
			.attr('transform', `translate(${margin.left},0)`)
			.call(d3.axisLeft(y).ticks(d3.max(data, (d) => d.value)));

		yAxisGroup.selectAll('.tick').each(function (d) {
			if (!Number.isInteger(d)) {
				d3.select(this).remove();
			} else {
				d3.select(this).select('text').text(Math.round(d));
			}
		});

		svg
			.append('text')
			.attr('x', -height / 2)
			.attr('y', margin.left / 2.5)
			.attr('text-anchor', 'middle')
			.attr('class', 'sidelabel')
			.text('Number of Articles');
	});
</script>

<svg class="chart" id="chart-weeks" />

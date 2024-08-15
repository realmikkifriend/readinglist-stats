<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let list;

	onMount(() => {
		const filteredList = list.filter((d) => d.time_to_read != null);

		const data = Array.from(
			d3.rollup(
				filteredList,
				(v) => v.length,
				(d) => d.time_to_read
			),
			([time_to_read, count]) => ({
				time_to_read,
				count,
				time_added: filteredList.find((item) => item.time_to_read === time_to_read).time_added
			})
		).sort((a, b) => a.time_to_read - b.time_to_read);

		const svg = d3.select('#chart-timetoread').attr('width', 250).attr('height', 250);
		const margin = { top: 20, right: 8, bottom: 15, left: 50 };
		const width = +svg.attr('width') - margin.right;
		const height = +svg.attr('height') - margin.top - margin.bottom;

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.time_to_read))
			.range([margin.left, width - margin.right])
			.padding(0.1);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.count)])
			.nice()
			.range([height - margin.bottom, margin.top]);

		const colorScale = d3
			.scaleLinear()
			.domain([d3.min(data, (d) => d.time_added), d3.max(data, (d) => d.time_added)])
			.range([0, 1]);

		const colors = ['--twc-primary', '#08306B', '--twc-primary'];
		const interpolator = d3.interpolateRgbBasis(colors);

		svg
			.append('g')
			.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('x', (d) => x(d.time_to_read))
			.attr('y', (d) => y(d.count))
			.attr('height', (d) => y(0) - y(d.count))
			.attr('width', x.bandwidth())
			.attr('fill', (d) => interpolator(colorScale(d.time_added)));

		const xAxisGroup = svg
			.append('g')
			.attr('transform', `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x));

		if (data.length >= 15) {
			xAxisGroup.selectAll('text').attr('transform', 'translate(8, 4) rotate(45)');
		}

		const yAxisGroup = svg
			.append('g')
			.attr('transform', `translate(${margin.left},0)`)
			.call(d3.axisLeft(y).ticks(Math.ceil(d3.max(data, (d) => d.count) / 1.5)));

		yAxisGroup.selectAll('.tick text').each(function (d) {
			const roundedValue = Math.round(d);
			d3.select(this).text(roundedValue);
		});

		svg
			.append('text')
			.attr('x', width / 1.75)
			.attr('y', height + margin.bottom * 1.5)
			.attr('text-anchor', 'middle')
			.attr('class', 'bottomlabel')
			.text('By Minutes to Read (Lighter = Recent)');

		svg
			.append('text')
			.attr('x', -height / 2)
			.attr('y', margin.left / 2.5)
			.attr('text-anchor', 'middle')
			.attr('class', 'sidelabel')
			.text('Number of Articles');
	});
</script>

<svg class="chart" id="chart-timetoread" />

<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let list;

	onMount(() => {
		const tagCounts = {};

		list.forEach((item) => {
			const tags = item.tags;
			if (
				typeof tags !== 'object' ||
				tags === null ||
				Array.isArray(tags) ||
				Object.keys(tags).length === 0
			) {
				tagCounts['none'] = (tagCounts['none'] || 0) + 1;
			} else {
				for (const tag in tags) {
					if (tags.hasOwnProperty(tag)) {
						tagCounts[tag] = (tagCounts[tag] || 0) + 1;
					}
				}
			}
		});

		const data = Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }));

		const svg = d3.select('#chart-tags').attr('width', 250).attr('height', 250);
		const width = +svg.attr('width');
		const height = +svg.attr('height');
		const radius = Math.min(width, height) / 2;

		const color = d3.scaleOrdinal(d3.schemeCategory10);

		const arc = d3
			.arc()
			.outerRadius(radius - 10)
			.innerRadius(0);
		const arcHover = d3
			.arc()
			.outerRadius(radius - 5)
			.innerRadius(0);

		const pie = d3.pie().value((d) => d.count);

		svg.selectAll('*').remove();

		const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

		const path = g
			.selectAll('path')
			.data(pie(data))
			.enter()
			.append('path')
			.attr('d', arc)
			.attr('fill', (d) => color(d.data.tag))
			.attr('stroke', 'white')
			.attr('stroke-width', '2px')
			.on('mouseover', function (event, d) {
				d3.select(this).transition().duration(200).attr('d', arcHover);
			})
			.on('mouseout', function (event, d) {
				d3.select(this).transition().duration(200).attr('d', arc);
			});

		g.selectAll('text')
			.data(pie(data))
			.enter()
			.append('text')
			.attr('transform', (d) => {
				let [x, y] = arc.centroid(d);
				const angle = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;

				const maxCount = Math.max(...data.map((item) => item.count));
				const minOffset = 4;
				const maxOffset = 25;

				const offset = minOffset + (1 - d.data.count / maxCount) * (maxOffset - minOffset);

				const xOffset = Math.cos(angle) * offset;
				const yOffset = Math.sin(angle) * offset;

				const yTranslation = y + yOffset + 6;

				let rotate = angle * (180 / Math.PI);
				if (rotate > 90 || rotate < -90) {
					rotate += 180;
				}

				return `translate(${x + xOffset}, ${yTranslation}) rotate(${rotate})`;
			})
			.attr('text-anchor', 'middle')
			.attr('class', 'pie-text')
			.text((d) => `${d.data.tag} (${d.data.count})`);
	});
</script>

<svg class="chart" id="chart-tags" />

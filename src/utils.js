import { DateTime } from 'luxon';

export function getFilteredList(list) {
	if (list && Object.keys(list.list).length > 0) {
		const items = Object.values(list.list)
			.filter((item) => item.status === '0')
			.map(
				({
					authors,
					domain_metadata,
					favorite,
					given_url,
					given_title,
					has_image,
					has_video,
					image,
					images,
					is_index,
					is_article,
					lang,
					listen_duration_estimate,
					resolved_id,
					sort_id,
					time_favorited,
					time_read,
					time_updated,
					word_count,
					...rest
				}) => ({
					...rest
				})
			)
			.sort((a, b) => b.time_added - a.time_added);

		return items;
	}
	return [];
}

export function calculateWeeksAgo(timeAdded) {
	const now = DateTime.now().startOf('week');
	const pastDate = DateTime.fromSeconds(parseInt(timeAdded, 10)).startOf('week');
	const weeksAgo = now.diff(pastDate, 'weeks').weeks;
	return Math.floor(weeksAgo);
}

export function getWeeksAgo(timeAdded) {
	const weeksAgo = calculateWeeksAgo(timeAdded);
	if (weeksAgo === 0) {
		return 'this week';
	} else if (weeksAgo === 1) {
		return 'last week';
	} else {
		return `${weeksAgo} weeks ago`;
	}
}

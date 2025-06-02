import { get } from 'svelte/store';
import { userTokenStore, readingList } from '../stores';
import { Instapaper } from 'instapaper-ts';

const consumerKey = import.meta.env.VITE_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_CONSUMER_SECRET;

const instapaper = new Instapaper({
	consumerKey,
	consumerSecret
});

const storedToken = get(userTokenStore);

if (storedToken === 'string') {
	instapaper.withToken(storedToken);
} else {
	instapaper.setCredentials('username', 'password');

	instapaper.fetchToken().then((newToken) => {
		userTokenStore.set(newToken);

		instapaper.withToken(newToken);
	});
}

let bookmarks;

try {
	bookmarks = await instapaper.bookmarks.list({ limit: 50 });
	bookmarks.count = bookmarks.filter((item) => item.type === 'bookmark').length;
	readingList.set(bookmarks);
} catch (error) {
	console.error('Error fetching bookmarks:', error);
	readingList.set([]);
}

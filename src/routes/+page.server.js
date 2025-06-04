import { get } from 'svelte/store';
import { userTokenStore, readingList } from '../stores';
import { Instapaper } from 'instapaper-ts';

const consumerKey = import.meta.env.VITE_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_CONSUMER_SECRET;

const instapaper = new Instapaper({
	consumerKey,
	consumerSecret
});

export const actions = {
	login: async ({ request }) => {
		userTokenStore.set(null);
		readingList.set(null);

		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		const result = await loginToInstapaper(username, password);
		return result;
	}
};

async function loginToInstapaper(username, password) {
	const storedToken = get(userTokenStore);

	if (typeof storedToken?.key === 'string') {
		instapaper.withToken(storedToken);
		await getBookmarks();
		return { success: true };
	} else {
		if (typeof username === 'string' && username.trim() !== '') {
			let response;
			instapaper.setCredentials(username, password);
			await instapaper
				.fetchToken()
				.then((token) => {
					userTokenStore.set(token);
					response = { success: true };
				})
				.catch((error) => {
					response = { success: false, message: error.message };
				});
			return response;
		} else {
			userTokenStore.set(null);
			readingList.set(null);
			return { success: false, message: 'user not logged in' };
		}
	}
}

await loginToInstapaper();

async function getBookmarks() {
	let bookmarks;
	try {
		bookmarks = await instapaper.bookmarks.list({ limit: 500 });
		bookmarks.count = bookmarks.filter((item) => item.type === 'bookmark').length;
		readingList.set(bookmarks);
	} catch (error) {
		console.error('Error fetching bookmarks:', error);
		readingList.set();
	}
}

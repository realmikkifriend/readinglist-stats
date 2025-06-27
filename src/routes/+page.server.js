import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { userTokenStore, readingList } from '../stores';
import { Instapaper } from 'instapaper-ts';

const consumerKey = import.meta.env.VITE_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_CONSUMER_SECRET;
// resetStores();

const instapaper = new Instapaper({
	consumerKey,
	consumerSecret
});

export const actions = {
	login: async ({ request, url }) => {
		resetStores();

		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		const result = await loginToInstapaper(username, password);
		redirect(303, url.origin);
		// return result;
	},

	logout: async ({ url }) => {
		resetStores();
		redirect(303, url.origin);
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
					readingList.set({ loggedIn: true });
					response = { success: true };
				})
				.catch((error) => {
					resetStores();
					response = { success: false, message: error.message };
				});
			await getBookmarks();
			return response;
		} else {
			resetStores();
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
		readingList.set(null);
	}
}

function resetStores() {
	userTokenStore.set(null);
	readingList.set(null);
}

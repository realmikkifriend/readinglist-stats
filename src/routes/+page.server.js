import { get } from 'svelte/store';
import { Pocket } from 'node-pocket-api';
import { requestTokenStore, accessTokenStore } from '../stores';

export async function load({ fetch }) {
	const consumerKey = import.meta.env.VITE_CONSUMER_KEY;
	const redirectUri = import.meta.env.VITE_REDIRECT_URI;

	const pocket = new Pocket({
		consumerKey,
		redirectUri
	});

	let requestToken = get(requestTokenStore);
	// requestTokenStore.set(null);

	if (!requestToken || typeof requestToken !== 'string') {
		requestToken = await pocket.getRequestToken();

		if (typeof requestToken === 'string') {
			requestTokenStore.set(requestToken);
		}
	}

	pocket.setRequestToken(requestToken);
	const authUri = await pocket.getAuthorizeUrl();

	let accessToken = get(accessTokenStore);

	if (!accessToken || typeof accessToken !== 'string') {
		const data = {
			consumer_key: consumerKey,
			code: requestToken
		};

		accessToken = await pocket.getAccessToken(data);

		if (typeof accessToken === 'string' && accessToken.length > 0) {
			accessTokenStore.set(accessToken);
		} else {
			accessToken = '';
		}
	}

	const data = {
		consumer_key: consumerKey,
		access_token: accessToken,
		detailType: 'complete',
		state: 'unread',
		sort: 'oldest',
		count: 1000
	};

	let response = null;

	if (typeof accessToken === 'string' && accessToken.length > 0) {
		response = await pocket.retrieveItems(data);
	}

	return {
		requestToken,
		accessToken,
		authUri,
		response
	};
}

import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

export const requestTokenStore = persisted('request', writable(null));
export const accessTokenStore = persisted('access', writable(null));

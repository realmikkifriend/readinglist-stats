import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

export const userTokenStore = persisted('token', writable(null));
export const readingList = persisted('list', writable(null));

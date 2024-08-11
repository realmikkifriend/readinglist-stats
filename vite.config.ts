import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { config } from 'dotenv';
config();

export default defineConfig({
	plugins: [sveltekit()]
});

const { createThemes } = require('tw-colors');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'selector',

	plugins: [
		createThemes(
			{
				dark: {
					primary: '#1f2937',
					secondary: '#4b5563',
					accent: '#9ca3af',
					font: {
						primary: '#1f2937'
					},
					link: '#3b82f6'
				}
			},
			{
				defaultTheme: 'dark'
			}
		),
		require('@tailwindcss/typography')
	]
};

export default config;

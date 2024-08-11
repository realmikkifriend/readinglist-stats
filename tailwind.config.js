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
				},
				extreme: {
					primary: 'purple',
					secondary: 'red',
					accent: 'cyan',
					font: {
						primary: 'orange'
					},
					link: 'yellow'
				},
				forest: {
					primary: '#00331F',
					secondary: '#E9C46A',
					accent: 'red',
					font: {
						primary: 'white'
					},
					link: '#00834e'
				},
				winter: {
					primary: 'slateblue',
					secondary: 'lightblue',
					accent: 'blue',
					font: {
						primary: 'white'
					},
					link: 'skyblue'
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

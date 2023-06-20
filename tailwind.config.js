/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				textColor: '#2B2B2B',
				hoverColor: '#969696',
			},
		},
	},
	plugins: [],
};

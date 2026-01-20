/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "var(--bg-color)",
                foreground: "var(--text-primary)",

                // Apple-inspired Palette
                'apple-blue': '#007AFF',
                'apple-green': '#34C759',
                'apple-orange': '#FF9500',
                'apple-red': '#FF3B30',
                'apple-purple': '#AF52DE',
                'apple-pink': '#FF2D55',

                // Grays (Apple System Grays)
                'apple-gray': {
                    50: '#F5F5F7',
                    100: '#E5E5EA',
                    200: '#D1D1D6',
                    300: '#C7C7CC',
                    400: '#AEAEB2',
                    500: '#8E8E93',
                    600: '#636366',
                    700: '#48484A',
                    800: '#3A3A3C',
                    900: '#1D1D1F',
                },

                // Semantic Colors
                'stage-inicijatywa': '#8E8E93',
                'stage-sejm': '#007AFF',
                'stage-senat': '#AF52DE',
                'stage-prezydent': '#FF9500',
                'stage-publikacja': '#34C759',
            },

            borderRadius: {
                'card': '16px',
                'button': '12px',
                'input': '10px',
            },

            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },

            boxShadow: {
                'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
                'apple-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },

            fontFamily: {
                'sans': ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

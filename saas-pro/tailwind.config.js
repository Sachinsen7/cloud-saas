const { colors } = require('./app/colors.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                "light": {
                    "primary": colors.primary.light,
                    "primary-content": "#ffffff",
                    "secondary": colors.secondary.light,
                    "secondary-content": "#ffffff",
                    "accent": colors.accent.light,
                    "accent-content": "#ffffff",
                    "neutral": "#374151",
                    "neutral-content": "#ffffff",
                    "base-100": colors.base.light[100],
                    "base-200": colors.base.light[200],
                    "base-300": colors.base.light[300],
                    "base-content": colors.base.light.content,
                    "info": colors.info.light,
                    "info-content": "#ffffff",
                    "success": colors.success.light,
                    "success-content": "#ffffff",
                    "warning": colors.warning.light,
                    "warning-content": "#ffffff",
                    "error": colors.error.light,
                    "error-content": "#ffffff",
                },
                "dark": {
                    "primary": colors.primary.dark,
                    "primary-content": "#ffffff",
                    "secondary": colors.secondary.dark,
                    "secondary-content": "#1e293b",
                    "accent": colors.accent.dark,
                    "accent-content": "#1e293b",
                    "neutral": "#6b7280",
                    "neutral-content": "#f9fafb",
                    "base-100": colors.base.dark[100],
                    "base-200": colors.base.dark[200],
                    "base-300": colors.base.dark[300],
                    "base-content": colors.base.dark.content,
                    "info": colors.info.dark,
                    "info-content": "#1e293b",
                    "success": colors.success.dark,
                    "success-content": "#1e293b",
                    "warning": colors.warning.dark,
                    "warning-content": "#1e293b",
                    "error": colors.error.dark,
                    "error-content": "#1e293b",
                }
            }
        ],
        darkTheme: "dark",
        base: true,
        styled: true,
        utils: true,
    },
}
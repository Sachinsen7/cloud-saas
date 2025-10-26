
const colors = {
    // Primary Colors
    primary: {
        light: '#3448C5',      // Light theme primary color
        dark: '#5B6FD8',       // Dark theme primary color (slightly lighter for better contrast)
    },

    // You can also customize other colors here
    secondary: {
        light: '#f59e0b',      // Amber
        dark: '#fbbf24',       // Lighter amber for dark mode
    },

    accent: {
        light: '#10b981',      // Emerald
        dark: '#34d399',       // Lighter emerald for dark mode
    },

    // Base colors (backgrounds)
    base: {
        light: {
            100: '#ffffff',      // Main background
            200: '#f3f4f6',      // Secondary background
            300: '#e5e7eb',      // Tertiary background
            content: '#1f2937',  // Text color
        },
        dark: {
            100: '#1f2937',      // Dark main background
            200: '#374151',      // Dark secondary background
            300: '#4b5563',      // Dark tertiary background
            content: '#f9fafb',  // Light text color
        }
    },

    // Status colors
    info: {
        light: '#3b82f6',
        dark: '#60a5fa',
    },

    success: {
        light: '#10b981',
        dark: '#34d399',
    },

    warning: {
        light: '#f59e0b',
        dark: '#fbbf24',
    },

    error: {
        light: '#ef4444',
        dark: '#f87171',
    }
};

function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

const hslColors = {
    primary: {
        light: hexToHsl(colors.primary.light),
        dark: hexToHsl(colors.primary.dark),
    }
};

module.exports = {
    colors,
    hslColors,
    hexToHsl
};
export const colors = {
    // Green Palette - Primary Brand Colors
    green: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
        950: '#022c22',
    },

    // Rich Dark Backgrounds
    richBlack: '#020403',
    deepGreen: '#011c15',

    // Semantic Color Tokens
    primary: '#10b981', // green-500
    primaryForeground: '#ffffff',
    primaryHover: '#059669', // green-600

    secondary: '#064e3b', // green-900
    secondaryForeground: '#d1fae5', // green-100

    accent: '#10b981', // green-500
    accentForeground: '#ffffff',

    // Backgrounds
    background: '#020403', // richBlack
    foreground: '#ecfdf5', // green-50

    // Card & Surface Colors
    card: '#022c22', // Using solid green-950 for better readability without blur
    // card: 'rgba(2, 44, 34, 0.4)', // Web version (requires blur)
    cardForeground: '#e2e8f0',

    // Muted/Subtle Elements
    muted: 'rgba(255, 255, 255, 0.05)',
    mutedForeground: '#94a3b8',

    // Borders & Inputs
    border: 'rgba(52, 211, 153, 0.2)', // green-400 with opacity
    input: 'rgba(255, 255, 255, 0.1)',
    ring: '#10b981', // green-500

    // State Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#34d399',
};

// Background gradients (approximation for RN using LinearGradient if available, or just colors)
// For now we will just use these as reference.

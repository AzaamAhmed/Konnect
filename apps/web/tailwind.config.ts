import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Premium brown/black theme
                primary: {
                    50: '#F5F5DC',
                    100: '#DEB887',
                    200: '#D2691E',
                    300: '#CD853F',
                    400: '#A0522D',
                    500: '#8B4513', // Main brand color
                    600: '#704214',
                    700: '#5A3510',
                    800: '#45280C',
                    900: '#2F1C08',
                },
                dark: {
                    50: '#F5F5F5',
                    100: '#E0E0E0',
                    200: '#BDBDBD',
                    300: '#9E9E9E',
                    400: '#757575',
                    500: '#616161',
                    600: '#424242',
                    700: '#2D2D2D',
                    800: '#1A1A1A',
                    900: '#0A0A0A',
                },
                accent: {
                    warm: '#DEB887',
                    gold: '#D4AF37',
                    cream: '#F5F5DC',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-warm': 'linear-gradient(135deg, #8B4513 0%, #2D2D2D 100%)',
                'gradient-dark': 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(139, 69, 19, 0.1)',
                'glass-lg': '0 12px 48px 0 rgba(139, 69, 19, 0.15)',
                'warm': '0 4px 20px rgba(139, 69, 19, 0.2)',
            },
        },
    },
    plugins: [],
}

export default config

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
    theme: {
        extend: {
            keyframes: {
                aurora: {
                '0%, 100%': { 'box-shadow': '0 0 10px #f0f, 0 0 20px #0ff, 0 0 30px #0f0' },
                '25%': { 'box-shadow': '0 0 20px #0ff, 0 0 30px #0f0, 0 0 40px #f0f' },
                '50%': { 'box-shadow': '0 0 30px #0f0, 0 0 40px #f0f, 0 0 50px #0ff' },
                '75%': { 'box-shadow': '0 0 40px #f0f, 0 0 50px #0ff, 0 0 60px #0f0' },
                }
            },
            animation: {
                aurora: 'aurora 4s ease-in-out infinite',
            },
            colors: {
                primary: 'var(--primary)',
                foreground: 'var(--foreground)',
                background: 'var(--background)',
                card: 'var(--card)',
                cardForeground: 'var(--card-foreground)',
                popover: 'var(--popover)',
                popoverForeground: 'var(--popover-foreground)',
                secondary: 'var(--secondary)',
                secondaryForeground: 'var(--secondary-foreground)',
                muted: 'var(--muted)',
                mutedForeground: 'var(--muted-foreground)',
                accent: 'var(--accent)',
                accentForeground: 'var(--accent-foreground)',
                destructive: 'var(--destructive)',
                destructiveForeground: 'var(--destructive-foreground)',
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
            
                chart1: 'var(--chart-1)',
                chart2: 'var(--chart-2)',
                chart3: 'var(--chart-3)',
                chart4: 'var(--chart-4)',
                chart5: 'var(--chart-5)',

                sidebar: 'var(--sidebar)',
                sidebarForeground: 'var(--sidebar-foreground)',
                sidebarPrimary: 'var(--sidebar-primary)',
                sidebarPrimaryForeground: 'var(--sidebar-primary-foreground)',
                sidebarAccent: 'var(--sidebar-accent)',
                sidebarAccentForeground: 'var(--sidebar-accent-foreground)',
                sidebarBorder: 'var(--sidebar-border)',
                sidebarRing: 'var(--sidebar-ring)'
            },
        },
    },
    plugins: [],
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}"
    ],
}

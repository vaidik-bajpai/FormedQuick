/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
    theme: {
        extend: {
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

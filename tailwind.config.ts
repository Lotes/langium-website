import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  // Scan all Next.js source files for class names
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './theme.config.tsx',
  ],
  darkMode: 'class',          // Same as old site — toggle 'dark' class on <html>
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.neutral,    // Exact same as old site (neutral = gray)
    },
    extend: {
      fontFamily: {
        mono: ['Menlo', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas',
               'Liberation Mono', 'Courier New', 'monospace'],
        body: ['"Roboto Condensed"', 'sans-serif'],
      },
      spacing: {
        '192': '48rem',
        '120': '30rem',
        'teaser': 'calc(100vh - 96px)',
        'underline': '0.1px',
        '3/2': '150%',
      },
      minWidth: {
        featureItem: '420px',
      },
      colors: {
        emeraldLangium:           '#26888C',
        emeraldLangiumABitDarker: '#207578',
        emeraldLangiumDarker:     '#0A4340',
        emeraldLangiumDarkest:    '#042424',
        accentBlue:               '#1FCDEB',
        accentRed:                '#8c2626',
        accentGreen:              '#B6F059',
        accentViolet:             '#D568E7',
        accentLightBlue:          '#BCDBEF',
      },
      backgroundImage: {
        // IMPORTANT: CSS background-image URLs are NOT automatically prefixed by
        // Next.js basePath — unlike <Image> and <Link>.  Always interpolate
        // NEXT_PUBLIC_BASE_PATH here so the URL is correct on sub-path deployments
        // (e.g. /langium-website/... or /langium-website/pr-preview/pr-N/...).
        office: `url('${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/assets/office.jpg')`,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),   // For MDX prose content in docs
  ],
}

export default config

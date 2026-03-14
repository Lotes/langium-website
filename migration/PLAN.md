# Migration Plan: Hugo → Nextra

> **Source:** `old-website/` (Hugo + hugo-geekdoc + TailwindCSS)  
> **Target:** Nextra 3.x (Next.js App Router) + TailwindCSS  
> **Reference:** `migration/OLD-WEBSITE.md` for old-site details  
> **Default branch:** `lotes/nextra`

---

## Table of Contents

1. [Overview & Guiding Principles](#1-overview--guiding-principles)
2. [Technology Choices](#2-technology-choices)
3. [Project Initialization](#3-project-initialization)
4. [Project Structure](#4-project-structure)
5. [TailwindCSS Configuration](#5-tailwindcss-configuration)
6. [Global Layout & Components](#6-global-layout--components)
7. [Front Page](#7-front-page)
8. [Documentation Section (`/docs`)](#8-documentation-section-docs)
9. [Playground Section (`/playground`)](#9-playground-section-playground)
10. [Showcase Section (`/showcase`)](#10-showcase-section-showcase)
11. [API Section (`/api`)](#11-api-section-api)
12. [Static Assets](#12-static-assets)
13. [Core Package (Monaco Wrapper)](#13-core-package-monaco-wrapper)
14. [URL Redirects & Aliases](#14-url-redirects--aliases)
15. [CI/CD Workflows](#15-cicd-workflows)
16. [Migration Checklist](#16-migration-checklist)

---

## 1. Overview & Guiding Principles

The old Langium website is built with **Hugo** (Go-based static site generator) and the
**hugo-geekdoc** theme. The new website must use **Nextra 3.x** (a Next.js-based documentation
framework) while preserving visual identity and all existing URLs.

### Key Constraints

| Constraint | Detail |
|---|---|
| Visual parity | Same look and feel; same Tailwind brand colors, fonts, dark mode |
| URL preservation | All old Hugo URLs must remain accessible (redirects where needed) |
| Section isolation | `docs/`, `api/`, `playground/`, `showcase/` as separate Next.js route folders |
| Showcase isolation | Each showcase is a self-contained sub-folder under `showcase/` |
| Shared showcase layout | `showcase/layout.tsx` used by all showcase sub-pages |
| Deployment | Static export to GitHub Pages from branch `lotes/nextra` |
| PR Previews | Preview deployment for every PR targeting `lotes/nextra` |

### What Changes vs. What Stays

| Old (Hugo) | New (Nextra) | Notes |
|---|---|---|
| `hugo/content/**/*.md` | `app/docs/**/*.mdx` | Front-matter → Nextra metadata |
| `layouts/partials/langium-*.html` | `components/*.tsx` | React components |
| `layouts/langium/baseof.html` | `app/layout.tsx` | Root layout |
| `layouts/playground/baseof.html` | `app/playground/layout.tsx` | Full-screen layout |
| `layouts/langium/showcase-page.html` | `app/showcase/[name]/page.tsx` | Self-contained pages |
| `tailwind/tailwind.config.js` | `tailwind.config.ts` | Same config, updated paths |
| `hugo-geekdoc` sidebar | `nextra-theme-docs` sidebar | `_meta.ts` files for ordering |
| Hugo `{{< mermaid >}}` shortcode | `<Mermaid>` MDX component | React-based rendering |
| Hugo `{{< notification >}}` shortcode | `<Notification>` MDX component | Custom React component |
| `static/` folder | `public/` folder | Direct copy, same paths |
| GSAP (CDN) | `gsap` npm package | Home page animations |
| Alpine.js (CDN) | React state / `useState` | Mobile menu |
| `.github/workflows/deploy.yml` | new `deploy.yml` | Next.js static export |
| `.github/workflows/preview.yml` | new `preview.yml` | Same PR preview strategy |

---

## 2. Technology Choices

| Package | Version | Role |
|---|---|---|
| `next` | `^15` | Next.js framework |
| `nextra` | `^3` | Documentation framework (Nextra 3.x, App Router) |
| `nextra-theme-docs` | `^3` | Docs sidebar theme |
| `react` | `^19` | React runtime |
| `react-dom` | `^19` | React DOM |
| `tailwindcss` | `^3` | CSS utility framework |
| `postcss` | `^8` | CSS processing |
| `autoprefixer` | `^10` | Vendor prefixes |
| `@tailwindcss/typography` | `^0.5` | Prose styles for MDX content |
| `gsap` | `^3.12` | GSAP animations (home page) |
| `mermaid` | `^11` | Mermaid diagram renderer |
| `monaco-editor-wrapper` | `~3.3` | Monaco editor wrapper (carried over) |
| `@typefox/monaco-editor-react` | `^2` | Monaco React component |
| `monaco-languageclient` | `~6.6` | Monaco language client |
| `vite` | `^5` | Bundler for language-server workers |
| `typescript` | `^5` | TypeScript compiler |

> **Note:** Nextra 3.x uses Next.js App Router. The docs theme is configured via
> `app/docs/layout.tsx` and sidebar structure is defined with `_meta.ts` files.

---

## 3. Project Initialization

The Nextra project will live at the **repository root** (replacing the old `old-website/`
root workspace). The `old-website/` directory is kept as-is for reference during migration.

### 3.1 Bootstrap Commands

```bash
# 1. Initialize the root package.json for the Nextra project
npm init -y

# 2. Install Next.js + Nextra + React
npm install next nextra nextra-theme-docs react react-dom

# 3. Install TailwindCSS + typography plugin
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npx tailwindcss init -p

# 4. Install TypeScript support
npm install -D typescript @types/node @types/react @types/react-dom

# 5. Install animation / diagram libraries
npm install gsap mermaid

# 6. Install Monaco / language client (workspace: core/)
# (see §13 — Core Package stays as separate workspace)
npm install --workspace core monaco-editor-wrapper @typefox/monaco-editor-react monaco-languageclient

# 7. Install Vite for worker bundling (workspace: core/ or root)
npm install -D vite @vitejs/plugin-react esbuild
```

### 3.2 `package.json` Root Scripts

```json
{
  "name": "langium-website-project",
  "private": true,
  "workspaces": ["core"],
  "scripts": {
    "dev":   "next dev",
    "build": "npm run build --workspace core && next build",
    "start": "next start",
    "lint":  "next lint",
    "build:workers": "npm run build --workspace core"
  }
}
```

> The `tailwind` workspace from the old project is **eliminated** — TailwindCSS is now
> configured directly in the root `tailwind.config.ts` and processed by PostCSS inside
> Next.js (no separate build step needed).

### 3.3 `next.config.mjs`

```js
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
})

export default withNextra({
  output: 'export',          // Static HTML export for GitHub Pages
  trailingSlash: true,       // Matches old Hugo URL style
  images: { unoptimized: true }, // Required for static export
  async redirects() {
    return [
      // All Hugo alias redirects — see §14
    ]
  },
})
```

> `output: 'export'` generates the site into the `out/` directory. The GitHub Actions
> workflow uploads `out/` to GitHub Pages.

### 3.4 `theme.config.tsx`

Nextra 3.x docs theme is configured via `theme.config.tsx` at the project root:

```tsx
import type { DocsThemeConfig } from 'nextra-theme-docs'
import Header from './components/Header'
import Footer from './components/Footer'

const config: DocsThemeConfig = {
  logo: <img src="/assets/langium_logo_w_nib.svg" alt="Langium" className="h-12" />,
  project: { link: 'https://github.com/eclipse-langium/langium' },
  docsRepositoryBase: 'https://github.com/eclipse-langium/langium-website/blob/lotes/nextra',
  editLink: { content: 'Edit this page on GitHub' },
  feedback: { content: null },            // Disable Nextra's default feedback widget
  sidebar: { defaultMenuCollapseLevel: 1, autoCollapse: true },
  toc: { backToTop: true },
  darkMode: true,                         // Allow light/dark toggle (or lock to dark below)
  nextThemes: { defaultTheme: 'dark' },   // Default to dark mode (matching old site)
  navbar: { component: Header },          // Use custom header component
  footer: { component: Footer },          // Use custom footer component
  head: (
    <>
      <link rel="icon" type="image/svg+xml" href="/assets/nib.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/32px.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/16px.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300&display=swap"
        rel="stylesheet"
      />
    </>
  ),
}

export default config
```

---

## 4. Project Structure

```
langium-website/                        # Repository root
├── .github/
│   └── workflows/
│       ├── deploy.yml                  # §15.1 — GitHub Pages from lotes/nextra
│       └── preview.yml                 # §15.2 — PR preview deployment
├── migration/
│   ├── OLD-WEBSITE.md                  # Reference doc (existing)
│   ├── LINKS.md                        # All old links (existing)
│   └── PLAN.md                         # This document
├── old-website/                        # Old Hugo site (kept for reference)
├── core/                               # §13 — Monaco wrapper workspace
│   ├── src/
│   │   ├── index.ts
│   │   └── monaco-editor-wrapper-utils.ts
│   ├── vite.bundle.ts
│   └── package.json
├── app/                                # Next.js App Router
│   ├── layout.tsx                      # §6.1 — Root HTML layout
│   ├── globals.css                     # §5.3 — Global CSS + Tailwind directives
│   ├── page.tsx                        # §7   — Front page (/)
│   ├── docs/                           # §8   — Documentation section
│   │   ├── layout.tsx                  # Nextra docs theme layout
│   │   ├── _meta.ts                    # Top-level docs sidebar navigation
│   │   ├── page.mdx                    # /docs → redirect stub to /docs/introduction
│   │   ├── introduction/
│   │   │   ├── _meta.ts
│   │   │   ├── page.mdx                # What is Langium?
│   │   │   ├── features.mdx
│   │   │   ├── playground.mdx          # Redirect stub → /playground
│   │   │   └── showcases.mdx           # Redirect stub → /showcase
│   │   ├── learn/
│   │   │   ├── _meta.ts
│   │   │   ├── page.mdx                # Redirect stub → /docs/learn/workflow
│   │   │   ├── workflow/
│   │   │   │   ├── _meta.ts
│   │   │   │   ├── page.mdx            # Mermaid flowchart
│   │   │   │   ├── install.mdx
│   │   │   │   ├── scaffold.mdx
│   │   │   │   ├── write_grammar.mdx
│   │   │   │   ├── generate_ast.mdx
│   │   │   │   ├── resolve_cross_references.mdx
│   │   │   │   ├── create_validations.mdx
│   │   │   │   └── generate_everything.mdx
│   │   │   └── minilogo/
│   │   │       ├── _meta.ts
│   │   │       ├── page.mdx
│   │   │       ├── writing_a_grammar.mdx
│   │   │       ├── validation.mdx
│   │   │       ├── customizing_cli.mdx
│   │   │       ├── generation.mdx
│   │   │       ├── building_an_extension/
│   │   │       │   ├── page.mdx
│   │   │       │   ├── icon.png
│   │   │       │   ├── installed-extension.jpg
│   │   │       │   ├── minilogo-vsix.jpg
│   │   │       │   ├── minilogo-with-icon.png
│   │   │       │   ├── vsix-install.jpg
│   │   │       │   └── vsix-installed.jpg
│   │   │       ├── langium_and_monaco.mdx
│   │   │       └── generation_in_the_web.mdx
│   │   ├── recipes/
│   │   │   ├── _meta.ts
│   │   │   ├── page.mdx
│   │   │   ├── builtin-library.mdx
│   │   │   ├── code-bundling.mdx
│   │   │   ├── formatting.mdx
│   │   │   ├── multiple-languages.mdx
│   │   │   ├── keywords-as-identifiers/
│   │   │   │   ├── page.mdx
│   │   │   │   ├── fixed-1-grammar.png
│   │   │   │   ├── fixed-2-token.png
│   │   │   │   ├── fixed-3-style-1.png
│   │   │   │   ├── fixed-3-style-2.png
│   │   │   │   └── problem.png
│   │   │   ├── lexing/
│   │   │   │   ├── _meta.ts
│   │   │   │   ├── page.mdx
│   │   │   │   ├── case-insensitive-languages.mdx
│   │   │   │   └── indentation-sensitive-languages.mdx
│   │   │   ├── performance/
│   │   │   │   ├── _meta.ts
│   │   │   │   ├── page.mdx
│   │   │   │   └── caches.mdx
│   │   │   ├── scoping/
│   │   │   │   ├── _meta.ts
│   │   │   │   ├── page.mdx
│   │   │   │   ├── class-member.mdx
│   │   │   │   ├── file-based.mdx
│   │   │   │   └── qualified-name.mdx
│   │   │   └── validation/
│   │   │       ├── _meta.ts
│   │   │       ├── page.mdx
│   │   │       └── dependency-loops.mdx
│   │   └── reference/
│   │       ├── _meta.ts
│   │       ├── page.mdx
│   │       ├── glossary.mdx
│   │       ├── configuration-services.mdx
│   │       ├── document-lifecycle.mdx
│   │       ├── semantic-model.mdx
│   │       └── grammar-language/
│   │           ├── _meta.ts
│   │           ├── page.mdx
│   │           └── infix-operators/
│   │               ├── _meta.ts
│   │               ├── page.mdx
│   │               ├── manual-implementation.mdx
│   │               └── syntactical-implementation.mdx
│   ├── api/
│   │   └── page.tsx                    # §11 — Client redirect to TypeDoc
│   ├── playground/
│   │   ├── layout.tsx                  # §9.1 — Full-screen, no sidebar
│   │   └── page.tsx                    # §9.2 — Monaco playground
│   └── showcase/
│       ├── layout.tsx                  # §10.1 — Shared showcase layout
│       ├── page.tsx                    # §10.2 — Showcase landing page
│       ├── arithmetics/
│       │   └── page.tsx                # §10.3 — Arithmetics DSL
│       ├── domainmodel/
│       │   └── page.tsx                # §10.4 — Domain Model DSL
│       ├── minilogo/
│       │   └── page.tsx                # §10.5 — MiniLogo DSL
│       ├── openapi/
│       │   └── page.tsx                # §10.6 — External link redirect
│       ├── sql/
│       │   └── page.tsx                # §10.7 — SQL DSL
│       └── statemachine/
│           └── page.tsx                # §10.8 — State Machine DSL
├── components/
│   ├── Header.tsx                      # §6.2 — Site header
│   ├── Footer.tsx                      # §6.3 — Site footer
│   ├── MobileMenu.tsx                  # §6.4 — Mobile navigation
│   ├── CommunitySection.tsx            # §7.4 — npm + GitHub icons
│   ├── Notification.tsx                # §8.3 — Warning box MDX component
│   ├── MermaidDiagram.tsx              # §8.4 — Mermaid diagrams
│   └── showcase/
│       ├── MonacoShowcaseEditor.tsx    # §10.9 — Base Monaco editor component
│       └── ShowcaseCard.tsx            # §10.2 — Showcase landing card
├── public/                             # §12 — Static assets (direct copy)
│   ├── assets/                         # All SVGs, PNGs from hugo/static/assets/
│   ├── favicon/                        # 16px.png, 32px.png
│   ├── prism/                          # prism.js, prism.css, langium-prism.js
│   └── showcase/
│       └── libs/
│           └── worker/                 # Pre-built language server workers
│               ├── statemachineServerWorker.js
│               ├── arithmeticsServerWorker.js
│               ├── domainmodelServerWorker.js
│               ├── minilogoServerWorker.js
│               └── sqlServerWorker.js
├── tailwind.config.ts                  # §5 — TailwindCSS config
├── postcss.config.js                   # PostCSS config
├── tsconfig.json                       # TypeScript config
├── next.config.mjs                     # §3.3 — Next.js + Nextra config
├── theme.config.tsx                    # §3.4 — Nextra docs theme
└── package.json                        # §3.2 — Root package scripts
```

---

## 5. TailwindCSS Configuration

The TailwindCSS configuration must be an **exact match** to the old `tailwind/tailwind.config.js`,
updated for the new folder structure and extended with Nextra compatibility.

### 5.1 `tailwind.config.ts`

```ts
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
        // CSS background-image URLs are NOT prefixed by Next.js basePath automatically.
        // Must interpolate NEXT_PUBLIC_BASE_PATH here.
        office: `url('${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/assets/office.jpg')`,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),   // For MDX prose content in docs
  ],
}

export default config
```

> **Difference from old config:** `@tailwindcss/line-clamp` is no longer needed (it was
> merged into Tailwind core in v3.3). Added `@tailwindcss/typography` for MDX prose styling.
> The `office` background image URL is updated from `../assets/` to `/assets/` (Next.js
> serves from `public/`).
>
> **⚠️ Base path — CSS background images (applies to all future phases):**
> Next.js automatically prepends `basePath` to paths used in `<Image>` and `<Link>`
> components, but it does **not** rewrite plain CSS `background-image: url(...)` values.
> Any CSS background image that references a `public/` asset must interpolate
> `process.env.NEXT_PUBLIC_BASE_PATH` so the URL is correct on sub-path deployments
> (`/langium-website/` for the default branch, `/langium-website/pr-preview/pr-N/` for
> previews). Failure to do so causes a 404 on every GitHub Pages deployment.

### 5.2 `postcss.config.js`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 5.3 `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Carry over all rules from old-website/hugo/static/custom.css ── */

/* Nav link styles used in Header */
@layer components {
  .nav-link-desktop {
    @apply text-gray-900 dark:text-gray-100 hover:text-emeraldLangium
           dark:hover:text-emeraldLangium transition-colors duration-150;
  }

  /* About/compare item cards */
  .about-item-container { @apply flex flex-col items-center; }
  .about-item          { @apply flex flex-col items-center text-center max-w-sm; }
  .about-item-icon-container { @apply flex items-center justify-center h-40 mb-4; }
  .about-item-title    { @apply mt-4 text-lg font-medium dark:text-gray-100; }
  .item-text           { @apply mt-2 dark:text-gray-100 font-body; }

  /* Feature carousel */
  .feature-item-container { @apply min-w-featureItem px-6 py-4; }
  .feature-item-content   { @apply dark:bg-emeraldLangiumDarker rounded-xl p-6; }
  .feature-direction      { @apply bg-emeraldLangiumDarker; }

  /* Compare (vs Xtext) items */
  .compare-item-container { @apply dark:bg-emeraldLangiumDarker rounded-xl p-6 overflow-hidden; }
  .compare-item           { @apply flow-root; }

  /* External link style */
  .external-link {
    @apply text-emeraldLangium hover:text-emeraldLangiumABitDarker underline;
  }

  /* Footer */
  #website-footer a { @apply hover:underline; }
}
```

---

## 6. Global Layout & Components

### 6.1 `app/layout.tsx` — Root HTML Layout

The root layout wraps every page. It:
- Sets `lang="en"` and `class="dark"` on `<html>` (matching old `baseof.html`)
- Loads Google Fonts (Roboto Condensed 300)
- Loads `globals.css`
- Renders `<Header>`, `<main>{children}</main>`, and `<Footer>`

```tsx
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Langium', template: '%s | Langium' },
  description: 'Langium is an open source language engineering tool...',
  icons: {
    icon: [
      { url: '/assets/nib.svg', type: 'image/svg+xml' },
      { url: '/favicon/32px.png', sizes: '32x32' },
      { url: '/favicon/16px.png', sizes: '16x16' },
    ],
    apple: '/assets/nib.svg',
  },
  openGraph: {
    siteName: 'Langium',
    images: ['https://langium.org/assets/social-card.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white dark:bg-gray-900 font-mono">
        <div className="wrapper relative bg-white dark:bg-gray-900">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

> **Note:** The `docs/`, `playground/`, and `showcase/` sub-layouts will override the
> `<main>` wrapper behavior (e.g., playground and showcases omit it for full-screen views).

### 6.2 `components/Header.tsx`

Replaces `layouts/partials/langium-header.html` and `langium-nav.html`.

- **Logo:** `<img src="/assets/langium_logo_w_nib.svg" />` — links to `/#`
- **Desktop nav:** Links: Documentation, Showcase, Playground, API (external), Support (external, emerald color), GitHub icon
- **Mobile:** hamburger button; opens `<MobileMenu>` via React `useState` (replacing Alpine.js)

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header
        id="website-header"
        className="sm:sticky top-0 z-50 bg-white dark:bg-gray-900 font-mono
                   flex justify-between items-center px-4 py-6 sm:px-6 md:space-x-10"
      >
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link href="/#">
            <Image src="/assets/langium_logo_w_nib.svg" alt="Langium" width={120} height={48}
                   className="h-12 w-auto" priority />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="-mr-2 -my-2 md:hidden">
          <button type="button" onClick={() => setIsOpen(true)}
            className="dark:text-gray-100 rounded-md p-2 inline-flex items-center
                       justify-center text-gray-400 hover:text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Open menu</span>
            {/* Heroicon: outline/menu */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="items-center hidden space-x-10 md:flex text-gray-900
                        dark:text-gray-100 lg:px-12">
          <Link href="/docs/" className="nav-link-desktop">Documentation</Link>
          <Link href="/showcase/" className="nav-link-desktop">Showcase</Link>
          <Link href="/playground/" className="nav-link-desktop">Playground</Link>
          <a href="https://eclipse-langium.github.io/langium/"
             className="nav-link-desktop">API</a>
          <a href="https://www.typefox.io/language-engineering/"
             className="nav-link-desktop text-emeraldLangium dark:text-emeraldLangium">
            Support
          </a>
          <a className="w-10 h-10" target="_blank" rel="noreferrer"
             href="https://github.com/eclipse-langium/langium">
            <Image src="/assets/GitHub-Mark-Light-120px-plus.png" alt="GitHub"
                   width={40} height={40} />
          </a>
        </nav>
      </header>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
```

### 6.3 `components/Footer.tsx`

Direct port of `layouts/partials/langium-footer.html`.

```tsx
export function Footer() {
  const links = [
    { label: 'About',         href: 'https://projects.eclipse.org/projects/ecd.langium/' },
    { label: 'Privacy Policy',href: 'http://www.eclipse.org/legal/privacy.php' },
    { label: 'Terms of Use',  href: 'http://www.eclipse.org/legal/termsofuse.php' },
    { label: 'Copyright Agent',href:'http://www.eclipse.org/legal/copyright.php' },
  ]
  return (
    <footer id="website-footer"
      className="font-mono block md:flex md:flex-wrap dark:text-gray-100
                 justify-center items-center mt-12 mb-6">
      {links.map((link, i) => (
        <>
          <div key={link.label} className="px-4 block text-left md:text-center m-4"
               style={{ width: 180 }}>
            <a href={link.href} className="hover:underline">{link.label}</a>
          </div>
          {i < links.length - 1 && (
            <span className="text-lg hidden md:inline">|</span>
          )}
        </>
      ))}
      <div className="basis-full h-0" />
      <div className="px-4 block text-left md:text-center">
        © 2024 by{' '}
        <a href="https://www.eclipse.org/org/" target="_blank" rel="noreferrer"
           className="hover:underline">
          Eclipse Foundation
        </a>
      </div>
    </footer>
  )
}
```

### 6.4 `components/MobileMenu.tsx`

Replaces Alpine.js-powered `layouts/partials/langium-mobile-menu.html`. Uses React props
for open/close state (no Alpine.js dependency needed).

Renders a full-width slide-out overlay panel with the same navigation links as the desktop
header. Opened by the hamburger button in `Header.tsx`, closed by an X button or clicking
outside.

---

## 7. Front Page

The front page (`/`) is the most visually distinct page of the site. It does **not** use
the Nextra docs theme. It is a plain Next.js `app/page.tsx` that assembles all sections.

### 7.1 Sections

The front page replicates the following sections from `hugo/content/_index.html`:

| Section | Description |
|---|---|
| **Teaser (`#teaser`)** | Hero section: headline, description, CTAs, parallax background |
| **About (`#about`)** | "Why Langium?" — 6 feature cards with icons |
| **Features (`#features`)** | Horizontal carousel of 6 feature highlights |
| **VS (`#VS`)** | "Langium vs. Xtext" comparison |
| **Community** | "Join the Community" — npm + GitHub icons |

### 7.2 `app/page.tsx` Structure

```tsx
import { TeaserSection }     from '@/components/home/TeaserSection'
import { AboutSection }      from '@/components/home/AboutSection'
import { FeaturesCarousel }  from '@/components/home/FeaturesCarousel'
import { VsSection }         from '@/components/home/VsSection'
import { CommunitySection }  from '@/components/CommunitySection'

export default function HomePage() {
  return (
    <>
      <TeaserSection />
      <AboutSection />
      <FeaturesCarousel />
      <VsSection />
      <CommunitySection />
    </>
  )
}
```

Home page components live in `components/home/`:
- `TeaserSection.tsx` — Hero with parallax background, headline, CTA buttons, scroll-down SVG
- `AboutSection.tsx` — "Why Langium?" grid with 6 icon+text cards (TypeScript, Experience, Low Barrier, Everywhere, Customize, Versatile)
- `FeaturesCarousel.tsx` — Horizontally scrollable carousel of 6 feature items; left/right arrows use carousel logic (carried over from `static/index.js`)
- `VsSection.tsx` — "Langium vs. Xtext" two-column comparison cards
- `CommunitySection.tsx` — `#divider` (nib.svg) + "Join the Community" npm + GitHub icons

### 7.3 GSAP Animations

The old site loads GSAP from CDN in `langium-scripts.html` and runs scroll animations
from `static/index.js`. In the new site:

- Install `gsap` from npm (no CDN)
- Port `static/index.js` animations to a client component `components/home/HomeAnimations.tsx`
- Use React `useEffect` to initialize GSAP `ScrollTrigger` after mount
- Only load on the front page (add `<HomeAnimations />` to `app/page.tsx`)

```tsx
'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

export function HomeAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
    // Port existing animation code from old-website/hugo/static/index.js
    // ...
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])
  return null
}
```

### 7.4 `app/layout.tsx` Override for Home Page

The home page does **not** use the Nextra docs theme, so it must not render the docs
sidebar or ToC. This is achieved automatically because the home page is outside the
`app/docs/` route tree and uses only the root `app/layout.tsx`.

The root layout already omits the Nextra sidebar — only `app/docs/layout.tsx` activates
the Nextra docs theme.

---

## 8. Documentation Section (`/docs`)

### 8.1 `app/docs/layout.tsx`

The docs section uses `nextra-theme-docs` which provides:
- Left sidebar with collapsible sections
- Right-side table of contents
- Breadcrumbs
- Previous/Next page navigation
- Built-in search (Pagefind or FlexSearch, configured in `next.config.mjs`)

```tsx
import { Layout } from 'nextra-theme-docs'
import type { ReactNode } from 'react'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>
}
```

> The `Layout` component from `nextra-theme-docs` injects the sidebar and navigation
> chrome. The sidebar structure is driven by `_meta.ts` files in each folder.

### 8.2 Sidebar Navigation (`_meta.ts` files)

Each folder in `app/docs/` has a `_meta.ts` file that defines the sidebar title and
order. This replaces Hugo's `weight` front-matter field.

**Example `app/docs/_meta.ts`:**
```ts
export default {
  introduction: { title: 'Introduction' },
  learn:        { title: 'Learn' },
  recipes:      { title: 'Recipes' },
  reference:    { title: 'Reference' },
}
```

**Example `app/docs/learn/workflow/_meta.ts`:**
```ts
export default {
  'index':                    { title: "Langium's workflow" },
  install:                    { title: '1. Install Yeoman' },
  scaffold:                   { title: '2. Scaffold a Langium project' },
  write_grammar:              { title: '3. Write the grammar' },
  generate_ast:               { title: '4. Generate the AST' },
  resolve_cross_references:   { title: '5. Resolve cross-references' },
  create_validations:         { title: '6. Create validations' },
  generate_everything:        { title: '7. Generate artifacts' },
}
```

### 8.3 MDX Content Migration

Each Hugo `.md` content file becomes an `.mdx` file. Changes required:

| Hugo feature | Nextra/MDX replacement |
|---|---|
| `---` YAML front-matter | MDX `export const metadata = {...}` or Nextra page config |
| `{{< notification >}}` shortcode | `<Notification>` imported MDX component |
| `{{< mermaid >}}` shortcode | `<MermaidDiagram>` imported MDX component |
| `{{< toc format=html >}}` | Nextra built-in right-side ToC (automatic) |
| Hugo `aliases` | `next.config.mjs` redirects (see §14) |
| Relative image paths | `<Image>` from `next/image` or standard `![alt](path)` with public path |

**Front-matter migration example:**

Hugo:
```yaml
---
title: "Writing a Grammar"
weight: 0
aliases:
  - /tutorials/writing_a_grammar
  - /writing_a_grammar
---
```

Nextra MDX:
```mdx
export const metadata = {
  title: 'Writing a Grammar',
}
// Aliases are handled in next.config.mjs redirects
```

### 8.4 `components/Notification.tsx`

Replaces `layouts/shortcodes/notification.html`. Renders a yellow warning box.

```tsx
export function Notification({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4
                    border-yellow-400 dark:border-yellow-600 rounded">
      <span className="mr-2">⚠️</span>
      {children}
    </div>
  )
}
```

Import in MDX files as: `import { Notification } from '@/components/Notification'`

Or configure as a global MDX component in `next.config.mjs` so it is available in
all MDX files without explicit imports.

### 8.5 `components/MermaidDiagram.tsx`

Replaces `{{< mermaid >}}` shortcode. Lazy-loads Mermaid.js and renders diagrams client-side.

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' })
      if (ref.current) {
        mermaid.render('mermaid-diagram', chart).then(({ svg }) => {
          ref.current!.innerHTML = svg
        })
      }
    })
  }, [chart])
  return <div ref={ref} />
}
```

Used in `app/docs/learn/workflow/page.mdx`:
```mdx
import { MermaidDiagram } from '@/components/MermaidDiagram'

<MermaidDiagram chart={`
graph TD
  A[Install] --> B[Scaffold]
  B --> C[Write Grammar]
  ...
`} />
```

### 8.6 Code Syntax Highlighting

The old site uses Prism.js for syntax highlighting (including a custom Langium grammar
definition). In Nextra 3.x, code blocks are highlighted with **Shiki** (built-in).

Migration steps:
1. Add the custom Langium grammar to Nextra's Shiki configuration in `next.config.mjs`:
   ```js
   const withNextra = nextra({
     // ...
     mdxOptions: {
       rehypePrettyCodeOptions: {
         // Register the Langium TextMate grammar
         langs: [
           {
             id: 'langium',
             scopeName: 'source.langium',
             grammar: require('./public/prism/langium-prism.js'), // or JSON grammar
           },
         ],
       },
     },
   })
   ```
2. Remove Prism.js script tags (no longer needed).
3. Port `public/prism/langium-prism.js` to TextMate JSON format for Shiki compatibility.

---

## 9. Playground Section (`/playground`)

### 9.1 `app/playground/layout.tsx`

The playground is a **full-screen** page with no sidebar or footer chrome. This layout
overrides the root layout's `<main>` wrapper behavior.

```tsx
import type { ReactNode } from 'react'

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  // Full-screen: bypass standard <main> wrapper, no Nextra sidebar
  return (
    <div className="playground-root" style={{ height: '100vh', width: '100%',
                                              display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  )
}
```

> **Note:** This layout is at `app/playground/layout.tsx`. Next.js applies layouts
> bottom-up, so this overrides only the playground route's inner rendering, while the
> root `app/layout.tsx` still provides the `<html>`/`<head>` shell and header/footer.
> To achieve the old site's `noMain` behavior (no header/footer on playground), the
> playground layout should render its own minimal shell and exclude Header/Footer.
> The root `layout.tsx` should be structured to not force-render Header/Footer, instead
> delegating that to a shared component so sub-layouts can opt out.
>
> **Recommended approach:** Move Header/Footer rendering from `app/layout.tsx` into a
> separate `(site)/layout.tsx` route group. The `(site)` group wraps `/`, `/docs/`, and
> `/showcase/`, while `/playground/` uses its own layout without Header/Footer in the
> body (the header is shown differently in the playground — just a slim top bar).

### 9.2 `app/playground/page.tsx`

Directly ports the 3-panel Monaco playground:
- Left panel: Grammar editor (Langium grammar language)
- Middle panel: Content editor (user's DSL instance)
- Right panel: Syntax tree viewer (toggle via button)

Key implementation notes:
- All playground TypeScript source files in `hugo/content/playground/` are ported to
  `app/playground/` or `components/playground/`
- Workers (`langiumServerWorker.js`, `userServerWorker.js`) are pre-built by the `core`
  workspace and placed in `public/playground/libs/worker/`
- URL sharing (base64 state) is preserved
- Uses `'use client'` directive since Monaco requires browser APIs

### 9.3 Playground Worker Build

Workers are built using Vite (or esbuild) as part of `npm run build:workers` in `core/`:

```
core/
├── src/
│   ├── playground/
│   │   ├── langium-worker.ts       # Langium language server worker
│   │   ├── user-worker.ts          # User grammar language server worker
│   │   ├── common.ts               # Shared playground utilities
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   ├── worker-utils.ts
│   │   ├── preprocess.ts
│   │   ├── user-validator.ts
│   │   └── Tree.tsx                # AST tree React component
│   └── index.ts
└── vite.playground.ts              # Vite config for playground worker build
```

Build output → `public/playground/libs/worker/`

---

## 10. Showcase Section (`/showcase`)

### 10.1 `app/showcase/layout.tsx` — Shared Showcase Layout

All showcase sub-pages share this single layout file. It provides:
- Full-screen flex container (no sidebar, no main padding)
- Monaco editor shell styles
- Consistent top bar (title, description)

```tsx
import type { ReactNode } from 'react'

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="showcase-root"
      style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </div>
  )
}
```

> This file is `app/showcase/layout.tsx`. By placing it in the parent `showcase/`
> folder, Next.js automatically applies it to **all** child routes:
> `/showcase`, `/showcase/arithmetics`, `/showcase/domainmodel`, etc.

### 10.2 `app/showcase/page.tsx` — Showcase Landing Page

Replicates `hugo/content/showcase/_index.html`. Renders a grid of showcase cards.

```tsx
import { ShowcaseCard } from '@/components/showcase/ShowcaseCard'

const showcases = [
  { title: 'State Machine', href: '/showcase/statemachine',
    img: '/assets/Langium_Statemachine.svg',
    description: 'Traffic light state machine DSL demo.' },
  { title: 'Arithmetics', href: '/showcase/arithmetics',
    img: '/assets/Langium_Arithmetics.svg',
    description: 'Arithmetic expression DSL demo.' },
  { title: 'MiniLogo', href: '/showcase/minilogo',
    img: '/assets/Langium_MiniLogo.svg',
    description: 'Geometric shapes drawing language.' },
  { title: 'SQL', href: '/showcase/sql',
    img: '/assets/Langium_SQL.svg',
    description: 'Airport schema SQL DSL demo.' },
  { title: 'Domain Model', href: '/showcase/domainmodel',
    img: '/assets/Langium_Domainmodel.svg',
    description: 'Blog data model DSL demo.' },
  { title: 'OpenAPI SL', href: '/showcase/openapi',
    img: '/assets/BestSolution_OpenAPI.svg',
    description: 'OpenAPI DSL by BestSolution (external).', external: true },
]

export default function ShowcasePage() {
  return (
    <main className="...">
      <h1>Langium Showcase</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {showcases.map(s => <ShowcaseCard key={s.href} {...s} />)}
      </div>
    </main>
  )
}
```

### 10.3–10.8 Individual Showcase Pages

Each showcase is a **self-contained** page in its own sub-folder. Independence means:
- Each page imports only its own language server worker path
- Each page manages its own Monaco editor state
- No cross-showcase dependencies

**Pattern for each showcase `page.tsx`:**

```tsx
// app/showcase/statemachine/page.tsx
'use client'
import { MonacoShowcaseEditor } from '@/components/showcase/MonacoShowcaseEditor'

const WORKER_URL = '/showcase/libs/worker/statemachineServerWorker.js'
const DEFAULT_CONTENT = `/* statemachine example content */`

export default function StatemachinePage() {
  return (
    <MonacoShowcaseEditor
      title="State Machine"
      workerUrl={WORKER_URL}
      defaultContent={DEFAULT_CONTENT}
      languageId="statemachine"
    />
  )
}
```

| Showcase | Worker file | Language ID | DSL Source |
|---|---|---|---|
| `statemachine` | `statemachineServerWorker.js` | `statemachine` | `langium-statemachine-dsl` |
| `arithmetics` | `arithmeticsServerWorker.js` | `arithmetics` | `langium-arithmetics-dsl` |
| `minilogo` | `minilogoServerWorker.js` | `minilogo` | `langium-minilogo` |
| `sql` | `sqlServerWorker.js` | `sql` | local SQL implementation |
| `domainmodel` | `domainmodelServerWorker.js` | `domainmodel` | `langium-domainmodel-dsl` |
| `openapi` | — | — | external redirect |

**`app/showcase/openapi/page.tsx`** is a special case — it renders a redirect notice
and an immediate `window.location` redirect to the external BestSolution playground URL.

### 10.9 `components/showcase/MonacoShowcaseEditor.tsx`

The shared base editor component used by each showcase page. It wraps
`@typefox/monaco-editor-react` / `monaco-editor-wrapper` and provides:
- Monaco editor initialization
- Language server worker connection
- Toolbar (title, description, links)
- Responsive layout

```tsx
'use client'
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react'

interface Props {
  title: string
  workerUrl: string
  defaultContent: string
  languageId: string
  renderPanel?: () => React.ReactNode   // Optional secondary panel (e.g., SVG canvas)
}

export function MonacoShowcaseEditor({ title, workerUrl, defaultContent,
                                       languageId, renderPanel }: Props) {
  // ... Monaco setup, worker loading, layout
}
```

Each showcase's unique visual panel (e.g., SVG canvas for MiniLogo, table for SQL,
state machine diagram for Statemachine, D3 tree for Domain Model) is passed via the
`renderPanel` prop from the showcase's own `page.tsx`.

---

## 11. API Section (`/api`)

### `app/api/page.tsx`

The `/api` route does not conflict with Next.js API routes because Next.js only treats
`route.ts` files (not `page.tsx`) as API handlers.

```tsx
'use client'
import { useEffect } from 'react'

export default function ApiPage() {
  useEffect(() => {
    window.location.replace('https://eclipse-langium.github.io/langium/')
  }, [])
  return (
    <main className="p-8 dark:text-gray-100">
      <p>Redirecting to API documentation…</p>
      <a href="https://eclipse-langium.github.io/langium/"
         className="text-emeraldLangium underline">
        Click here if not redirected automatically.
      </a>
    </main>
  )
}
```

> Alternatively, configure this as a `permanent: true` redirect in `next.config.mjs`
> (preferable since it works without JavaScript).

---

## 12. Static Assets

All files from `old-website/hugo/static/` are copied directly to `public/` with the
same paths. This preserves all existing asset URLs.

### Copy Map

| Old path | New path |
|---|---|
| `hugo/static/assets/` | `public/assets/` |
| `hugo/static/favicon/` | `public/favicon/` |
| `hugo/static/prism/` | `public/prism/` |
| `hugo/static/custom.css` | Merged into `app/globals.css` (not served separately) |
| `hugo/static/index.js` | Ported to `components/home/HomeAnimations.tsx` |
| `hugo/static/css/style.css` | Generated by Next.js/PostCSS (not static) |

### Co-located Content Images

Images co-located with docs content (e.g., `building_an_extension/*.jpg`) are placed
**alongside** their `.mdx` files in `app/docs/`. Next.js allows this in the `app/`
directory. Reference them in MDX using relative paths or `next/image`.

### Showcase Worker Assets

Pre-built language server workers are placed in `public/showcase/libs/worker/`. These
are built by the `core` workspace as part of `npm run build` (before `next build`).

---

## 13. Core Package (Monaco Wrapper)

The `core/` workspace is **carried over unchanged** from `old-website/core/`. It is an
npm workspace that bundles the Monaco editor wrapper utilities.

### Changes

1. Update `core/package.json` workspace name if needed (keep as `core`)
2. Add showcase worker build scripts to `core/package.json`:
   ```json
   {
     "scripts": {
       "build": "npm run build:bundle && npm run build:workers",
       "build:bundle": "vite build --config vite.bundle.ts",
       "build:workers": "vite build --config vite.showcase-worker.ts && vite build --config vite.playground-worker.ts"
     }
   }
   ```
3. Worker build outputs go to `../public/showcase/libs/worker/` and
   `../public/playground/libs/worker/` (relative to repo root)

The showcase TypeScript/TSX source files (from `hugo/assets/scripts/`) are moved into
`core/src/showcase/`:

```
core/src/showcase/
├── arithmetics/
│   ├── arithmetics.tsx
│   └── arithmetics-tools.tsx
├── domainmodel/
│   ├── domainmodel.tsx
│   ├── domainmodel-tools.ts
│   └── d3tree.tsx
├── minilogo/
│   ├── minilogo.tsx
│   └── minilogo-tools.ts
├── sql/
│   ├── ui.tsx
│   ├── language-server.ts
│   ├── constants.ts
│   └── sql.tmLanguage.json
└── statemachine/
    ├── statemachine.tsx
    └── statemachine-tools.ts
```

Each showcase page in `app/showcase/*/page.tsx` imports from `core/src/showcase/` or
from the pre-built bundles in `public/`.

---

## 14. URL Redirects & Aliases

All Hugo `aliases` front-matter and meta-refresh redirects are replaced with
`next.config.mjs` permanent redirects. This ensures SEO-safe 301 redirects.

```js
// next.config.mjs
async redirects() {
  return [
    // ── Meta-refresh redirects (were <meta http-equiv="refresh"> in Hugo) ──
    { source: '/docs',                     destination: '/docs/introduction',       permanent: true },
    { source: '/docs/learn',               destination: '/docs/learn/workflow',     permanent: true },
    { source: '/docs/introduction/showcases', destination: '/showcase',            permanent: true },
    { source: '/docs/introduction/playground', destination: '/playground',         permanent: true },
    { source: '/api',                      destination: 'https://eclipse-langium.github.io/langium/', permanent: true },

    // ── Hugo aliases ──
    { source: '/docs/getting-started',     destination: '/docs/learn/workflow',     permanent: true },
    { source: '/grammar-language',         destination: '/docs/reference/grammar-language', permanent: true },
    { source: '/docs/grammar-language',    destination: '/docs/reference/grammar-language', permanent: true },
    { source: '/docs/document-lifecycle',  destination: '/docs/reference/document-lifecycle', permanent: true },
    { source: '/sematic-model',            destination: '/docs/reference/semantic-model', permanent: true },
    { source: '/semantic-model',           destination: '/docs/reference/semantic-model', permanent: true },
    { source: '/class-member',             destination: '/docs/recipes/scoping/class-member', permanent: true },
    { source: '/qualified-name',           destination: '/docs/recipes/scoping/qualified-name', permanent: true },
    { source: '/guides/code-bundling',     destination: '/docs/recipes/code-bundling', permanent: true },
    { source: '/tutorials/writing_a_grammar', destination: '/docs/learn/minilogo/writing_a_grammar', permanent: true },
    { source: '/writing_a_grammar',        destination: '/docs/learn/minilogo/writing_a_grammar', permanent: true },
    { source: '/tutorials/validation',     destination: '/docs/learn/minilogo/validation', permanent: true },
    { source: '/tutorials/customizing_cli',destination: '/docs/learn/minilogo/customizing_cli', permanent: true },
    { source: '/tutorials/generation',     destination: '/docs/learn/minilogo/generation', permanent: true },
    { source: '/tutorials/generation_in_the_web', destination: '/docs/learn/minilogo/generation_in_the_web', permanent: true },
    { source: '/tutorials/langium_and_monaco', destination: '/docs/learn/minilogo/langium_and_monaco', permanent: true },
    { source: '/tutorials/building_an_extension', destination: '/docs/learn/minilogo/building_an_extension', permanent: true },
  ]
}
```

> **Note:** External redirects (like `/api`) work with `permanent: true` in
> `next.config.mjs` for the dev server and regular SSR deployments, but with
> `output: 'export'` (static HTML), Next.js **cannot** generate server-side redirects.
> For static export, external redirects must be handled differently:
> 1. Generate redirect HTML stub pages (e.g., `public/api/index.html` with
>    `<meta http-equiv="refresh">` pointing to the external URL)
> 2. Or use a GitHub Pages `_redirects` file (not supported natively by GitHub Pages)
> 3. **Recommended:** Use the client-side redirect page approach (§11) for external URLs,
>    and generate static redirect HTML files for internal aliases using a build-time
>    script (`scripts/generate-redirects.ts`).

---

## 15. CI/CD Workflows

### 15.1 `.github/workflows/deploy.yml` — Deploy to GitHub Pages

Triggered on push to the **default branch** (`lotes/nextra`).

```yaml
name: Deploy Nextra site to Pages

on:
  push:
    branches: ["lotes/nextra"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build workers
        run: npm run build:workers

      - name: Build Next.js site
        run: npm run build
        # Produces static output in ./out

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> **Key difference from old `deploy.yml`:** The branch is `lotes/nextra` (not `main`).
> The build artifact path is `./out` (Next.js static export) instead of `./public` (Hugo).
> Node.js version is updated to 20 (LTS as of 2024+).
>
> **⚠️ `NEXT_PUBLIC_BASE_PATH` is required on the build step** — set it to `/langium-website`
> for the default branch deployment.  Without it, Next.js `basePath` is empty, all `_next/`
> asset requests 404, and CSS background images land at the wrong path.  See §5.1 for the
> CSS background-image caveat.

### 15.2 `.github/workflows/preview.yml` — PR Preview Deployment

Triggered on pull requests targeting `lotes/nextra`. Deploys a preview to a dedicated
repository `eclipse-langium/langium-previews` using `rossjrw/pr-preview-action`.

```yaml
name: Deploy PR previews

on:
  pull_request_target:
    types: [opened, synchronize, reopened, closed]
    branches: ["lotes/nextra"]

concurrency: preview-${{ github.head_ref }}

jobs:
  build-preview:
    if: github.event_name == 'pull_request_target' && github.event.action != 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout PR
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build workers
        run: npm run build:workers

      - name: Build Next.js site
        run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /pr-previews/pr-${{ github.event.number }}

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: site
          path: ./out

  deploy-preview:
    needs: build-preview
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    environment:
      name: pull-request-preview
      url: ${{ steps.deployment.outputs.deployment-url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download site artifact
        uses: actions/download-artifact@v4
        with:
          name: site
          path: ./out

      - name: Deploy PR preview
        uses: rossjrw/pr-preview-action@v1
        id: deployment
        with:
          source-dir: ./out
          preview-branch: previews
          umbrella-dir: pr-previews
          deploy-repository: eclipse-langium/langium-previews
          token: ${{ secrets.DEPLOY_PREVIEW_TOKEN }}
          action: auto

  remove-preview:
    if: github.event_name == 'pull_request_target' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Remove PR preview
        uses: rossjrw/pr-preview-action@v1
        with:
          preview-branch: previews
          umbrella-dir: pr-previews
          deploy-repository: eclipse-langium/langium-previews
          token: ${{ secrets.DEPLOY_PREVIEW_TOKEN }}
          action: auto
```

> **Key differences from old `preview.yml`:**
> - Added `branches: ["lotes/nextra"]` filter on `pull_request_target` (PRs targeting
>   only the default branch get previews)
> - Build artifact is `./out` instead of `./public`
> - Added `NEXT_PUBLIC_BASE_PATH` env var so Next.js can generate correct asset paths
>   for subdirectory-hosted previews
> - Node.js updated to 20

---

## 16. Migration Checklist

### Phase 1 — Project Setup
- [x] Initialize root `package.json` and npm workspaces (`core`)
- [x] Install Next.js, Nextra, React via `npm install`
- [x] Install TailwindCSS, PostCSS, autoprefixer
- [x] Install TypeScript, type definitions
- [x] Install GSAP, Mermaid
- [x] Create `next.config.mjs`
- [x] Create `theme.config.tsx`
- [x] Create `tailwind.config.ts` (brand colors match old site exactly)
- [x] Create `postcss.config.js`
- [x] Create `tsconfig.json`
- [x] Create `app/globals.css` (port `custom.css` + Tailwind directives)

### Phase 2 — Static Assets
- [x] Copy `hugo/static/assets/` → `public/assets/`
- [x] Copy `hugo/static/favicon/` → `public/favicon/`
- [x] Copy `hugo/static/prism/` → `public/prism/`
- [x] Create `public/showcase/libs/worker/` (populated by core build)
- [x] Create `public/playground/libs/worker/` (populated by core build)

### Phase 3 — Global Components
- [x] `app/layout.tsx` (root HTML layout)
- [x] `components/Header.tsx` (header + desktop nav)
- [x] `components/MobileMenu.tsx` (slide-out mobile nav, replaces Alpine.js)
- [x] `components/Footer.tsx` (footer with Eclipse links)
- [x] `components/CommunitySection.tsx` (npm + GitHub icons)
- [x] `components/Notification.tsx` (MDX warning box)
- [x] `components/MermaidDiagram.tsx` (Mermaid renderer)

### Phase 4 — Front Page
- [x] `app/page.tsx`
- [x] `components/home/TeaserSection.tsx` (hero with parallax)
- [x] `components/home/AboutSection.tsx` ("Why Langium?" cards)
- [x] `components/home/FeaturesCarousel.tsx` (sliding features)
- [x] `components/home/VsSection.tsx` ("Langium vs. Xtext")
- [x] `components/home/HomeAnimations.tsx` (GSAP animations from `index.js`)

### Phase 5 — Documentation
- [ ] `app/docs/layout.tsx` (Nextra docs theme)
- [ ] All `_meta.ts` files (sidebar ordering)
- [ ] Migrate all `.md` → `.mdx` content files
- [ ] Replace `{{< notification >}}` with `<Notification>` in all MDX files
- [ ] Replace `{{< mermaid >}}` with `<MermaidDiagram>` in workflow page
- [ ] Configure Shiki with Langium grammar for code highlighting
- [ ] Update workflow files: uncomment steps that are now ready in `deploy.yml` and `preview.yml`

### Phase 6 — Core Package & Worker Build
- [ ] Move playground TS source to `core/src/playground/`
- [ ] Move showcase TS/TSX source to `core/src/showcase/`
- [ ] Add `vite.playground-worker.ts` build config
- [ ] Update `vite.showcase-worker.ts` build config
- [ ] Verify all workers build and output to `public/`
- [ ] Update workflow files: uncomment the `Build workers` step in `deploy.yml` and `preview.yml`

### Phase 7 — Playground
- [ ] `app/playground/layout.tsx` (full-screen, no sidebar)
- [ ] `app/playground/page.tsx` (3-panel Monaco editor)
- [ ] Test URL sharing (base64 encode/decode of state)
- [ ] Update workflow files: uncomment steps that are now ready in `deploy.yml` and `preview.yml`

### Phase 8 — Showcase
- [ ] `app/showcase/layout.tsx` (shared layout — single file for all showcases)
- [ ] `app/showcase/page.tsx` (landing/index page)
- [ ] `components/showcase/ShowcaseCard.tsx`
- [ ] `components/showcase/MonacoShowcaseEditor.tsx`
- [ ] `app/showcase/statemachine/page.tsx` (self-contained)
- [ ] `app/showcase/arithmetics/page.tsx` (self-contained)
- [ ] `app/showcase/minilogo/page.tsx` (self-contained)
- [ ] `app/showcase/sql/page.tsx` (self-contained)
- [ ] `app/showcase/domainmodel/page.tsx` (self-contained)
- [ ] `app/showcase/openapi/page.tsx` (external redirect)
- [ ] Update workflow files: uncomment steps that are now ready in `deploy.yml` and `preview.yml`

### Phase 9 — API Redirect
- [ ] `app/api/page.tsx` (or `next.config.mjs` redirect for static export)
- [ ] Update workflow files: uncomment steps that are now ready in `deploy.yml` and `preview.yml`

### Phase 10 — URL Redirects
- [ ] Add all Hugo alias redirects to `next.config.mjs`
- [ ] Create `scripts/generate-redirects.ts` for static export redirect stubs
- [ ] Verify all old URLs from `migration/LINKS.md` resolve correctly
- [ ] Update workflow files: uncomment steps that are now ready in `deploy.yml` and `preview.yml`

### Phase 11 — CI/CD Workflows
- [x] `.github/workflows/deploy.yml` (deploy to gh-pages from `lotes/nextra`)
- [x] `.github/workflows/preview.yml` (PR previews for PRs targeting `lotes/nextra`)
- [ ] Uncomment `Build workers` step in both workflows once Phase 6 is complete

### Phase 12 — Verification
- [ ] Run `npm run build` — site builds without errors
- [ ] Run `npm run dev` — local dev server works
- [ ] Visual comparison: home page, docs page, playground, showcase
- [ ] Check all redirects in `migration/LINKS.md`
- [ ] Check dark mode appearance matches old site
- [ ] Test mobile navigation (MobileMenu replaces Alpine.js)
- [ ] Test playground URL sharing
- [ ] Test each showcase independently
- [ ] Verify worker files are served from `public/`

---

*Last updated: phases 1–4 and partial phase 11 implemented.*

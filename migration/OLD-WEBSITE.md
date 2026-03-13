# OLD-WEBSITE.md — Hugo Langium Website Structure Reference

> **Purpose:** This document is a comprehensive reference of the old Hugo-based Langium website (located in `old-website/`). It is intended to speed up planning and executing the migration from Hugo to Nextra by providing a single place to look up file paths, content structure, front-matter fields, layouts, config, scripts, and CI/CD.

---

## Table of Contents

1. [Repository Root](#1-repository-root)
2. [Build System (npm Workspaces)](#2-build-system-npm-workspaces)
3. [Hugo Configuration](#3-hugo-configuration)
4. [Content Structure](#4-content-structure)
   - 4.1 [Home Page (`_index.html`)](#41-home-page-_indexhtml)
   - 4.2 [Documentation (`/docs`)](#42-documentation-docs)
     - 4.2.1 [Introduction](#421-introduction)
     - 4.2.2 [Learn → Workflow](#422-learn--workflow)
     - 4.2.3 [Learn → MiniLogo Tutorial](#423-learn--minilogo-tutorial)
     - 4.2.4 [Recipes](#424-recipes)
     - 4.2.5 [Reference](#425-reference)
   - 4.3 [Playground (`/playground`)](#43-playground-playground)
   - 4.4 [Showcase (`/showcase`)](#44-showcase-showcase)
   - 4.5 [API (`/api`)](#45-api-api)
5. [Layout System](#5-layout-system)
   - 5.1 [Layout Types (`type` front-matter field)](#51-layout-types-type-front-matter-field)
   - 5.2 [Base Layouts (`baseof.html`)](#52-base-layouts-baseofhtml)
   - 5.3 [Page Layouts](#53-page-layouts)
   - 5.4 [Partials](#54-partials)
   - 5.5 [Shortcodes](#55-shortcodes)
6. [Theme: hugo-geekdoc](#6-theme-hugo-geekdoc)
7. [Static Assets (`hugo/static/`)](#7-static-assets-hugostatic)
8. [Hugo Assets — Frontend Scripts (`hugo/assets/scripts/`)](#8-hugo-assets--frontend-scripts-hugoassetsscripts)
9. [TailwindCSS Styling (`tailwind/`)](#9-tailwindcss-styling-tailwind)
10. [Core Package (`core/`)](#10-core-package-core)
11. [Navigation & Footer](#11-navigation--footer)
12. [URL Aliases & Redirects](#12-url-aliases--redirects)
13. [CI/CD Workflows](#13-cicd-workflows)
14. [Key Front-Matter Fields Reference](#14-key-front-matter-fields-reference)

---

## 1. Repository Root

```
old-website/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Pages deployment
│       └── check-links.yml     # Link checker CI
├── .vscode/                    # Editor settings
├── .gitignore
├── .gitpod.yml
├── LICENSE
├── README.md                   # Overview, points to sub-folder READMEs
├── package.json                # Root npm workspaces config
├── package-lock.json
├── tsconfig.json
├── scripts/
│   └── check-links.ts          # Link-checking script
├── core/                       # Monaco editor wrapper utilities (see §10)
├── hugo/                       # Hugo site (see §3–§8)
└── tailwind/                   # TailwindCSS styling (see §9)
```

**Root `package.json` summary:**
- `name`: `langium-website-project`
- `workspaces`: `["core", "hugo", "tailwind"]`
- Key scripts:
  - `build` — `clean`, then build `core`, `tailwind`, `hugo` in order
  - `watch` — concurrent watch for hugo + tailwind
  - `check:links` — runs `scripts/check-links.ts` via ts-node
- Node: `18.18.1`, npm: `9.9.0` (pinned via Volta)

---

## 2. Build System (npm Workspaces)

Three npm workspaces are built in order:

| Workspace | Path | Role |
|-----------|------|------|
| `core` | `old-website/core/` | Bundles Monaco editor wrapper; produces `dist/` and `bundle/` |
| `tailwind` | `old-website/tailwind/` | Compiles TailwindCSS → `hugo/static/css/style.css` |
| `hugo` | `old-website/hugo/` | Bundles language-server workers, runs Hugo to produce `public/` |

Build order matters: `tailwind` must run before `hugo` (CSS output), `core` must run before `hugo` (JS bundles).

---

## 3. Hugo Configuration

**File:** `hugo/config.toml`

| Setting | Value | Notes |
|---------|-------|-------|
| `baseURL` | `/` | Relative URLs for GitHub Pages subdirectory previews |
| `title` | `Langium` | Site title |
| `theme` | `hugo-geekdoc` | Theme in `hugo/themes/hugo-geekdoc/` |
| `relativeURLs` | `true` | Required for subdirectory preview deployments |
| `disablePathToLower` | `true` | Preserves filename casing |
| `enableGitInfo` | `true` | Git metadata available in templates |
| `enableRobotsTXT` | `true` | Renders robots.txt |
| `markup.goldmark.renderer.unsafe` | `true` | Needed for Mermaid shortcode |
| `markup.highlight.codeFences` | `false` | Hugo highlighting disabled (uses Prism instead) |
| `markup.tableOfContents` | levels 1–9 | Full ToC range |
| `taxonomies.tag` | `tags` | Standard tag taxonomy |
| `build.minify` | `true` | Minifies output |
| `build.options.sourceMap` | `true` | Source maps generated |
| `params.geekdocToC` | `3` | Show 3 levels of ToC in geekdoc theme |
| `params.geekdocLogo` | `assets/langium_logo_w_nib.svg` | Logo path (relative to `static/`) |
| `params.geekdocRepo` | `https://github.com/eclipse-langium/langium-website` | GitHub repo link |
| `params.geekdocEditPath` | `blob/main/hugo/content` | "Edit page" link path |
| `params.geekdocCollapseSection` | `true` | Sections collapsed by default |
| `params.geekdocCollapseAllSections` | `true` | All sections collapsed |

---

## 4. Content Structure

All content lives under `hugo/content/`. Hugo sections map directly to URL paths.

### Full Content Tree

```
hugo/content/
├── _index.html                          # Home page (type: langium)
├── api/
│   └── _index.md                        # Redirects to external API docs
├── docs/
│   ├── _index.md                        # Redirects to /docs/introduction/
│   ├── introduction/
│   │   ├── _index.md                    # "What is Langium?"
│   │   ├── features.md                  # Feature overview
│   │   ├── playground.md                # Redirects to /playground
│   │   └── showcases.md                 # Redirects to /showcase
│   ├── learn/
│   │   ├── _index.md                    # Redirects to /docs/learn/workflow/
│   │   ├── workflow/
│   │   │   ├── _index.md                # Mermaid flowchart of Langium workflow
│   │   │   ├── install.md               # Step 1: Install Yeoman
│   │   │   ├── scaffold.md              # Step 2: Scaffold project
│   │   │   ├── write_grammar.md         # Step 3: Write grammar
│   │   │   ├── generate_ast.md          # Step 4: Generate AST
│   │   │   ├── resolve_cross_references.md  # Step 5: Cross-references
│   │   │   ├── create_validations.md    # Step 6: Validations
│   │   │   └── generate_everything.md   # Step 7: Generate artifacts
│   │   └── minilogo/
│   │       ├── _index.md                # MiniLogo tutorial overview
│   │       ├── writing_a_grammar.md     # Tutorial part 1
│   │       ├── validation.md            # Tutorial part 2
│   │       ├── customizing_cli.md       # Tutorial part 3
│   │       ├── generation.md            # Tutorial part 4
│   │       ├── building_an_extension/
│   │       │   ├── _index.md            # Tutorial part 5 (with images)
│   │       │   ├── icon.png
│   │       │   ├── installed-extension.jpg
│   │       │   ├── minilogo-vsix.jpg
│   │       │   ├── minilogo-with-icon.png
│   │       │   ├── vsix-install.jpg
│   │       │   └── vsix-installed.jpg
│   │       ├── langium_and_monaco.md    # Tutorial part 6
│   │       └── generation_in_the_web.md # Tutorial part 7
│   ├── recipes/
│   │   ├── _index.md                    # Recipes overview
│   │   ├── builtin-library.md           # Builtin Libraries
│   │   ├── code-bundling.md             # Code Bundling (alias: /guides/code-bundling)
│   │   ├── formatting.md                # Formatting API
│   │   ├── multiple-languages.md        # Multiple Dependent Languages
│   │   ├── keywords-as-identifiers/
│   │   │   ├── _index.md                # Keywords as Identifiers
│   │   │   ├── fixed-1-grammar.png
│   │   │   ├── fixed-2-token.png
│   │   │   ├── fixed-3-style-1.png
│   │   │   ├── fixed-3-style-2.png
│   │   │   └── problem.png
│   │   ├── lexing/
│   │   │   ├── _index.md                # Lexing (parent)
│   │   │   ├── case-insensitive-languages.md
│   │   │   └── indentation-sensitive-languages.md
│   │   ├── performance/
│   │   │   ├── _index.md                # Performance (parent)
│   │   │   └── caches.md
│   │   ├── scoping/
│   │   │   ├── _index.md                # Scoping overview
│   │   │   ├── class-member.md          # Class Member Scoping (alias: /class-member)
│   │   │   ├── file-based.md            # File-based Scoping
│   │   │   └── qualified-name.md        # Qualified Name Scoping (alias: /qualified-name)
│   │   └── validation/
│   │       ├── _index.md                # Validation (parent)
│   │       └── dependency-loops.md      # Dependency Loops
│   └── reference/
│       ├── _index.md                    # Reference overview
│       ├── configuration-services.md    # Configuration via Services
│       ├── document-lifecycle.md        # Document Lifecycle (alias: /docs/document-lifecycle)
│       ├── glossary.md                  # Glossary
│       ├── semantic-model.md            # Semantic Model Inference (aliases: /sematic-model, /semantic-model)
│       └── grammar-language/
│           ├── _index.md                # Grammar Language (aliases: /grammar-language, /docs/grammar-language)
│           └── infix-operators/
│               ├── _index.md            # Infix Operators
│               ├── manual-implementation.md
│               └── syntactical-implementation.md
├── playground/
│   ├── _index.html                      # Playground page (type: playground)
│   ├── Tree.tsx                         # React component for AST tree view
│   ├── common.ts                        # Shared playground utilities
│   ├── constants.ts
│   ├── langium-worker.ts                # Web worker: Langium language server
│   ├── preprocess.ts
│   ├── types.ts
│   ├── user-validator.ts
│   ├── user-worker.ts                   # Web worker: user grammar language server
│   ├── utils.ts
│   └── worker-utils.ts
└── showcase/
    ├── _index.html                      # Showcase index (type: langium)
    ├── arithmetics.html                 # Showcase: Arithmetics DSL
    ├── domainmodel.html                 # Showcase: Domain Model DSL
    ├── minilogo.html                    # Showcase: MiniLogo DSL
    ├── openapi.html                     # Showcase: OpenAPI SL (external link)
    ├── sql.html                         # Showcase: SQL DSL
    └── statemachine.html                # Showcase: State Machine DSL
```

---

### 4.1 Home Page (`_index.html`)

**Path:** `hugo/content/_index.html`  
**URL:** `/`  
**Key front-matter:**
```yaml
title: "Langium"
type: langium
showCommunity: true
description: "Langium is an open source language engineering tool..."
socialImage: "https://langium.org/assets/social-card.jpg"
```

**Sections in the HTML content:**
- `#teaser` — Hero section with headline, description, CTA buttons ("Try it!" → `/playground`, "Learn" → `/docs/learn/workflow/`), parallax background image (`/assets/office.jpg`)
- `#about` — "Why Langium?" section with feature cards (icons from `static/assets/`)
- Feature cards: Simple, Flexible, Versatile, Customizable, Low Barrier, TypeScript, Experience, Everywhere
- Each feature card has light/dark SVG variants (e.g., `simple.svg` / `simple_dark.svg`)
- Community section rendered via `langium-community` partial
- JS animation: GSAP-based parallax and scroll-trigger animations (`/index.js`)

---

### 4.2 Documentation (`/docs`)

#### 4.2.1 Introduction

| File | URL | Title | Weight | Notes |
|------|-----|-------|--------|-------|
| `docs/_index.md` | `/docs` | Documentation | 0 | Redirects → `/docs/introduction/` |
| `docs/introduction/_index.md` | `/docs/introduction` | What is Langium? | -100 | Entry point, links to all sub-sections |
| `docs/introduction/features.md` | `/docs/features` | Features | 200 | Full feature walkthrough |
| `docs/introduction/showcases.md` | `/docs/introduction/showcases` | Showcases | 300 | Redirects → `/showcase` |
| `docs/introduction/playground.md` | `/docs/introduction/playground` | Try it out! | 400 | Redirects → `/playground` |

#### 4.2.2 Learn → Workflow

The workflow section is the primary getting-started path, structured as a 7-step flowchart rendered with a **Mermaid** diagram via the `{{<mermaid>}}` shortcode (provided by hugo-geekdoc theme).

| File | URL | Title | Weight | Notes |
|------|-----|-------|--------|-------|
| `learn/workflow/_index.md` | `/docs/learn/workflow` | Langium's workflow | 0 | Alias: `/docs/getting-started` |
| `learn/workflow/install.md` | `/docs/learn/workflow/install` | 1. Install Yeoman | 200 | |
| `learn/workflow/scaffold.md` | `/docs/learn/workflow/scaffold` | 2. Scaffold a Langium project | 300 | |
| `learn/workflow/write_grammar.md` | `/docs/learn/workflow/write_grammar` | 3. Write the grammar | 400 | |
| `learn/workflow/generate_ast.md` | `/docs/learn/workflow/generate_ast` | 4. Generate the AST | 500 | |
| `learn/workflow/resolve_cross_references.md` | `/docs/learn/workflow/resolve_cross_references` | 5. Resolve cross-references | 600 | |
| `learn/workflow/create_validations.md` | `/docs/learn/workflow/create_validations` | 6. Create validations | 700 | |
| `learn/workflow/generate_everything.md` | `/docs/learn/workflow/generate_everything` | 7. Generate artifacts | 800 | |

#### 4.2.3 Learn → MiniLogo Tutorial

7-part tutorial series teaching Langium from scratch via the MiniLogo language.

| File | URL | Title | Weight | Aliases |
|------|-----|-------|--------|---------|
| `learn/minilogo/_index.md` | `/docs/learn/minilogo` | Minilogo tutorial | 200 | |
| `learn/minilogo/writing_a_grammar.md` | `/docs/learn/minilogo/writing_a_grammar` | Writing a Grammar | 0 | `/tutorials/writing_a_grammar`, `/writing_a_grammar` |
| `learn/minilogo/validation.md` | `/docs/learn/minilogo/validation` | Validation | 1 | `/tutorials/validation` |
| `learn/minilogo/customizing_cli.md` | `/docs/learn/minilogo/customizing_cli` | Customizing the CLI | 2 | `/tutorials/customizing_cli` |
| `learn/minilogo/generation.md` | `/docs/learn/minilogo/generation` | Generation | 3 | `/tutorials/generation` |
| `learn/minilogo/building_an_extension/_index.md` | `/docs/learn/minilogo/building_an_extension` | Building an Extension | 5 | `/tutorials/building_an_extension` |
| `learn/minilogo/langium_and_monaco.md` | `/docs/learn/minilogo/langium_and_monaco` | Langium and Monaco | 6 | `/tutorials/langium_and_monaco` |
| `learn/minilogo/generation_in_the_web.md` | `/docs/learn/minilogo/generation_in_the_web` | Generation in the Web | 7 | `/tutorials/generation_in_the_web` |

Images co-located in `building_an_extension/` folder: `icon.png`, `installed-extension.jpg`, `minilogo-vsix.jpg`, `minilogo-with-icon.png`, `vsix-install.jpg`, `vsix-installed.jpg`.

#### 4.2.4 Recipes

Recipes are practical guides for common Langium tasks.

**Top-level recipe pages (direct children of `docs/recipes/`):**

| File | URL | Title | Weight | Aliases |
|------|-----|-------|--------|---------|
| `recipes/_index.md` | `/docs/recipes` | Recipes | 400 | Also links to Typir, Langium-SQL, Xtext-to-Langium |
| `recipes/builtin-library.md` | `/docs/recipes/builtin-library` | Builtin Libraries | 200 | |
| `recipes/code-bundling.md` | `/docs/recipes/code-bundling` | Code Bundling | 900 | `/guides/code-bundling` |
| `recipes/formatting.md` | `/docs/recipes/formatting` | Formatting | 300 | |
| `recipes/multiple-languages.md` | `/docs/recipes/multiple-languages` | Multiple dependent languages | 400 | |

**Recipe sub-sections:**

| Section | Parent URL | Child Pages | Weight |
|---------|-----------|-------------|--------|
| `lexing/` | `/docs/recipes/lexing` | case-insensitive-languages, indentation-sensitive-languages | 50 |
| `keywords-as-identifiers/` | `/docs/recipes/keywords-as-identifiers` | _(images only, content in `_index.md`)_ | 300 |
| `validation/` | `/docs/recipes/validation` | dependency-loops | 150 |
| `performance/` | `/docs/recipes/performance` | caches | 175 |
| `scoping/` | `/docs/recipes/scoping` | class-member, file-based, qualified-name | 100 |

**Scoping pages with notable aliases:**
- `scoping/class-member.md` → aliases: `/class-member`
- `scoping/qualified-name.md` → aliases: `/qualified-name`

Images in `recipes/keywords-as-identifiers/`: `problem.png`, `fixed-1-grammar.png`, `fixed-2-token.png`, `fixed-3-style-1.png`, `fixed-3-style-2.png`.

#### 4.2.5 Reference

| File | URL | Title | Weight | Aliases |
|------|-----|-------|--------|---------|
| `reference/_index.md` | `/docs/reference` | Reference | 300 | |
| `reference/glossary.md` | `/docs/reference/glossary` | Glossary | 50 | |
| `reference/configuration-services.md` | `/docs/reference/configuration-services` | Configuration via Services | 200 | |
| `reference/document-lifecycle.md` | `/docs/reference/document-lifecycle` | Document Lifecycle | 300 | `/docs/document-lifecycle` |
| `reference/semantic-model.md` | `/docs/reference/semantic-model` | Semantic Model Inference | 400 | `/sematic-model` (typo!), `/semantic-model` |
| `reference/grammar-language/_index.md` | `/docs/reference/grammar-language` | Grammar Language | 100 | `/grammar-language`, `/docs/grammar-language` |
| `reference/grammar-language/infix-operators/_index.md` | `/docs/reference/grammar-language/infix-operators` | Infix Operators | 125 | |
| `reference/grammar-language/infix-operators/manual-implementation.md` | `/docs/reference/grammar-language/infix-operators/manual-implementation` | Manual Implementation | — | |
| `reference/grammar-language/infix-operators/syntactical-implementation.md` | `/docs/reference/grammar-language/infix-operators/syntactical-implementation` | Syntactical Implementation | — | |

Note: `grammar-language/_index.md` uses `{{< toc format=html >}}` shortcode for inline table of contents.

---

### 4.3 Playground (`/playground`)

**Path:** `hugo/content/playground/_index.html`  
**URL:** `/playground`  
**Type:** `playground` (custom layout)  
**Key front-matter:**
```yaml
title: "Playground"
weight: 400
type: playground
layout: index
url: "/playground"
noMain: true
playground: true
```

The playground is a full-screen, 3-panel Monaco editor:
- Left panel: **Grammar** editor (Langium grammar language)
- Middle panel: **Content** editor (instance of the defined language)
- Right panel: **Syntax tree** viewer (collapsible, toggleable via `#treeButton`)

**Source files in `hugo/content/playground/`:**
| File | Role |
|------|------|
| `langium-worker.ts` | Langium language server (bundled to `static/playground/libs/worker/langiumServerWorker.js`) |
| `user-worker.ts` | User grammar language server (bundled to `static/playground/libs/worker/userServerWorker.js`) |
| `common.ts` | Shared module: `addMonacoStyles`, `setupPlayground`, `share`, `overlay`, `getPlaygroundState` (bundled as ESM to `common.js`) |
| `constants.ts` | Playground constants |
| `types.ts` | TypeScript type definitions |
| `utils.ts` | Utility functions |
| `worker-utils.ts` | Worker communication utilities |
| `preprocess.ts` | Grammar preprocessing |
| `user-validator.ts` | User grammar validation |
| `Tree.tsx` | React component for AST tree visualization |

**URL sharing:** playground supports sharing state via URL (base64-encoded grammar+content).  
**Preloads:** `common.js`, `langiumServerWorker.js`, `userServerWorker.js`.

---

### 4.4 Showcase (`/showcase`)

**Path:** `hugo/content/showcase/`  
**URL:** `/showcase`  
**Type:** `langium`  
**Layout used by individual showcases:** `showcase-page`

Each showcase page uses `layout: showcase-page` and renders a full-screen Monaco editor that loads a pre-built language server worker.

| File | URL | Title | Weight | Script file | Notes |
|------|-----|-------|--------|-------------|-------|
| `_index.html` | `/showcase` | Langium Showcase | 300 | — | Index/landing page |
| `statemachine.html` | `/showcase/statemachine` | State Machine | 100 | `scripts/statemachine/statemachine.tsx` | Traffic light demo |
| `arithmetics.html` | `/showcase/arithmetics` | Arithmetics | 300 | `scripts/arithmetics/arithmetics.tsx` | Arithmetic DSL demo |
| `minilogo.html` | `/showcase/minilogo` | MiniLogo | 300 | `scripts/minilogo/minilogo.tsx` | Drawing geometric shapes |
| `sql.html` | `/showcase/sql` | SQL | 400 | `scripts/sql/ui.tsx` | Airport schema demo |
| `domainmodel.html` | `/showcase/domainmodel` | Domain Model | 500 | `scripts/domainmodel/domainmodel.tsx` | Blog data model demo |
| `openapi.html` | `/showcase/openapi` | OpenAPI SL | 0 | — | External link (BestSolution), `externalUrl` param |

**Showcase front-matter pattern:**
```yaml
title: "State Machine"
weight: 100
type: langium
layout: showcase-page
url: "/showcase/statemachine"
img: "/assets/Langium_Statemachine.svg"
file: "scripts/statemachine/statemachine.tsx"
description: "..."
geekdochidden: true
draft: false
noMain: true
```

Special field `externalUrl` on `openapi.html` — links to third-party hosted playground instead of local file.

---

### 4.5 API (`/api`)

**Path:** `hugo/content/api/_index.md`  
**URL:** `/api`  
**Redirects to:** `https://eclipse-langium.github.io/langium/` (external TypeDoc API docs)

```yaml
title: "API"
weight: 300
```

---

## 5. Layout System

Hugo uses a "layout type" system. The `type` front-matter field controls which directory in `layouts/` is used.

### 5.1 Layout Types (`type` front-matter field)

| `type` value | Layout directory | Used by |
|-------------|-----------------|---------|
| `langium` | `layouts/langium/` | Home page, showcase pages, most docs content |
| `playground` | `layouts/playground/` | Playground page only |
| _(unset / geekdoc)_ | `layouts/` + geekdoc theme | Standard docs pages |

### 5.2 Base Layouts (`baseof.html`)

**`layouts/langium/baseof.html`** — Main base template for all `langium`-type pages:
- `<!DOCTYPE html>` with `class="dark"` on `<html>`
- Includes partials: `langium-head`, `langium-header`, `langium-footer`, `langium-mobile-menu`, `langium-scripts`
- Body uses `font-mono` class by default; `useRegularFont` front-matter param switches to `dark:text-gray-100`
- `noMain` front-matter param — skips `<main>` wrapper (used by full-screen showcase/playground pages)
- Alpine.js `x-data="{ isOpen: false }"` on wrapper div (mobile menu state)

**`layouts/playground/baseof.html`** — Playground-specific base:
- Full-screen CSS grid layout (`height: 100%`, `width: 100%`)
- 3-column grid: grammar | content | AST tree
- Responsive: collapses to single column on mobile/small screens
- Inline styles for the Monaco editor panels
- `#ast-body` positioned absolutely (z-index: 1000000)
- Includes same header/footer/mobile-menu/scripts partials as langium baseof

### 5.3 Page Layouts

| File | Template name | Purpose |
|------|--------------|---------|
| `layouts/langium/index.html` | `index` | Home page — renders `.Content` + `langium-community` partial |
| `layouts/langium/list.html` | `list` | Section list pages |
| `layouts/langium/single.html` | `single` | Single content pages (e.g., imprint) |
| `layouts/langium/showcase-page.html` | `showcase-page` | Full-screen showcase editor; loads `file` front-matter TSX script via Hugo asset pipeline + Babel + esbuild |
| `layouts/playground/index.html` | `index` (playground) | Renders playground content (empty `define "main"`) |

**`showcase-page.html`** loads JavaScript dynamically:
```html
{{ if .Params.file }}
  {{- $jsFile := resources.Get .Params.file | resources.ExecuteAsTemplate .Params.file . | babel | js.Build -}}
  <script src="{{ $jsFile.RelPermalink }}"></script>
{{ end }}
```
The TSX file is processed: `resources.Get` → `ExecuteAsTemplate` → `babel` → `js.Build`.

### 5.4 Partials

All partials are in `layouts/partials/` with the `langium-` prefix.

| File | Purpose |
|------|---------|
| `langium-head.html` | `<head>` — meta tags, OG/Twitter cards, favicons, CSS links, Google Fonts |
| `langium-header.html` | Site header — logo, hamburger button (mobile), nav |
| `langium-nav.html` | Desktop navigation links |
| `langium-footer.html` | Footer — Eclipse Foundation links, copyright |
| `langium-community.html` | "Join the Community" section — npm + GitHub icons |
| `langium-mobile-menu.html` | Mobile slide-out navigation menu |
| `langium-scripts.html` | Script tags — Alpine.js, GSAP suite, `/index.js` |

**`langium-head.html` loads:**
- `/css/style.css` (TailwindCSS output)
- Google Fonts: Roboto Condensed (weight 300)
- `custom.css` (via `site.Data.assets` — hashed filename)
- Favicons: `nib.svg` (SVG, apple-touch-icon), `32px.png`, `16px.png`

**`langium-scripts.html` loads (CDN):**
- Alpine.js `3.4.2` (deferred)
- GSAP `3.8.0` core, Draggable, ScrollToPlugin, ScrollTrigger
- `/index.js` (local — contains scroll animations for home page)

**`langium-nav.html` links:**
- Documentation → `/docs/`
- Showcase → `/showcase/`
- Playground → `/playground/`
- API → `https://eclipse-langium.github.io/langium/` (external)
- Support → `https://www.typefox.io/language-engineering/` (external, highlighted in `emeraldLangium` color)
- GitHub icon → `https://github.com/eclipse-langium/langium`

### 5.5 Shortcodes

| File | Usage | Output |
|------|-------|--------|
| `layouts/shortcodes/notification.html` | `{{< notification >}}...{{< /notification >}}` | Yellow warning box with ⚠️ emoji |
| `{{< mermaid >}}` | Built-in from hugo-geekdoc theme | Renders Mermaid.js diagrams |
| `{{< toc format=html >}}` | Built-in from hugo-geekdoc theme | Inline table of contents |

---

## 6. Theme: hugo-geekdoc

**Location:** `hugo/themes/hugo-geekdoc/`

The hugo-geekdoc theme provides:
- Left sidebar navigation (collapsible sections, controlled by `geekdocCollapseSection`)
- Built-in shortcodes: `mermaid`, `toc`, `hint`, `columns`, etc.
- Search functionality (`hugo-geekdoc/assets/search-data.json`)
- Pagination and "edit page" links
- Archetype: `hugo-geekdoc/archetypes/docs.md` and `posts.md`

Docs pages that use geekdoc layout (i.e., standard markdown docs under `/docs/`) use the theme's sidebar automatically when `type` is not set to `langium` or `playground`.

---

## 7. Static Assets (`hugo/static/`)

All files in `hugo/static/` are copied as-is to the build output root.

### Images (`static/assets/`)

| File | Used in |
|------|---------|
| `langium_logo_w_nib.svg` | Site logo (header), geekdocLogo config |
| `nib.svg` | Favicon, community section divider |
| `office.jpg` | Home page teaser background |
| `social-card.jpg` / `social-card.svg` | OG/Twitter card image |
| `GitHub-Mark-120px-plus.png` | Header nav, community section |
| `GitHub-Mark-Light-120px-plus.png` | Header nav (light variant), community |
| `npm-square-red-1.svg` | Community section |
| `Langium_Statemachine.svg` | Showcase card |
| `Langium_Arithmetics.svg` | Showcase card |
| `Langium_Domainmodel.svg` | Showcase card |
| `Langium_MiniLogo.svg` | Showcase card |
| `Langium_SQL.svg` | Showcase card |
| `BestSolution_OpenAPI.svg` | Showcase card (OpenAPI, external) |
| `simple.svg` / `simple_dark.svg` | "Why Langium?" feature cards |
| `Flexible.svg` / `Flexible_dark.svg` | Feature card |
| `Versatile.svg` / `Versatile_dark.svg` | Feature card |
| `Customize.svg` / `Customize_dark.svg` | Feature card |
| `low barrier.svg` / `low barrier_dark.svg` | Feature card (note: space in filename!) |
| `TypeScript.svg` / `TypeScript_dark.svg` | Feature card |
| `experience.svg` / `experience_dark.svg` | Feature card |
| `everywere.png` / `everywere_dark.png` | Feature card (note: typo "everywere") |
| `dependency-loops.png` | Recipes › Validation › Dependency Loops |
| `carousel-left-dark.svg` / `carousel-left-light.svg` | Showcase carousel arrows |
| `carousel-right-dark.svg` / `carousel-right-light.svg` | Showcase carousel arrows |
| `checkmark.svg` | General use |
| `clear.svg` / `clear_dark.svg` | Playground clear button |
| `external_link.svg` | External link indicator |
| `scroll-down.svg` | Home page scroll indicator |
| `share.svg` | Playground share button |
| `tree.svg` | Playground "toggle syntax tree" button |

### CSS

| File | Notes |
|------|-------|
| `static/custom.css` | Custom CSS overrides (referenced via Hugo asset fingerprinting) |
| _(generated)_ `static/css/style.css` | TailwindCSS output (not committed, generated by `tailwind` workspace) |

### JavaScript

| File | Notes |
|------|-------|
| `static/index.js` | GSAP scroll animations for the home page |
| `static/prism/prism.js` | Prism.js syntax highlighter |
| `static/prism/prism.css` | Prism.js styles |
| `static/prism/langium-prism.js` | Langium grammar definition for Prism |

### Favicons

| File | Notes |
|------|-------|
| `static/favicon/16px.png` | 16×16 favicon |
| `static/favicon/32px.png` | 32×32 favicon |

---

## 8. Hugo Assets — Frontend Scripts (`hugo/assets/scripts/`)

These TypeScript/TSX files are the frontend scripts for the showcase pages. They are processed by Hugo's asset pipeline (via `babel` + `js.Build`) during `hugo build`.

```
hugo/assets/scripts/
├── arithmetics/
│   ├── arithmetics.tsx         # Main React component for Arithmetics showcase
│   └── arithmetics-tools.tsx   # Tool helpers
├── domainmodel/
│   ├── domainmodel.tsx         # Main React component
│   ├── domainmodel-tools.ts    # Tool helpers
│   └── d3tree.tsx              # D3.js tree visualization for domain model
├── minilogo/
│   ├── minilogo.tsx            # Main React component
│   └── minilogo-tools.ts       # Tool helpers (canvas drawing)
├── sql/
│   ├── ui.tsx                  # Main React component for SQL showcase
│   ├── language-server.ts      # SQL language server setup
│   ├── constants.ts            # SQL constants
│   └── sql.tmLanguage.json     # TextMate grammar for SQL syntax highlighting
└── statemachine/
    ├── statemachine.tsx        # Main React component
    └── statemachine-tools.ts   # Tool helpers (state machine simulation)
```

**Tech stack:** React 18, TypeScript, Monaco editor, Langium DSL npm packages.

**Language server workers** are pre-built by the `hugo` workspace's `build:static` script using `esbuild`:
- `langium-statemachine-dsl` → `static/showcase/libs/worker/statemachineServerWorker.js`
- `langium-arithmetics-dsl` → `static/showcase/libs/worker/arithmeticsServerWorker.js`
- `langium-domainmodel-dsl` → `static/showcase/libs/worker/domainmodelServerWorker.js`
- `langium-minilogo` → `static/showcase/libs/worker/minilogoServerWorker.js`
- SQL language server (local) → `static/showcase/libs/worker/sqlServerWorker.js`
- Playground Langium worker → `static/playground/libs/worker/langiumServerWorker.js`
- Playground user worker → `static/playground/libs/worker/userServerWorker.js`
- Playground common module → `static/playground/libs/worker/common.js` (ESM)
- Monaco editor workers → `static/libs/monaco-editor-workers/`

---

## 9. TailwindCSS Styling (`tailwind/`)

**Path:** `old-website/tailwind/`

| File | Purpose |
|------|---------|
| `tailwind.config.js` | TailwindCSS configuration |
| `style.css` | Input CSS with `@tailwind` directives |
| `package.json` | Dependencies: TailwindCSS 3.2.4, autoprefixer, postcss |
| `README.md` | Brief note about TailwindCSS usage |

**Build output:** `hugo/static/css/style.css`

**Content scan paths** (for purging unused classes):
```
../hugo/layouts/**/*.html
../hugo/content/**/*.html
../hugo/content/**/*.ts
../hugo/content/**/*.tsx
../hugo/static/**/*.html
../hugo/static/**/*.js
../hugo/assets/scripts/**/*.tsx
```

**Dark mode:** `class` strategy (toggle `dark` class on `<html>`)

**Custom colors (brand palette):**
| Token | Hex | Usage |
|-------|-----|-------|
| `emeraldLangium` | `#26888C` | Primary brand color, nav highlights, CTAs |
| `emeraldLangiumABitDarker` | `#207578` | Hover states |
| `emeraldLangiumDarker` | `#0A4340` | Darker tones |
| `emeraldLangiumDarkest` | `#042424` | Teaser BG dark mode |
| `accentBlue` | `#1FCDEB` | Accent (Node.js references) |
| `accentRed` | `#8c2626` | Accent red |
| `accentGreen` | `#B6F059` | Accent (LSP references) |
| `accentViolet` | `#D568E7` | Accent (TypeScript references) |
| `accentLightBlue` | `#BCDBEF` | Light accent |

**Custom fonts:**
- Mono: `Menlo, ui-monospace, SFMono-Regular, Monaco, Consolas, Liberation Mono, Courier New, monospace` → `font-mono`
- Body: `Roboto Condensed, sans-serif` → `font-body` (loaded from Google Fonts)

**Custom spacing:**
| Token | Value |
|-------|-------|
| `192` | `48rem` |
| `120` | `30rem` |
| `teaser` | `calc(100vh - 96px)` |

---

## 10. Core Package (`core/`)

**Path:** `old-website/core/`

Provides the Monaco editor wrapper utilities used by showcase and playground pages.

| File | Purpose |
|------|---------|
| `src/index.ts` | Main export: `createUserConfig` function |
| `src/monaco-editor-wrapper-utils.ts` | Monaco editor wrapper utilities |
| `vite.bundle.ts` | Vite config for bundling |
| `package.json` | Dependencies, exports |

**Key dependencies:**
- `monaco-editor-wrapper` ~3.3.0
- `@typefox/monaco-editor-react` 2.3.0
- `monaco-languageclient` ~6.6.0
- `react` ~18.2.0
- `vscode` (polyfilled via `@codingame/monaco-vscode-api`)

**Exports:**
- `.` → `dist/index.js` (TypeScript types + JS)
- `./bundle` → `bundle/monaco-editor-wrapper-bundle/index.js` (pre-bundled)

---

## 11. Navigation & Footer

### Top Navigation (Desktop)

Rendered by `layouts/partials/langium-nav.html`:

| Label | URL | Notes |
|-------|-----|-------|
| Documentation | `/docs/` | Internal |
| Showcase | `/showcase/` | Internal |
| Playground | `/playground/` | Internal |
| API | `https://eclipse-langium.github.io/langium/` | External (TypeDoc) |
| Support | `https://www.typefox.io/language-engineering/` | External, highlighted green |
| GitHub icon | `https://github.com/eclipse-langium/langium` | External, opens in new tab |

Mobile navigation is rendered by `langium-mobile-menu.html` (Alpine.js powered slide-out).

### Footer

Rendered by `layouts/partials/langium-footer.html`:

| Link | URL |
|------|-----|
| About | `https://projects.eclipse.org/projects/ecd.langium/` |
| Privacy Policy | `http://www.eclipse.org/legal/privacy.php` |
| Terms of Use | `http://www.eclipse.org/legal/termsofuse.php` |
| Copyright Agent | `http://www.eclipse.org/legal/copyright.php` |
| Eclipse Foundation | `https://www.eclipse.org/org/` |

Copyright: `© 2024 by Eclipse Foundation`

---

## 12. URL Aliases & Redirects

Hugo `aliases` front-matter creates redirect pages. These are important for migration to preserve backward compatibility.

| Old/Alias URL | Canonical URL | File |
|--------------|---------------|------|
| `/docs/getting-started` | `/docs/learn/workflow` | `learn/workflow/_index.md` |
| `/grammar-language` | `/docs/reference/grammar-language` | `reference/grammar-language/_index.md` |
| `/docs/grammar-language` | `/docs/reference/grammar-language` | `reference/grammar-language/_index.md` |
| `/docs/document-lifecycle` | `/docs/reference/document-lifecycle` | `reference/document-lifecycle.md` |
| `/sematic-model` (typo!) | `/docs/reference/semantic-model` | `reference/semantic-model.md` |
| `/semantic-model` | `/docs/reference/semantic-model` | `reference/semantic-model.md` |
| `/class-member` | `/docs/recipes/scoping/class-member` | `recipes/scoping/class-member.md` |
| `/qualified-name` | `/docs/recipes/scoping/qualified-name` | `recipes/scoping/qualified-name.md` |
| `/guides/code-bundling` | `/docs/recipes/code-bundling` | `recipes/code-bundling.md` |
| `/tutorials/writing_a_grammar` | `/docs/learn/minilogo/writing_a_grammar` | `minilogo/writing_a_grammar.md` |
| `/writing_a_grammar` | `/docs/learn/minilogo/writing_a_grammar` | `minilogo/writing_a_grammar.md` |
| `/tutorials/validation` | `/docs/learn/minilogo/validation` | `minilogo/validation.md` |
| `/tutorials/customizing_cli` | `/docs/learn/minilogo/customizing_cli` | `minilogo/customizing_cli.md` |
| `/tutorials/generation` | `/docs/learn/minilogo/generation` | `minilogo/generation.md` |
| `/tutorials/generation_in_the_web` | `/docs/learn/minilogo/generation_in_the_web` | `minilogo/generation_in_the_web.md` |
| `/tutorials/langium_and_monaco` | `/docs/learn/minilogo/langium_and_monaco` | `minilogo/langium_and_monaco.md` |
| `/tutorials/building_an_extension` | `/docs/learn/minilogo/building_an_extension` | `minilogo/building_an_extension/_index.md` |

**Meta-redirect pages** (HTTP `<meta>` refresh, not Hugo aliases):

| URL | Redirects to |
|-----|-------------|
| `/docs` | `/docs/introduction/` |
| `/docs/learn` | `/docs/learn/workflow/` |
| `/docs/introduction/showcases` | `/showcase` |
| `/docs/introduction/playground` | `/playground` |
| `/api` | `https://eclipse-langium.github.io/langium/` |

---

## 13. CI/CD Workflows

**Path:** `old-website/.github/workflows/`

### `deploy.yml` — GitHub Pages Deployment

Triggered on push to `main` or manually.

Steps:
1. `actions/setup-node@v4` — Node.js 18
2. `actions/checkout@v4`
3. `actions/configure-pages@v4`
4. Build: `npm install && npm run build` (env: `HUGO_ENVIRONMENT=production`)
5. Upload artifact: `actions/upload-pages-artifact@v3` (path: `./public`)
6. Deploy: `actions/deploy-pages@v4`

Permissions: `contents: read`, `pages: write`, `id-token: write`.  
Concurrency group: `"pages"` (no cancellation of in-progress).

### `check-links.yml` — Link Checker

Triggered on push/PR to `main` or manually.

Steps:
1. `actions/setup-node@v4`
2. `actions/checkout@v4`
3. `npm install`
4. `npm run check:links` (runs `scripts/check-links.ts` via `ts-node`)

---

## 14. Key Front-Matter Fields Reference

Quick-reference for all front-matter fields used across the Hugo content.

| Field | Type | Purpose |
|-------|------|---------|
| `title` | string | Page title, shown in sidebar and `<title>` |
| `weight` | int | Sort order in navigation (lower = first) |
| `type` | string | Layout type: `langium`, `playground`, or unset (geekdoc) |
| `layout` | string | Specific layout template: `index`, `showcase-page` |
| `url` | string | Override canonical URL |
| `aliases` | list | Additional URLs that redirect to this page |
| `draft` | bool | `true` = not published in production |
| `description` | string | Meta description, OG description |
| `socialImage` | string | OG/Twitter card image URL |
| `noMain` | bool | Skip `<main>` wrapper (full-screen pages) |
| `playground` | bool | Flag for playground page |
| `showCommunity` | bool | Show community section (home page) |
| `useRegularFont` | bool | Use body font instead of mono |
| `geekdochidden` | bool | Hide from geekdoc sidebar navigation |
| `img` | string | Showcase card image path |
| `file` | string | Showcase TSX script path (relative to `assets/`) |
| `externalUrl` | string | External URL for showcase (instead of local) |

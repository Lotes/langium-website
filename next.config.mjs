import nextra from 'nextra'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withNextra = nextra({
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      // Register the custom Langium TextMate grammar for Shiki syntax highlighting
      langs: [
        {
          id: 'langium',
          scopeName: 'source.langium',
          grammar: require('./public/langium.tmLanguage.json'),
        },
      ],
    },
  },
})

export default withNextra({
  output: 'export',           // Static HTML export for GitHub Pages
  trailingSlash: true,        // Matches old Hugo URL style
  // Custom loader prepends NEXT_PUBLIC_BASE_PATH to every <Image src="/...">
  // so images resolve correctly on sub-path GitHub Pages deployments.
  // NOTE: images.unoptimized:true would bypass the loader entirely and omit
  // basePath from image URLs — use this loaderFile instead (see PLAN.md §5.1).
  images: { loader: 'custom', loaderFile: './imageLoader.ts' },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Note: redirects() is not supported with output: 'export'.
  // Hugo alias redirects are handled via static stub pages — see §14 (Phase 10).
  webpack(config) {
    // Ensure next-mdx-import-source-file resolves to our mdx-components.tsx.
    // Nextra sets this alias via private-next-root-dir, but that chain only works
    // once Next.js has registered its own private-next-root-dir alias. Adding an
    // explicit absolute path here guarantees resolution in all webpack configs.
    config.resolve.alias['next-mdx-import-source-file'] = path.resolve(__dirname, 'mdx-components.tsx')
    return config
  },
})

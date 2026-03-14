import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
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
})

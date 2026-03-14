import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
})

export default withNextra({
  output: 'export',           // Static HTML export for GitHub Pages
  trailingSlash: true,        // Matches old Hugo URL style
  images: { unoptimized: true }, // Required for static export
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Note: redirects() is not supported with output: 'export'.
  // Hugo alias redirects are handled via static stub pages — see §14 (Phase 10).
})

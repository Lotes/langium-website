import type { ImageLoaderProps } from 'next/image'

/**
 * Custom Next.js image loader that prepends NEXT_PUBLIC_BASE_PATH to all
 * absolute asset paths.
 *
 * IMPORTANT (see migration/PLAN.md §5.1 / §12):
 * With `output: 'export'`, the built-in `images.unoptimized: true` flag causes
 * the Image component to use `src` as-is — the Next.js runtime never applies
 * `basePath` to image URLs.  Replacing it with this custom loader is the only
 * way to ensure every `<Image src="/assets/...">` resolves correctly on
 * sub-path GitHub Pages deployments (e.g. /langium-website/... or
 * /langium-website/pr-preview/pr-N/...).
 *
 * NEXT_PUBLIC_BASE_PATH is a public env var that Next.js embeds in the bundle
 * at build time, so the value is statically inlined into the generated CSS/JS.
 *
 * NOTE: webpack-processed image imports (e.g. relative or absolute paths in MDX
 * files that become JS module imports) are placed under /_next/static/media/ by
 * Next.js.  Webpack's asset module pipeline already injects basePath into those
 * URLs before the imageLoader is called, so the `src` received here already
 * contains the basePath prefix (e.g. "/base/_next/static/media/image.hash.jpg").
 * Prepending basePath a second time would double the prefix.  We detect this by
 * checking whether the path already contains "/_next/" anywhere in it.
 */
export default function imageLoader({ src }: ImageLoaderProps): string {
  // Leave external URLs (https://...), data URIs, and relative paths untouched.
  if (!src.startsWith('/')) {
    return src
  }
  // Webpack-processed assets always route through /_next/static/ regardless of
  // whether basePath is set — webpack injects basePath before this loader runs,
  // so the path may look like "/base/_next/..." rather than "/_next/...".
  // In both cases the path contains "/_next/" — skip adding basePath again.
  if (src.includes('/_next/')) {
    return src
  }
  // Public-directory assets (/assets/..., /docs/..., etc.) are NOT processed by
  // webpack; they need the basePath prepended explicitly.
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${src}`
}

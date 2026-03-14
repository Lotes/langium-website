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
 */
export default function imageLoader({ src }: ImageLoaderProps): string {
  // Only prepend basePath to absolute paths that reference public/ assets.
  // Leave external URLs (https://...) and data URIs untouched.
  if (!src.startsWith('/')) {
    return src
  }
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${src}`
}

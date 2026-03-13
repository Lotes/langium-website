/**
 * NOTE: In Nextra 4.x (App Router), there is no root `theme.config.tsx`.
 * The docs layout is configured in `app/docs/layout.tsx` via the `<Layout>` component
 * from `nextra-theme-docs`. This file is kept as a reference for the layout props
 * to be used in Phase 5 (Documentation).
 *
 * Docs layout config (to be moved to `app/docs/layout.tsx` in Phase 5):
 *
 * import { Layout } from 'nextra-theme-docs'
 * import { Header } from '@/components/Header'
 * import { Footer } from '@/components/Footer'
 *
 * export default function DocsLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <Layout
 *       docsRepositoryBase="https://github.com/eclipse-langium/langium-website/blob/lotes/nextra"
 *       editLink="Edit this page on GitHub"
 *       feedback={{ content: null }}
 *       sidebar={{ defaultMenuCollapseLevel: 1, autoCollapse: true }}
 *       toc={{ backToTop: 'Back to top' }}
 *       darkMode={true}
 *       nextThemes={{ defaultTheme: 'dark' }}
 *       navbar={{ component: <Header /> }}
 *       footer={<Footer />}
 *     >
 *       {children}
 *     </Layout>
 *   )
 * }
 */

export {}


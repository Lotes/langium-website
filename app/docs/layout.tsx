import { Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import type { ReactNode } from 'react'

export default async function DocsLayout({ children }: { children: ReactNode }) {
  return (
    // docs-layout provides a CSS targeting hook so globals.css can override
    // the root layout's body font-mono with a sans-serif font.
    <div className="docs-layout">
      <Layout
        pageMap={await getPageMap('/docs')}
        docsRepositoryBase="https://github.com/eclipse-langium/langium-website/blob/lotes/nextra"
        editLink="Edit this page on GitHub"
        feedback={{ content: null }}
        sidebar={{ defaultMenuCollapseLevel: 1, autoCollapse: true }}
        toc={{ backToTop: 'Back to top' }}
        darkMode={true}
        nextThemes={{ defaultTheme: 'dark' }}
        copyPageButton={false}
      >
        {children}
      </Layout>
    </div>
  )
}

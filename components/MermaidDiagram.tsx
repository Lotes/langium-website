'use client'

import { useEffect, useRef } from 'react'

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' })
      if (ref.current) {
        mermaid.render('mermaid-diagram', chart).then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg
          }
        })
      }
    })
  }, [chart])

  return <div ref={ref} />
}

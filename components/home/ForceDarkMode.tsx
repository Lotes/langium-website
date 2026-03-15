'use client'

import { useEffect } from 'react'

/**
 * Forces the `dark` Tailwind class onto `<html>` while the home page is mounted.
 * This overrides any theme stored by next-themes from a previous docs-page visit.
 * When the user navigates to /docs/**, Nextra's ThemeProvider will take over and
 * restore the user's own theme preference.
 */
export function ForceDarkMode() {
  useEffect(() => {
    const el = document.documentElement
    const hadDark = el.classList.contains('dark')
    const hadLight = el.classList.contains('light')
    el.classList.add('dark')
    el.classList.remove('light')
    return () => {
      // Restore the previous state so the next page can apply its own theme cleanly.
      if (!hadDark) el.classList.remove('dark')
      if (hadLight) el.classList.add('light')
    }
  }, [])

  return null
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header
        id="website-header"
        className="sm:sticky top-0 z-50 bg-white dark:bg-gray-900 font-mono
                   flex justify-between items-center px-4 py-6 sm:px-6 md:space-x-10"
      >
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link href="/#">
            <Image
              src="/assets/langium_logo_w_nib.svg"
              alt="Langium"
              width={120}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="-mr-2 -my-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="dark:text-gray-100 rounded-md p-2 inline-flex items-center
                       justify-center text-gray-400 hover:text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open menu</span>
            {/* Heroicon: outline/menu */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="items-center hidden space-x-10 md:flex text-gray-900
                        dark:text-gray-100 lg:px-12">
          <Link href="/docs/" className="nav-link-desktop">Documentation</Link>
          <Link href="/showcase/" className="nav-link-desktop">Showcase</Link>
          <Link href="/playground/" className="nav-link-desktop">Playground</Link>
          <a href="https://eclipse-langium.github.io/langium/"
             className="nav-link-desktop">API</a>
          <a href="https://www.typefox.io/language-engineering/"
             className="nav-link-desktop text-emeraldLangium dark:text-emeraldLangium">
            Support
          </a>
          <a className="w-10 h-10" target="_blank" rel="noreferrer"
             href="https://github.com/eclipse-langium/langium">
            <Image
              src="/assets/GitHub-Mark-Light-120px-plus.png"
              alt="GitHub"
              width={40}
              height={40}
            />
          </a>
        </nav>
      </header>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

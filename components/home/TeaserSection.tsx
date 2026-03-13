import Image from 'next/image'
import Link from 'next/link'

export function TeaserSection() {
  return (
    <section id="teaser" className="relative sm:h-teaser">
      <div
        className="teaser-bg absolute top-0 left-0 w-full sm:h-full
                   sm:dark:bg-emeraldLangiumDarkest sm:bg-office bg-fixed
                   bg-blend-multiply bg-cover bg-center bg-no-repeat"
      />
      <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:pt-32 lg:px-8">
        <h2 className="text-center text-2xl tracking-tight sm:text-3xl lg:text-4xl">
          <span className="block lg:inline dark:text-gray-100">Built to bring</span>{' '}
          <span className="block lg:inline dark:text-emeraldLangium">language engineering</span>{' '}
          <span className="block lg:inline dark:text-gray-100">to</span>{' '}
          <span className="ml-10 flex items-center justify-center dark:text-emeraldLangium">
            the next level
            <span className="dark:text-gray-100">_</span>
            <span>
              <Image src="/assets/nib.svg" alt="" width={40} height={40}
                     className="pb-2 h-10 w-10" />
            </span>
          </span>
        </h2>
        <p className="mt-6 max-w-lg mx-auto text-center dark:text-gray-100 sm:max-w-3xl">
          Langium is an open source language engineering tool with first-class support for the{' '}
          <span className="text-accentGreen">Language Server Protocol</span>, written in{' '}
          <span className="text-accentViolet">TypeScript</span> and running in{' '}
          <span className="text-accentBlue">Node.js</span>.
          <br /><br />
          This future-proof technology stack enables domain-specific languages
          <br />
          in VS Code, Eclipse Theia, web applications, and more.
        </p>
      </div>

      <div className="relative sm:flex justify-center items-center pt-10 text-base">
        <div className="mx-2 max-w-sm h-14 sm:max-w-none sm:flex sm:justify-center">
          <Link
            href="/playground/"
            className="rounded-xl flex items-center justify-center px-4 py-3
                       border-2 border-transparent font-medium text-gray-100
                       hover:bg-emeraldLangium border-emeraldLangium bg-emeraldLangium
                       sm:bg-transparent sm:px-8"
          >
            Try it!
          </Link>
        </div>
        <div className="mt-2 sm:mt-0 mx-2 max-w-sm h-14 sm:max-w-none sm:flex sm:justify-center">
          <Link
            href="/docs/learn/workflow/"
            className="rounded-xl flex items-center justify-center px-4 py-3
                       border-2 border-transparent font-medium text-gray-100
                       hover:bg-emeraldLangium border-emeraldLangium bg-emeraldLangium
                       sm:bg-transparent sm:px-8"
          >
            Learn
          </Link>
        </div>
        <div id="scroll-down" className="mx-2 hidden cursor-pointer relative sm:flex">
          <svg
            className="w-14 h-14"
            viewBox="0 0 60 60"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            style={{
              fillRule: 'evenodd',
              clipRule: 'evenodd',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeMiterlimit: 1.5,
            }}
          >
            <g transform="matrix(0.965517,0,0,0.965517,1.03448,1.03448)">
              <circle cx="30" cy="30" r="29" style={{ fill: 'none', stroke: 'white', strokeWidth: '2px' }} />
            </g>
            <g transform="matrix(0.535417,0.535417,-0.535417,0.535417,30,-2.72295)">
              <path d="M14.5,45.5L45.5,45.5L45.5,14.5"
                    style={{ fill: 'none', stroke: 'white', strokeWidth: '3px', strokeLinecap: 'butt', strokeLinejoin: 'miter' }} />
            </g>
            <g transform="matrix(0.535417,0.535417,-0.535417,0.535417,30,-16.4474)">
              <path d="M14.5,45.5L45.5,45.5L45.5,14.5"
                    style={{ fill: 'none', stroke: 'white', strokeWidth: '3px', strokeLinecap: 'butt', strokeLinejoin: 'miter' }} />
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}

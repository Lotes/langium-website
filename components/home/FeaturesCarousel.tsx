'use client'

import Image from 'next/image'

const features = [
  {
    color: 'dark:text-accentViolet',
    title: '_ Simple and direct integration',
    text: (
      <>
        .... with the{' '}
        <a className="external-link" href="https://code.visualstudio.com/api">VS Code extension API</a>
      </>
    ),
  },
  {
    color: 'dark:text-accentBlue',
    title: '_ Well-known technology stack',
    text: (
      <>
        .... implemented in{' '}
        <a className="external-link" href="https://www.typescriptlang.org">TypeScript</a>, runs in{' '}
        <a className="external-link" href="https://nodejs.org/">Node.js</a>
      </>
    ),
  },
  {
    color: 'dark:text-accentGreen',
    title: '_ Proven quality on a next level',
    text: (
      <>
        .... with a grammar declaration language similar to{' '}
        <a className="external-link" href="https://www.eclipse.org/Xtext/">Xtext</a>
      </>
    ),
  },
  {
    color: 'dark:text-accentViolet',
    title: '_ Declarative approach',
    text: '.... derives a parser and abstract syntax tree from a grammar declaration',
  },
  {
    color: 'dark:text-accentBlue',
    title: '_ High performance',
    text: (
      <>
        ... by using{' '}
        <a className="external-link" href="https://chevrotain.io/">Chevrotain</a>
        —the blazing fast parser library—under the hood
      </>
    ),
  },
  {
    color: 'dark:text-accentGreen',
    title: '_ Scale it',
    text: '.... with high out-of-the-box functionality and high extensibility',
  },
]

export function FeaturesCarousel() {
  return (
    <div id="features">
      <div id="features-title-container" className="relative sm:h-80 sm:overflow-hidden">
        <div
          id="features-title"
          className="sm:absolute sm:left-0 pt-16 pb-4 px-6 py-8
                     sm:px-10 sm:pt-16 sm:pb-4 lg:pt-16 lg:pb-4 lg:px-16"
        >
          <h2 className="text-gray-900 dark:text-gray-100 text-2xl tracking-tight
                         sm:text-3xl lg:text-4xl">
            Features
          </h2>
        </div>
      </div>

      <div id="features-content" className="sm:-mt-40">
        <div className="flex h-60 sm:h-44 overflow-hidden">
          {/* Left arrow */}
          <div
            id="features-left"
            className="feature-direction w-120 cursor-pointer sm:w-48 relative sm:overflow-hidden"
          >
            <div className="sm:absolute right-0 h-full w-16 p-2 flex items-center justify-center">
              <Image
                src="/assets/carousel-left-light.svg"
                alt="Previous"
                width={32}
                height={32}
              />
            </div>
          </div>

          {/* Carousel */}
          <div
            id="feature-carussel"
            className="feature-carussel h-full mx-2 w-max overflow-hidden relative flex items-center"
          >
            {features.map((feature, i) => (
              <div key={i} className="feature-item-container">
                <div className="feature-item-content">
                  <h3 className={`mt-6 text-lg font-medium text-gray-100 tracking-tight ${feature.color}`}>
                    {feature.title}
                  </h3>
                  <p className="mt-6 text-base text-gray-1000 dark:text-gray-100 font-body tracking-wide">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <div
            id="features-right"
            className="feature-direction w-120 sm:w-48 cursor-pointer relative sm:overflow-hidden"
          >
            <div className="sm:absolute left-0 h-full w-16 p-2 flex items-center justify-center">
              <Image
                src="/assets/carousel-right-light.svg"
                alt="Next"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

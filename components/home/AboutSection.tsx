import Image from 'next/image'

const aboutItems = [
  {
    icon: '/assets/TypeScript.svg',
    iconHeight: 'h-20',
    title: '_ TypeScript integration',
    text: 'Langium generates a typed abstract syntax tree (AST) definition that perfectly fits your grammar and provides utility functions to help you navigate and process the AST.',
  },
  {
    icon: '/assets/experience.svg',
    iconHeight: 'h-40',
    title: '_ Quality based on experience',
    text: (
      <>
        Langium was developed on the basis of years of practical use of{' '}
        <a className="external-link" href="https://www.eclipse.org/Xtext/">Xtext</a>, which is
        an integral part of numerous projects and products worldwide. We apply this experience
        to push language engineering to a new level.
      </>
    ),
  },
  {
    icon: '/assets/low barrier.svg',
    iconHeight: 'h-32',
    title: '_ Low barrier to entry',
    text: 'The main goal of Langium is to lower the barrier of creating a DSL or low-code platform. We achieve this by providing a special DSL that describes the syntax and structure of your language: the grammar language.',
  },
  {
    icon: '/assets/everywere.png',
    iconHeight: 'h-36',
    title: '_ Your language, everywhere',
    text: 'Built exclusively on web technologies, Langium is not only available for Node.js based environments but works just as well in your browser. When packaged as a language server, you can connect it to most modern IDEs.',
  },
  {
    icon: '/assets/Customize.svg',
    iconHeight: 'h-20',
    title: '_ Lean by default, customizable by design',
    text: 'Exploiting the power of the Language Server Protocol, Langium provides useful default implementations for most features. If you are in need of something special, you can override the defaults with your custom implementation.',
  },
  {
    icon: '/assets/Versatile.svg',
    iconHeight: 'h-40',
    title: '_ Versatile use',
    text: 'You can easily package a Langium-based DSL as a command line interface (CLI) to create a rich set of interconnected tools: validator, interpreter, code generators, service adapters, etc.',
  },
]

export function AboutSection() {
  return (
    <section id="about">
      <div id="about-title-container" className="relative sm:h-80 sm:overflow-hidden">
        <div
          id="about-title"
          className="sm:absolute sm:left-0 pt-16 pb-4 px-6 py-8
                     sm:px-10 sm:pt-16 sm:pb-4 lg:pt-16 lg:pb-4 lg:px-16"
        >
          <h2 className="text-gray-900 dark:text-gray-100 text-2xl tracking-tight
                         sm:text-3xl lg:text-4xl text-center sm:text-left">
            Why Langium?
          </h2>
        </div>
      </div>

      <div
        id="about-content"
        className="sm:-mt-48 grid gap-8 px-16 lg:px-28 sm:px-12
                   grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {aboutItems.map((item) => (
          <div key={item.title} className="about-item-container">
            <div className="about-item">
              <div className="about-item-icon-container">
                <Image
                  src={item.icon}
                  alt=""
                  width={160}
                  height={160}
                  className={item.iconHeight}
                />
              </div>
              <h3 className="about-item-title">{item.title}</h3>
              <div className="item-text">
                <p>{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

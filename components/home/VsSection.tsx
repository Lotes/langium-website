import Image from 'next/image'

export function VsSection() {
  return (
    <>
      <div id="VS">
        <div id="compare-title-container" className="relative sm:h-80 sm:overflow-hidden">
          <div
            id="compare-title"
            className="sm:absolute sm:left-0 pt-20 pb-4 px-6 py-8
                       sm:px-10 sm:pt-20 sm:pb-4 lg:pt-28 lg:pb-4 lg:px-16"
          >
            <h2 className="text-gray-900 dark:text-gray-100 text-2xl tracking-tight
                           sm:text-3xl lg:text-4xl">
              Langium vs. Xtext
            </h2>
          </div>
        </div>

        <p
          id="compare-content"
          className="sm:-mt-40 font-body px-10 lg:px-28 sm:px-12 dark:text-gray-100 font-lg"
        >
          Despite its age, <a className="external-link" href="https://www.eclipse.org/Xtext/">Xtext</a>{' '}
          is still an excellent basis for building languages and related tools with a Java
          technology stack. In recent years, however, the VS Code extension API has become
          increasingly relevant, not only for VS Code itself, but also for other tools that
          support this format, such as{' '}
          <a className="external-link" href="https://theia-ide.org/">Eclipse Theia</a>.
          <br /><br />
          This is why Langium has been created. It enables language engineering in{' '}
          <a className="external-link" href="https://www.typescriptlang.org">TypeScript</a>, the
          same technology used for VS code extensions.
          <br /><br />
          The differences at a glance:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 px-10 lg:px-28 sm:px-40 lg:grid-cols-2">
        <div className="compare-item-container relative h-80 sm:h-120 sm:overflow-hidden">
          <div className="compare-item sm:absolute flow-root px-6">
            <div className="flex items-center justify-center">
              <Image src="/assets/clear.svg" alt="" width={144} height={144}
                     className="mt-8 h-36" />
            </div>
            <h3 className="text-center sm:text-left mt-10 text-lg font-medium
                           text-gray-900 tracking-tight dark:text-gray-100">
              _ Langium is clear
            </h3>
            <div className="item-text sm:mt-10">
              <p>
                Building a tool that uses an Xtext-based language server with VS Code or Theia
                means creating a hybrid technology stack where some parts are implemented in Java
                and others in TypeScript. Developing and maintaining such a mixed code base is
                more challenging for the engineers involved, and long-term maintenance is more
                difficult compared to Langium&apos;s coherent technology stack.
              </p>
            </div>
          </div>
        </div>

        <div className="compare-item-container relative h-80 sm:h-120 sm:overflow-hidden">
          <div className="compare-item sm:absolute flow-root px-6 pb-8">
            <div className="flex items-center justify-center">
              <Image src="/assets/simple.svg" alt="" width={144} height={144}
                     className="mt-8 h-36" />
            </div>
            <h3 className="text-center sm:text-left mt-10 text-lg font-medium
                           text-gray-900 tracking-tight dark:text-gray-100">
              _ Langium is simple
            </h3>
            <div className="item-text sm:mt-10">
              <p>
                Xtext is heavily based on the{' '}
                <a href="https://www.eclipse.org/modeling/emf/">Eclipse Modeling Framework (EMF)</a>.
                This can be an advantage if you want to integrate with other Eclipse modeling
                tools (e.g. <a className="external-link" href="https://www.eclipse.org/sirius/">Sirius</a>),
                but it can also be a burden due to its complexity. Langium uses the simplest
                possible solution to describe an AST (i.e. the parsed contents of a text
                document): TypeScript interfaces. By relying on the built-in language constructs,
                we avoid the additional abstraction layers and steep learning curve of a modeling
                framework.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 sm:py-24 lg:pt-8 lg:pb-10 px-10 lg:px-28 sm:px-12">
        <h3 className="text-gray-900 dark:text-gray-100 tracking-tight text-base
                       text-center md:text-lg lg:text-xl">
          <span className="italic">In short</span>
          <span className="animText">:</span>{' '}
          <span className="animText">Langium</span>{' '}
          <span className="animText">wants</span>{' '}
          <span className="animText">to</span>{' '}
          <span className="animText">keep</span>{' '}
          <span className="animText">the</span>{' '}
          <span className="animText">concepts</span>{' '}
          <span className="animText">that</span>{' '}
          <span className="animText">have</span>{' '}
          <span className="animText">made</span>{' '}
          <span className="animText">Xtext</span>{' '}
          <span className="animText">successful,</span>
          <br />
          <span className="animText">but</span>{' '}
          <span className="animText">lift</span>{' '}
          <span className="animText">them</span>{' '}
          <span className="animText">onto</span>{' '}
          <span className="animText">another</span>{' '}
          <span className="animText">platform.</span>
        </h3>
      </div>
    </>
  )
}

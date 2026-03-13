import Image from 'next/image'

export function CommunitySection() {
  return (
    <>
      {/* Divider with nib icon */}
      <div id="divider">
        <div className="grid place-items-center pt-28 pb-8">
          <Image id="feder" src="/assets/nib.svg" alt="" width={64} height={64}
                 className="h-16 w-16" />
        </div>
      </div>

      {/* Community Section */}
      <div id="community" className="pt-28">
        <div id="community-title"
             className="grid place-items-center dark:text-gray-100 text-xl">
          Join the Community
        </div>
        <div className="flex justify-center items-center">
          <div className="relative grid grid-cols-2 gap-4 h-36">
            <div className="footer-item">
              <a className="absolute pt-10 w-16 h-16" target="_blank" rel="noreferrer"
                 href="https://www.npmjs.com/package/langium">
                <Image src="/assets/npm-square-red-1.svg" alt="npm" width={64} height={64} />
              </a>
            </div>
            <div className="footer-item">
              <a className="absolute pt-10 w-16 h-16" target="_blank" rel="noreferrer"
                 href="https://github.com/eclipse-langium/langium">
                <Image src="/assets/GitHub-Mark-Light-120px-plus.png" alt="GitHub"
                       width={64} height={64} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

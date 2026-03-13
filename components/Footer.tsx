export function Footer() {
  const links = [
    { label: 'About',          href: 'https://projects.eclipse.org/projects/ecd.langium/' },
    { label: 'Privacy Policy', href: 'http://www.eclipse.org/legal/privacy.php' },
    { label: 'Terms of Use',   href: 'http://www.eclipse.org/legal/termsofuse.php' },
    { label: 'Copyright Agent',href: 'http://www.eclipse.org/legal/copyright.php' },
  ]

  return (
    <footer
      id="website-footer"
      className="font-mono block md:flex md:flex-wrap dark:text-gray-100
                 justify-center items-center mt-12 mb-6"
    >
      {links.map((link, i) => (
        <span key={link.label}>
          <div className="px-4 block text-left md:text-center m-4" style={{ width: 180 }}>
            <a href={link.href} className="hover:underline">{link.label}</a>
          </div>
          {i < links.length - 1 && (
            <span className="text-lg hidden md:inline">|</span>
          )}
        </span>
      ))}
      <div className="basis-full h-0" />
      <div className="px-4 block text-left md:text-center">
        © 2024 by{' '}
        <a href="https://www.eclipse.org/org/" target="_blank" rel="noreferrer"
           className="hover:underline">
          Eclipse Foundation
        </a>
      </div>
    </footer>
  )
}

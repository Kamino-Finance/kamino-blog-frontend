import { Link } from 'react-router-dom'
import { KaminoWordmark, SocialGlyph } from '../../design/BrandMarks'
import { RssIcon } from '../../design/icons'
import { CATEGORIES } from '../../content/categories'
import { KAMINO_APP, KAMINO_SITE, KAMINO_DOCS, CONTACT_EMAIL, SOCIAL } from '../../lib/links'

/**
 * Footer — a dark brand band closing every page. Uses `bg-foreground` (the
 * navy ink token) rather than pure black, per house style. Structure is
 * deliberately lighter than the marketing-site footer: blog nav, a couple of
 * product/company columns, feed + socials, legal.
 */
export function BlogFooter() {
  return (
    <footer className="relative mt-[64px] overflow-hidden bg-foreground text-background">
      <div className="mx-auto max-w-[1120px] px-[20px] pb-[40px] pt-[64px] sm:px-[28px] lg:px-[48px]">
        <div className="flex flex-col gap-[48px] md:flex-row md:justify-between">
          <div className="max-w-[300px]">
            <Link to="/" aria-label="Kamino Blog — home" className="inline-block text-background">
              <KaminoWordmark height={26} />
            </Link>
            <p className="mt-[14px] text-[14px] leading-[1.5] text-background/55">
              Product launches, partner stories, and deep dives from the team building onchain finance.
            </p>
            <a
              href="/feed.xml"
              className="mt-[18px] inline-flex items-center gap-[7px] text-[13px] font-medium text-background/70 transition-hover-colors hover:text-background"
            >
              <RssIcon size={15} /> RSS feed
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-[48px] gap-y-[36px] sm:grid-cols-3">
            <FooterCol title="Blog">
              <FooterLink to="/posts">All posts</FooterLink>
              {CATEGORIES.map((c) => (
                <FooterLink key={c.slug} to={`/category/${c.slug}`}>
                  {c.name}
                </FooterLink>
              ))}
            </FooterCol>
            <FooterCol title="Product">
              <FooterA href={KAMINO_APP}>Launch app</FooterA>
              <FooterA href={KAMINO_DOCS}>Docs</FooterA>
            </FooterCol>
            <FooterCol title="Company">
              <FooterA href={KAMINO_SITE}>About</FooterA>
              <FooterA href={CONTACT_EMAIL}>Contact</FooterA>
            </FooterCol>
          </div>
        </div>

        <div className="mt-[56px] flex flex-col gap-[20px] border-t border-background/10 pt-[28px] sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[12.5px] text-background/45">© 2026 Kamino Foundation</span>
          <div className="flex items-center gap-[20px]">
            <Social name="x" href={SOCIAL.x} />
            <Social name="discord" href={SOCIAL.discord} />
            <Social name="telegram" href={SOCIAL.telegram} />
            <Social name="linkedin" href={SOCIAL.linkedin} />
            <Social name="github" href={SOCIAL.github} />
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[13px] font-medium text-background">{title}</div>
      <ul className="mt-[14px] flex flex-col gap-[11px]">{children}</ul>
    </div>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-[13.5px] text-background/60 transition-hover-colors hover:text-background">
        {children}
      </Link>
    </li>
  )
}

function FooterA({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith('http')
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="text-[13.5px] text-background/60 transition-hover-colors hover:text-background"
      >
        {children}
      </a>
    </li>
  )
}

function Social({ name, href }: { name: 'x' | 'discord' | 'telegram' | 'linkedin' | 'github'; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={name}
      className="text-background/55 transition-hover-colors hover:text-background"
    >
      <SocialGlyph name={name} size={17} />
    </a>
  )
}

import { clientEntry, link, type Handle } from 'remix/ui'
import { css } from 'remix/ui'

// ── Finishi logo + wordmark — client entry for SPA navigation ─────────────────
export const FinishiLogoLink = clientEntry(
  import.meta.url + '#FinishiLogoLink',
  function FinishiLogoLink(handle: Handle<{ href: string }>) {
    return () => (
      <a
        href={handle.props.href}
        aria-label="Finishi home"
        mix={[
          link(handle.props.href),
          css({ display: 'inline-flex', textDecoration: 'none' }),
        ]}
      >
        <img src="/logo.svg" alt="Finishi" mix={css({ height: '40px', width: 'auto' })} />
      </a>
    )
  },
)

// ── Nav CTA ───────────────────────────────────────────────────────────────────
export const NavCtaLink = clientEntry(
  import.meta.url + '#NavCtaLink',
  function NavCtaLink(handle: Handle<{ href: string }>) {
    return () => (
      <a
        href={handle.props.href}
        mix={[
          link(handle.props.href),
          css({
            padding: '10px 22px',
            borderRadius: '8px',
            background: 'var(--brand)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 150ms',
            '&:hover': { background: 'var(--brand-dark)' },
            '@media (prefers-color-scheme: dark)': { color: 'var(--text-on-brand)' },
          }),
        ]}
      >
        Join the Waitlist
      </a>
    )
  },
)

// ── Footer plain link ─────────────────────────────────────────────────────────
export const FooterNavLink = clientEntry(
  import.meta.url + '#FooterNavLink',
  function FooterNavLink(handle: Handle<{ href: string; label: string }>) {
    return () => (
      <a
        href={handle.props.href}
        mix={[
          link(handle.props.href),
          css({
            fontSize: '14px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            '&:hover': { color: 'var(--brand)' },
          }),
        ]}
      >
        {handle.props.label}
      </a>
    )
  },
)

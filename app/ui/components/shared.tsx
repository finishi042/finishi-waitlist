import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'
import { FinishiLogoLink } from '../../assets/nav-links.tsx'
import { WaitlistDialog } from '../../assets/waitlist-dialog.tsx'
import { routes } from '../../routes.ts'

// ── Navbar ────────────────────────────────────────────────────────────────────
export function Navbar() {
  return () => (
    <header
      mix={css({
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        background: 'color-mix(in srgb, var(--surface) 95%, transparent)',
        borderBottom: '1px solid var(--border)',
      })}
    >
      <nav
        mix={css({
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          '@media (min-width: 640px)': { padding: '0 24px' },
          '@media (min-width: 1024px)': { padding: '0 48px' },
        })}
        aria-label="Main navigation"
      >
        <FinishiLogoLink href={routes.home.href()} />
        <WaitlistDialog action={routes.waitlistJoin.href()} />
      </nav>
    </header>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge(handle: Handle<{ children: string }>) {
  return () => (
    <span
      mix={css({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '999px',
        border: '1px solid var(--brand)',
        background: 'var(--brand-light)',
        color: 'var(--brand)',
        fontSize: '13px',
        fontWeight: 500,
      })}
    >
      <span aria-hidden="true">✦</span>
      {handle.props.children}
    </span>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
export function Section(
  handle: Handle<{
    children: any
    id?: string
    dark?: boolean
    style?: Record<string, any>
  }>,
) {
  return () => {
    let { children, id, dark = false, style = {} } = handle.props

    return (
      <section
        id={id}
        mix={css({
          width: '100%',
          // When on a dark surface, flip text tokens so content is always readable
          ...(dark
            ? {
                background: 'var(--brand)',
                color: '#FFFFFF',
                '--text-primary': '#FFFFFF',
                '--text-secondary': 'rgba(255,255,255,0.8)',
                '--text-muted': 'rgba(255,255,255,0.6)',
                '--border': 'rgba(255,255,255,0.2)',
                '@media (prefers-color-scheme: dark)': {
                  background: 'var(--brand-dark)',
                },
              }
            : {}),
          ...style,
        })}
      >
        {children}
      </section>
    )
  }
}

// ── Container ─────────────────────────────────────────────────────────────────
export function Container(handle: Handle<{ children: any; narrow?: boolean }>) {
  return () => {
    let { children, narrow = false } = handle.props

    return (
      <div
        mix={css({
          maxWidth: narrow ? '720px' : '1200px',
          margin: '0 auto',
          padding: '0 16px',
          '@media (min-width: 640px)': { padding: '0 24px' },
          '@media (min-width: 1024px)': { padding: '0 48px' },
        })}
      >
        {children}
      </div>
    )
  }
}

// ── Feature card ──────────────────────────────────────────────────────────────
export function FeatureCard(
  handle: Handle<{ icon: string; title: string; description: string }>,
) {
  return () => {
    let { icon, title, description } = handle.props

    return (
      <div
        mix={css({
          background: 'var(--surface-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'box-shadow 200ms ease, transform 200ms ease',
          '&:hover': {
            boxShadow: '0 8px 32px color-mix(in srgb, var(--brand) 12%, transparent)',
            transform: 'translateY(-2px)',
          },
        })}
      >
        <span
          mix={css({
            fontSize: '28px',
            lineHeight: 1,
            display: 'block',
          })}
          aria-hidden="true"
        >
          {icon}
        </span>
        <h3
          mix={css({
            margin: 0,
            fontSize: '17px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          })}
        >
          {title}
        </h3>
        <p
          mix={css({
            margin: 0,
            fontSize: '15px',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          })}
        >
          {description}
        </p>
      </div>
    )
  }
}

// ── Testimonial card ──────────────────────────────────────────────────────────
export function TestimonialCard(
  handle: Handle<{ quote: string; name: string; role: string; initials: string }>,
) {
  return () => {
    let { quote, name, role, initials } = handle.props

    return (
      <figure
        mix={css({
          margin: 0,
          background: 'var(--surface-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        })}
      >
        <blockquote
          mix={css({
            margin: 0,
            fontSize: '15px',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
          })}
        >
          "{quote}"
        </blockquote>
        <figcaption
          mix={css({ display: 'flex', alignItems: 'center', gap: '12px' })}
        >
          <div
            mix={css({
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--brand-light)',
              color: 'var(--brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              flexShrink: 0,
            })}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div>
            <div
              mix={css({ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' })}
            >
              {name}
            </div>
            <div mix={css({ fontSize: '13px', color: 'var(--text-muted)' })}>{role}</div>
          </div>
        </figcaption>
      </figure>
    )
  }
}

// ── Step item ─────────────────────────────────────────────────────────────────
export function StepItem(
  handle: Handle<{ number: string; title: string; description: string }>,
) {
  return () => {
    let { number, title, description } = handle.props

    return (
      <div
        mix={css({
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
        })}
      >
        <div
          mix={css({
            flexShrink: 0,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--brand-light)',
            border: '2px solid var(--brand)',
            color: 'var(--brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            fontWeight: 700,
          })}
          aria-hidden="true"
        >
          {number}
        </div>
        <div mix={css({ paddingTop: '6px' })}>
          <h3
            mix={css({
              margin: '0 0 6px',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--text-primary)',
            })}
          >
            {title}
          </h3>
          <p
            mix={css({
              margin: 0,
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            })}
          >
            {description}
          </p>
        </div>
      </div>
    )
  }
}

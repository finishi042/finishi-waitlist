import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'
import { routes } from '../routes.ts'

export interface DocumentProps {
  children?: RemixNode
  head?: RemixNode
  title?: string
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, head, title = 'Finishi — Stop Searching. Start Learning.' } = handle.props
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" />
          <script>
            {`(function() {
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else if (theme === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            })();`}
          </script>
          <title>{title}</title>
          {head}
        </head>
        <body
          mix={css({
            margin: 0,
            padding: 0,
            overflowX: 'clip',
            fontFamily: "'Inter', system-ui, sans-serif",
            WebkitFontSmoothing: 'antialiased',
            '*, *::before, *::after': { boxSizing: 'border-box' },

            // ── Light mode tokens (default) ────────────────────────────────
            '--brand':          '#6D2E92',
            '--brand-dark':     '#561F73',
            '--brand-mid':      '#7B2CBF',
            '--brand-light':    '#F3E7FA',
            '--brand-lighter':  '#FAF5FF',
            '--hero-bg-start':  '#EDD9FA',
            '--hero-bg-end':    '#FDFCFF',
            '--text-on-brand':  '#FFFFFF',
            '--text-primary':   '#111111',
            '--text-secondary': '#4A5565',
            '--text-muted':     '#6A7282',
            '--surface':        '#FFFFFF',
            '--surface-soft':   '#FDFCFF',
            '--surface-card':   '#FFFFFF',
            '--border':         '#E4DEEF',
            '--border-focus':   '#6D2E92',
            '--success':        '#008236',
            '--success-bg':     '#F0FDF4',
            '--error':          '#F54900',
            '--error-bg':       '#FFF7ED',

            // ── System dark mode (only when no explicit theme set) ─────────
            '@media (prefers-color-scheme: dark)': {
              '--brand':          '#CE93D8',
              '--brand-dark':     '#AB47BC',
              '--brand-mid':      '#CE93D8',
              '--brand-light':    '#2D1B3D',
              '--brand-lighter':  '#1A0F2A',
              '--hero-bg-start':  '#1E0D2E',
              '--hero-bg-end':    '#0D0812',
              '--text-on-brand':  '#0D0812',
              '--text-primary':   '#F3F4F6',
              '--text-secondary': '#D1D5DB',
              '--text-muted':     '#9CA3AF',
              '--surface':        '#0D0812',
              '--surface-soft':   '#130B1D',
              '--surface-card':   '#1C1228',
              '--border':         '#2D1F40',
              '--border-focus':   '#CE93D8',
            },

            background: 'var(--surface)',
            color: 'var(--text-primary)',
            
            // ── Explicit light theme (overrides system preference) ─────────
            ':root[data-theme="light"] &': {
              '--brand':          '#6D2E92',
              '--brand-dark':     '#561F73',
              '--brand-mid':      '#7B2CBF',
              '--brand-light':    '#F3E7FA',
              '--brand-lighter':  '#FAF5FF',
              '--hero-bg-start':  '#EDD9FA',
              '--hero-bg-end':    '#FDFCFF',
              '--text-on-brand':  '#FFFFFF',
              '--text-primary':   '#111111',
              '--text-secondary': '#4A5565',
              '--text-muted':     '#6A7282',
              '--surface':        '#FFFFFF',
              '--surface-soft':   '#FDFCFF',
              '--surface-card':   '#FFFFFF',
              '--border':         '#E4DEEF',
              '--border-focus':   '#6D2E92',
            },
            
            // ── Explicit dark theme (overrides system preference) ──────────
            ':root[data-theme="dark"] &': {
              '--brand':          '#CE93D8',
              '--brand-dark':     '#AB47BC',
              '--brand-mid':      '#CE93D8',
              '--brand-light':    '#2D1B3D',
              '--brand-lighter':  '#1A0F2A',
              '--hero-bg-start':  '#1E0D2E',
              '--hero-bg-end':    '#0D0812',
              '--text-on-brand':  '#0D0812',
              '--text-primary':   '#F3F4F6',
              '--text-secondary': '#D1D5DB',
              '--text-muted':     '#9CA3AF',
              '--surface':        '#0D0812',
              '--surface-soft':   '#130B1D',
              '--surface-card':   '#1C1228',
              '--border':         '#2D1F40',
              '--border-focus':   '#CE93D8',
            },
          })}
        >
          {children}
          <script type="module" src={routes.assets.href({ path: 'app/assets/entry.ts' })} />
        </body>
      </html>
    )
  }
}

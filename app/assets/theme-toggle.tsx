import { clientEntry, css, on, type Handle } from 'remix/ui'

type Theme = 'light' | 'dark' | 'system'

export const ThemeToggle = clientEntry(
  import.meta.url + '#ThemeToggle',
  function ThemeToggle(_handle: Handle<Record<string, never>>) {
    let theme: Theme = 'system'
    let initialized = false

    function apply(t: Theme) {
      theme = t
      localStorage.setItem('theme', t)
      const root = document.documentElement
      if (t === 'dark') {
        root.setAttribute('data-theme', 'dark')
      } else if (t === 'light') {
        root.setAttribute('data-theme', 'light')
      } else {
        root.removeAttribute('data-theme')
      }
    }

    return () => {
      // Read and apply persisted theme on first client render
      if (typeof localStorage !== 'undefined' && !initialized) {
        initialized = true
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored) {
          theme = stored
          apply(stored)
        }
      }

      const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
      const icon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'
      const label = theme === 'dark' ? 'Dark mode' : theme === 'light' ? 'Light mode' : 'System'

      return (
        <button
          type="button"
          aria-label={`Color mode: ${label}. Click to change.`}
          title={label}
          mix={[
            on('click', () => { apply(next); _handle.update() }),
            css({
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1.5px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'border-color 150ms, background 150ms',
              '&:hover': { borderColor: 'var(--brand)', background: 'var(--brand-light)' },
            }),
          ]}
        >
          {icon}
        </button>
      )
    }
  },
)

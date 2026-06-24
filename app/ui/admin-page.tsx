import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'
import { routes } from '../routes.ts'
import { Document } from './document.tsx'

// ── Admin Login Page ──────────────────────────────────────────────────────────
export function AdminLoginPage(handle: Handle<{ error?: string }>) {
  return () => {
    let { error } = handle.props

    return (
      <Document title="Admin Login — Finishi">
        <main
          mix={css({
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            background: 'var(--surface-soft)',
          })}
        >
          <div
            mix={css({
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            })}
          >
            <div mix={css({ textAlign: 'center' })}>
              <span
                mix={css({
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--brand)',
                  letterSpacing: '-0.02em',
                })}
              >
                Finishi
              </span>
              <h1
                mix={css({
                  margin: '8px 0 4px',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                })}
              >
                Admin Dashboard
              </h1>
              <p mix={css({ margin: 0, fontSize: '14px', color: 'var(--text-muted)' })}>
                Enter your secret to continue
              </p>
            </div>

            <div
              mix={css({
                background: 'var(--surface-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px 28px',
              })}
            >
              <form
                method="post"
                action={routes.adminAction.href()}
                mix={css({ display: 'flex', flexDirection: 'column', gap: '16px' })}
              >
                <div mix={css({ display: 'flex', flexDirection: 'column', gap: '6px' })}>
                  <label
                    htmlFor="admin-secret"
                    mix={css({ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' })}
                  >
                    Admin secret
                  </label>
                  <input
                    id="admin-secret"
                    type="password"
                    name="secret"
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                    mix={css({
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text-primary)',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 150ms ease',
                      '&::placeholder': { color: 'var(--text-muted)' },
                      '&:focus': { borderColor: 'var(--border-focus)' },
                    })}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    mix={css({
                      margin: 0,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--error-bg)',
                      color: 'var(--error)',
                      fontSize: '14px',
                    })}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  mix={css({
                    padding: '13px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--brand)',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                    '&:hover': { background: 'var(--brand-dark)' },
                    '@media (prefers-color-scheme: dark)': { color: '#0F0A14' },
                  })}
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </main>
      </Document>
    )
  }
}

// ── Admin Dashboard Page ──────────────────────────────────────────────────────
interface WaitlistEntry {
  id: string
  email: string
  created_at: string
}

export function AdminDashboardPage(
  handle: Handle<{ entries: WaitlistEntry[]; total: number; todayCount: number }>,
) {
  return () => {
    let { entries, total, todayCount } = handle.props

    return (
      <Document title="Admin Dashboard — Finishi">
        <div mix={css({ minHeight: '100vh', background: 'var(--surface-soft)' })}>
          {/* Top bar */}
          <header
            mix={css({
              background: 'var(--surface-card)',
              borderBottom: '1px solid var(--border)',
              padding: '0 16px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              '@media (min-width: 640px)': { padding: '0 32px' },
            })}
          >
            <span mix={css({ fontSize: '17px', fontWeight: 700, color: 'var(--brand)' })}>
              Finishi Admin
            </span>
            <form method="post" action={routes.adminLogout.href()}>
              <button
                type="submit"
                mix={css({
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'border-color 150ms, color 150ms',
                  '&:hover': { borderColor: 'var(--brand)', color: 'var(--brand)' },
                })}
              >
                Sign out
              </button>
            </form>
          </header>

          <main
            mix={css({
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '32px 16px 64px',
              '@media (min-width: 640px)': { padding: '40px 32px 64px' },
            })}
          >
            <h1
              mix={css({
                margin: '0 0 32px',
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
              })}
            >
              Waitlist Dashboard
            </h1>

            {/* Stats */}
            <div
              mix={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '32px',
                '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
              })}
            >
              <StatCard label="Total signups" value={total.toLocaleString()} />
              <StatCard label="Joined today" value={todayCount.toLocaleString()} accent />
              <StatCard
                label="Latest signup"
                value={
                  entries[0]
                    ? new Date(entries[0].created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—'
                }
              />
            </div>

            {/* Table */}
            <div
              mix={css({
                background: 'var(--surface-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
              })}
            >
              <div
                mix={css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)',
                  gap: '12px',
                  flexWrap: 'wrap',
                })}
              >
                <h2
                  mix={css({
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  })}
                >
                  All signups
                </h2>
                <CsvDownloadButton entries={entries} />
              </div>

              {entries.length === 0 ? (
                <p
                  mix={css({
                    margin: 0,
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '15px',
                  })}
                >
                  No signups yet. Share the waitlist!
                </p>
              ) : (
                <div mix={css({ overflowX: 'auto' })}>
                  <table
                    mix={css({ width: '100%', borderCollapse: 'collapse', fontSize: '14px' })}
                  >
                    <thead>
                      <tr
                        mix={css({
                          background: 'var(--surface-soft)',
                          '& th': {
                            padding: '12px 20px',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            whiteSpace: 'nowrap',
                          },
                        })}
                      >
                        <th scope="col">#</th>
                        <th scope="col">Email</th>
                        <th scope="col">Joined</th>
                        <th scope="col">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, i) => {
                        let date = new Date(entry.created_at)
                        return (
                          <tr
                            key={entry.id}
                            mix={css({
                              borderTop: '1px solid var(--border)',
                              '&:hover': { background: 'var(--surface-soft)' },
                              '& td': { padding: '14px 20px', color: 'var(--text-primary)' },
                            })}
                          >
                            <td mix={css({ color: 'var(--text-muted) !important', width: '48px' })}>
                              {i + 1}
                            </td>
                            <td mix={css({ fontWeight: 500 })}>{entry.email}</td>
                            <td mix={css({ color: 'var(--text-secondary) !important', whiteSpace: 'nowrap' })}>
                              {date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td mix={css({ color: 'var(--text-muted) !important', whiteSpace: 'nowrap' })}>
                              {date.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </Document>
    )
  }
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard(handle: Handle<{ label: string; value: string; accent?: boolean }>) {
  return () => {
    let { label, value, accent = false } = handle.props

    return (
      <div
        mix={css({
          background: accent ? 'var(--brand)' : 'var(--surface-card)',
          border: `1px solid ${accent ? 'transparent' : 'var(--border)'}`,
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          '--text-primary': accent ? '#FFFFFF' : 'var(--text-primary)',
          '--text-muted': accent ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
        })}
      >
        <span
          mix={css({
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          })}
        >
          {label}
        </span>
        <span
          mix={css({
            fontSize: '28px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          })}
        >
          {value}
        </span>
      </div>
    )
  }
}

// ── CSV Export — plain anchor with data URI (no onClick needed) ───────────────
function CsvDownloadButton(handle: Handle<{ entries: WaitlistEntry[] }>) {
  return () => {
    let { entries } = handle.props

    let rows = ['#,Email,Joined']
    entries.forEach((e, i) => {
      rows.push(`${i + 1},${e.email},${new Date(e.created_at).toISOString()}`)
    })
    let dataHref = `data:text/csv;charset=utf-8,${encodeURIComponent(rows.join('\n'))}`

    return (
      <a
        href={dataHref}
        download="finishi-waitlist.csv"
        mix={css({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1.5px solid var(--border)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          fontWeight: 500,
          textDecoration: 'none',
          transition: 'border-color 150ms, color 150ms',
          '&:hover': { borderColor: 'var(--brand)', color: 'var(--brand)' },
        })}
      >
        ↓ Export CSV
      </a>
    )
  }
}

import { clientEntry, on, type Handle } from 'remix/ui'
import { css } from 'remix/ui'

// Trigger button — dispatches a custom event picked up by the single dialog instance
export const WaitlistTrigger = clientEntry(
  import.meta.url + '#WaitlistTrigger',
  function WaitlistTrigger(_handle: Handle<Record<string, never>>) {
    return () => (
      <button
        type="button"
        mix={[
          on('click', () => { window.dispatchEvent(new CustomEvent('open-waitlist')) }),
          css({
            padding: '10px 22px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--brand)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 150ms',
            '&:hover': { background: 'var(--brand-dark)' },
          }),
        ]}
      >
        Join the Waitlist
      </button>
    )
  },
)

// Single dialog instance — placed once at the page level
export const WaitlistDialog = clientEntry(
  import.meta.url + '#WaitlistDialog',
  function WaitlistDialog(handle: Handle<{ action: string }>) {
    let open = false
    let status: 'idle' | 'loading' | 'success' | 'error' | 'duplicate' | 'setup' | 'timeout' = 'idle'
    let listening = false
    let toastMessage = ''
    let showToast = false

    function show() { open = true; handle.update() }
    function hide() { open = false; status = 'idle'; handle.update() }
    
    function displayToast(message: string, duration = 3000) {
      toastMessage = message
      showToast = true
      handle.update()
      setTimeout(() => {
        showToast = false
        handle.update()
      }, duration)
    }

    return () => {
      if (!listening && typeof window !== 'undefined') {
        listening = true
        window.addEventListener('open-waitlist', show)
      }
      let { action } = handle.props

      return (
        <span>
          {/* Toast notification */}
          {showToast && (
            <div
              mix={css({
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10000,
                padding: '14px 24px',
                borderRadius: '12px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                maxWidth: '90vw',
                animation: 'slideUp 0.3s ease-out',
                '@keyframes slideUp': {
                  from: { opacity: 0, transform: 'translate(-50%, 20px)' },
                  to: { opacity: 1, transform: 'translate(-50%, 0)' },
                },
              })}
            >
              {toastMessage}
            </div>
          )}
          
          {open && (
            <div
              mix={[
                on('click', (e) => {
                  if ((e.target as HTMLElement).dataset.backdrop) hide()
                }),
                css({
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  background: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(4px)',
                }),
              ]}
              data-backdrop="1"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                mix={css({
                  width: '100%',
                  maxWidth: '480px',
                  background: 'var(--surface)',
                  borderRadius: '20px',
                  padding: '40px 32px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
                  position: 'relative',
                  '@media (max-width: 480px)': { padding: '32px 20px 24px' },
                })}
              >
                <button
                  type="button"
                  aria-label="Close"
                  mix={[
                    on('click', hide),
                    css({
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: 'var(--text-muted)',
                      '&:hover': { color: 'var(--text-primary)' },
                    }),
                  ]}
                >
                  ×
                </button>

                <img src="/finishi-logo.svg" alt="Finishi" mix={css({ height: '30px', width: 'auto' })} />

                <div mix={css({ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' })}>
                  <h2
                    id="dialog-title"
                    mix={css({ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' })}
                  >
                    Join the Waitlist
                  </h2>
                  <p mix={css({ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--text-secondary)' })}>
                    Be the first to know when Finishi launches. Get early access and exclusive updates.
                  </p>
                </div>

                {status === 'success' ? (
                  <div
                    mix={css({
                      width: '100%',
                      padding: '20px',
                      borderRadius: '12px',
                      background: 'var(--success-bg)',
                      border: '1px solid var(--success)',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    })}
                  >
                    <span mix={css({ fontSize: '32px' })}>🎉</span>
                    <p mix={css({ margin: 0, fontWeight: 600, color: 'var(--success)', fontSize: '16px' })}>You're on the list!</p>
                    <p mix={css({ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' })}>We'll reach out as soon as your spot opens up.</p>
                    <button
                      type="button"
                      mix={[on('click', hide), css({ marginTop: '8px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)', '&:hover': { color: 'var(--brand)' } })]}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form
                    mix={[
                      on('submit', async (e, signal) => {
                        e.preventDefault()
                        const data = new FormData(e.currentTarget as HTMLFormElement)
                        status = 'loading'
                        handle.update()
                        
                        // Create a timeout promise
                        const timeoutMs = 10000 // 10 seconds
                        const timeoutPromise = new Promise<never>((_, reject) => {
                          setTimeout(() => reject(new Error('timeout')), timeoutMs)
                        })
                        
                        try {
                          const fetchPromise = fetch(action, { method: 'POST', body: data, signal, redirect: 'follow' })
                          const res = await Promise.race([fetchPromise, timeoutPromise])
                          
                          if (signal.aborted) return
                          
                          const s = new URL(res.url).searchParams.get('s')
                          status = (s === 'success' || s === 'duplicate' || s === 'error' || s === 'setup') ? s as any : 'error'
                          
                          // Show toast notification
                          if (status === 'success') {
                            displayToast('🎉 Successfully joined the waitlist!')
                          } else if (status === 'duplicate') {
                            displayToast('ℹ️ You\'re already on the list!')
                          } else if (status === 'setup') {
                            displayToast('❌ Database not configured', 4000)
                          } else {
                            displayToast('❌ Something went wrong', 4000)
                          }
                          
                          handle.update()
                        } catch (err) {
                          if (signal.aborted) return
                          
                          if (err instanceof Error && err.message === 'timeout') {
                            status = 'timeout'
                            displayToast('⏱️ Request timed out. Please try again.', 4000)
                          } else {
                            status = 'error'
                            displayToast('❌ Something went wrong', 4000)
                          }
                          handle.update()
                        }
                      }),
                      css({ width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '12px' }),
                    ]}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      mix={css({
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '16px 20px',
                        borderRadius: '999px',
                        border: '2px solid var(--border)',
                        background: 'var(--surface)',
                        color: 'var(--text-primary)',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'border-color 150ms',
                        '&::placeholder': { color: 'var(--text-muted)' },
                        '&:focus': { borderColor: 'var(--brand)', boxShadow: '0 0 0 3px color-mix(in srgb, var(--brand) 15%, transparent)' },
                      })}
                    />

                    {(status === 'error' || status === 'setup' || status === 'timeout') && (
                      <p mix={css({ margin: 0, padding: '10px 14px', borderRadius: '8px', background: 'var(--error-bg)', color: 'var(--error)', fontSize: '14px' })}>
                        {status === 'setup' ? 'Database not configured yet.' 
                         : status === 'timeout' ? 'Request timed out. Please try again.'
                         : 'Something went wrong. Please try again.'}
                      </p>
                    )}

                    {status === 'duplicate' && (
                      <p mix={css({ margin: 0, padding: '10px 14px', borderRadius: '8px', background: 'var(--brand-light)', color: 'var(--brand)', fontSize: '14px' })}>
                        You're already on the list! We'll be in touch.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      mix={css({
                        width: '100%',
                        padding: '16px',
                        borderRadius: '999px',
                        border: 'none',
                        background: 'var(--brand)',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 150ms, opacity 150ms',
                        '&:hover:not(:disabled)': { background: 'var(--brand-dark)' },
                        '&:disabled': { opacity: 0.65, cursor: 'not-allowed' },
                      })}
                    >
                      {status === 'loading' ? 'Submitting…' : 'Join the Waitlist'}
                    </button>

                    <p mix={css({ margin: 0, textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' })}>
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}
        </span>
      )
    }
  },
)

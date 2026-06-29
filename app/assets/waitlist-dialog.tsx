import { clientEntry, on, type Handle } from 'remix/ui'
import { css } from 'remix/ui'

const TOPICS = [
  { emoji: '💻', label: 'Web Development' },
  { emoji: '🤖', label: 'AI & Machine Learning' },
  { emoji: '📊', label: 'Data Science' },
  { emoji: '📱', label: 'Mobile Development' },
  { emoji: '🎨', label: 'UI/UX Design' },
  { emoji: '☁️', label: 'Cloud & DevOps' },
  { emoji: '🔐', label: 'Cybersecurity' },
  { emoji: '💰', label: 'Finance & Investing' },
  { emoji: '📸', label: 'Photography & Video' },
  { emoji: '✍️', label: 'Writing & Content' },
]

const inputStyle = css({
  width: '100%',
  boxSizing: 'border-box',
  padding: '14px 18px',
  borderRadius: '999px',
  border: '2px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text-primary)',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 150ms',
  '&::placeholder': { color: 'var(--text-muted)' },
  '&:focus': { borderColor: 'var(--brand)', boxShadow: '0 0 0 3px color-mix(in srgb, var(--brand) 15%, transparent)' },
})

const submitBtnStyle = css({
  width: '100%',
  padding: '15px',
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
})

// Trigger button
export const WaitlistTrigger = clientEntry(
  import.meta.url + '#WaitlistTrigger',
  function WaitlistTrigger(handle: Handle<{ variant?: 'default' | 'inverted' }>) {
    return () => {
      const inverted = handle.props.variant === 'inverted'
      return (
        <button
          type="button"
          mix={[
            on('click', () => { window.dispatchEvent(new CustomEvent('open-waitlist')) }),
            css({
              padding: '10px 22px',
              borderRadius: '8px',
              border: '1.5px solid transparent',
              background: inverted ? '#fff' : 'var(--brand)',
              color: inverted ? 'var(--brand)' : '#fff',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: 1,
              cursor: 'pointer',
              transition: 'background 150ms, color 150ms',
              '&:hover': { background: inverted ? 'rgba(255,255,255,0.88)' : 'var(--brand-dark)' },
            }),
          ]}
        >
          Join the Waitlist
        </button>
      )
    }
  },
)

// Single dialog instance
export const WaitlistDialog = clientEntry(
  import.meta.url + '#WaitlistDialog',
  function WaitlistDialog(handle: Handle<{ action: string }>) {
    let open = false
    let step: 1 | 2 = 1
    let email = ''
    let selectedTopics: string[] = []
    let customTopics: string[] = []
    let customInput = ''
    let showCustomInput = false
    let status: 'idle' | 'loading' | 'success' | 'error' | 'duplicate' | 'setup' | 'timeout' = 'idle'
    let listening = false
    let toastMessage = ''
    let showToast = false

    function show() { open = true; step = 1; email = ''; selectedTopics = []; customTopics = []; customInput = ''; showCustomInput = false; status = 'idle'; handle.update() }
    function hide() { open = false; status = 'idle'; handle.update() }

    function displayToast(message: string, duration = 3000) {
      toastMessage = message
      showToast = true
      handle.update()
      setTimeout(() => { showToast = false; handle.update() }, duration)
    }

    async function submit(signal: AbortSignal) {
      const data = new FormData()
      data.set('email', email)
      const goals = [...selectedTopics, ...customTopics]
      const goal = goals.join(', ')
      if (goal) data.set('learning_goal', goal)

      status = 'loading'
      handle.update()

      const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))

      try {
        const res = await Promise.race([
          fetch(handle.props.action, { method: 'POST', body: data, signal, redirect: 'follow', credentials: 'same-origin' }),
          timeoutPromise,
        ])
        if (signal.aborted) return
        const s = new URL(res.url).searchParams.get('s')
        status = (s === 'success' || s === 'duplicate' || s === 'error' || s === 'setup') ? s as any : 'error'
        if (status === 'success') displayToast('🎉 Successfully joined the waitlist!')
        else if (status === 'duplicate') displayToast('ℹ️ You\'re already on the list!')
        else if (status === 'setup') displayToast('❌ Database not configured', 4000)
        else displayToast('❌ Something went wrong', 4000)
        handle.update()
      } catch (err) {
        if (signal.aborted) return
        status = err instanceof Error && err.message === 'timeout' ? 'timeout' : 'error'
        displayToast(status === 'timeout' ? '⏱️ Request timed out. Please try again.' : '❌ Something went wrong', 4000)
        handle.update()
      }
    }

    return () => {
      if (!listening && typeof window !== 'undefined') {
        listening = true
        window.addEventListener('open-waitlist', show)
      }

      return (
        <span>
          {showToast && (
            <div mix={css({
              position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
              zIndex: 10000, padding: '14px 24px', borderRadius: '12px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)', fontSize: '15px', fontWeight: 500,
              color: 'var(--text-primary)', maxWidth: '90vw',
            })}>
              {toastMessage}
            </div>
          )}

          {open && (
            <div
              mix={[
                on('click', (e) => { if ((e.target as HTMLElement).dataset.backdrop) hide() }),
                css({
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '16px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
                }),
              ]}
              data-backdrop="1"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                mix={css({
                  width: '100%', maxWidth: '480px', background: 'var(--surface)',
                  borderRadius: '20px', padding: '40px 32px 32px',
                  display: 'flex', flexDirection: 'column', gap: '20px',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.2)', position: 'relative',
                  maxHeight: '70vh', overflowY: 'auto',
                  boxSizing: 'border-box',
                  '@media (max-width: 480px)': { padding: '32px 20px 24px', maxWidth: 'calc(100vw - 32px)' },
                })}
              >
                {/* Close */}
                <button type="button" aria-label="Close" mix={[on('click', hide), css({
                  position: 'absolute', top: '16px', right: '16px',
                  width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                  background: 'transparent', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                  color: 'var(--text-muted)', '&:hover': { color: 'var(--text-primary)' },
                })]}>×</button>

                {/* Step indicators */}
                <div mix={css({ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' })}>
                  {[1, 2].map((n) => (
                    <div key={n} mix={css({
                      height: '4px', borderRadius: '999px', transition: 'all 200ms',
                      background: step >= n ? 'var(--brand)' : 'var(--border)',
                      width: step >= n ? '24px' : '16px',
                    })} />
                  ))}
                </div>

                {status === 'success' ? (
                  <div mix={css({ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '8px 0' })}>
                    <span mix={css({ fontSize: '40px' })}>🎉</span>
                    <p mix={css({ margin: 0, fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' })}>You're on the list!</p>
                    <p mix={css({ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' })}>We'll reach out as soon as your spot opens up.</p>
                    <button type="button" mix={[on('click', hide), css({ marginTop: '12px', padding: '10px 24px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)', '&:hover': { color: 'var(--brand)' } })]}>
                      Close
                    </button>
                  </div>
                ) : step === 1 ? (
                  <>
                    <div mix={css({ display: 'flex', flexDirection: 'column', gap: '6px' })}>
                      <h2 id="dialog-title" mix={css({ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' })}>
                        Join the Waitlist
                      </h2>
                      <p mix={css({ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' })}>
                        Be the first to know when Finishi launches.
                      </p>
                    </div>

                    <form mix={[
                      on('submit', (e) => {
                        e.preventDefault()
                        const fd = new FormData(e.currentTarget as HTMLFormElement)
                        email = String(fd.get('email') ?? '').trim()
                        step = 2
                        handle.update()
                      }),
                      css({ display: 'flex', flexDirection: 'column', gap: '12px' }),
                    ]}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        mix={[
                          on('input', (e) => { email = (e.target as HTMLInputElement).value }),
                          inputStyle,
                        ]}
                      />
                      <button type="submit" mix={submitBtnStyle}>Continue →</button>
                      <p mix={css({ margin: 0, textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' })}>
                        No spam, ever. Unsubscribe anytime.
                      </p>
                    </form>
                  </>
                ) : (
                  <>
                    <div mix={css({ display: 'flex', flexDirection: 'column', gap: '6px' })}>
                      <h2 mix={css({ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' })}>
                        What do you want to learn?
                      </h2>
                      <p mix={css({ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' })}>
                        Optional — helps us prioritise what to build first.
                      </p>
                    </div>

                    {/* Topic chips */}
                    <div mix={css({ display: 'flex', flexWrap: 'wrap', gap: '8px' })}>
                      {TOPICS.map((t) => (
                        <button
                          key={t.label}
                          type="button"
                          mix={[
                            on('click', () => {
                              const idx = selectedTopics.indexOf(t.label)
                              if (idx === -1) selectedTopics = [...selectedTopics, t.label]
                              else selectedTopics = selectedTopics.filter((s) => s !== t.label)
                              handle.update()
                            }),
                            css({
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '8px 14px', borderRadius: '999px', cursor: 'pointer',
                              fontSize: '13px', fontWeight: 500, transition: 'all 150ms',
                              border: `2px solid ${selectedTopics.includes(t.label) ? 'var(--brand)' : 'var(--border)'}`,
                              background: selectedTopics.includes(t.label) ? 'var(--brand-light)' : 'transparent',
                              color: selectedTopics.includes(t.label) ? 'var(--brand)' : 'var(--text-secondary)',
                              '&:hover': { borderColor: 'var(--brand)', color: 'var(--brand)' },
                            }),
                          ]}
                        >
                          <span aria-hidden="true">{t.emoji}</span> {t.label}
                        </button>
                      ))}

                      {/* "Something else" chip */}
                      <button
                        type="button"
                        mix={[
                          on('click', () => {
                            showCustomInput = !showCustomInput
                            if (!showCustomInput) { customTopics = []; customInput = '' }
                            handle.update()
                          }),
                          css({
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '999px', cursor: 'pointer',
                            fontSize: '13px', fontWeight: 500, transition: 'all 150ms',
                            border: `2px solid ${showCustomInput ? 'var(--brand)' : 'var(--border)'}`,
                            background: showCustomInput ? 'var(--brand-light)' : 'transparent',
                            color: showCustomInput ? 'var(--brand)' : 'var(--text-secondary)',
                            '&:hover': { borderColor: 'var(--brand)', color: 'var(--brand)' },
                          }),
                        ]}
                      >
                        ✏️ Something else
                      </button>
                    </div>

                    {showCustomInput && (
                      <div mix={css({ display: 'flex', flexDirection: 'column', gap: '8px' })}>
                        {customTopics.length > 0 && (
                          <div mix={css({ display: 'flex', flexWrap: 'wrap', gap: '6px' })}>
                            {customTopics.map((t) => (
                              <span key={t} mix={css({
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '5px 10px 5px 12px', borderRadius: '999px',
                                background: 'var(--brand-light)', border: '2px solid var(--brand)',
                                color: 'var(--brand)', fontSize: '13px', fontWeight: 500,
                              })}>
                                {t}
                                <button
                                  type="button"
                                  aria-label={`Remove ${t}`}
                                  mix={[
                                    on('click', () => { customTopics = customTopics.filter((x) => x !== t); handle.update() }),
                                    css({ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 2px', color: 'var(--brand)', fontSize: '15px', lineHeight: 1, display: 'flex', alignItems: 'center' }),
                                  ]}
                                >×</button>
                              </span>
                            ))}
                          </div>
                        )}
                        <input
                          type="text"
                          placeholder="Type a topic and press Enter…"
                          mix={[
                            on('input', (e) => { customInput = (e.target as HTMLInputElement).value }),
                            on('keydown', (e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                const val = customInput.trim()
                                if (val && !customTopics.includes(val)) customTopics = [...customTopics, val]
                                customInput = '';(e.target as HTMLInputElement).value = ''
                                handle.update()
                              }
                            }),
                            inputStyle,
                          ]}
                        />
                        <p mix={css({ margin: 0, fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '4px' })}>Press Enter to add each topic</p>
                      </div>
                    )}

                    {(status === 'error' || status === 'setup' || status === 'timeout') && (
                      <p mix={css({ margin: 0, padding: '10px 14px', borderRadius: '8px', background: 'var(--error-bg)', color: 'var(--error)', fontSize: '14px' })}>
                        {status === 'timeout' ? 'Request timed out. Please try again.' : 'Something went wrong. Please try again.'}
                      </p>
                    )}

                    {status === 'duplicate' && (
                      <p mix={css({ margin: 0, padding: '10px 14px', borderRadius: '8px', background: 'var(--brand-light)', color: 'var(--brand)', fontSize: '14px' })}>
                        You're already on the list! We'll be in touch.
                      </p>
                    )}

                    <div mix={css({ display: 'flex', gap: '10px' })}>
                      <button
                        type="button"
                        mix={[
                          on('click', () => { step = 1; status = 'idle'; handle.update() }),
                          css({
                            flex: '0 0 auto', padding: '15px 20px', borderRadius: '999px',
                            border: '2px solid var(--border)', background: 'transparent',
                            color: 'var(--text-secondary)', fontSize: '15px', cursor: 'pointer',
                            transition: 'border-color 150ms',
                            '&:hover': { borderColor: 'var(--brand)', color: 'var(--brand)' },
                          }),
                        ]}
                      >←</button>
                      <button
                        type="button"
                        disabled={status === 'loading'}
                        mix={[
                          on('click', (_e, signal) => submit(signal)),
                          submitBtnStyle,
                          css({ flex: 1 }),
                        ]}
                      >
                        {status === 'loading' ? 'Submitting…' : 'Join the Waitlist'}
                      </button>
                    </div>

                    <p mix={css({ margin: 0, textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' })}>
                      Skip this step if you prefer — just click Join.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </span>
      )
    }
  },
)

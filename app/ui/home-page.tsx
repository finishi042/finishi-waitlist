import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'
import { routes } from '../routes.ts'
import { Document } from './document.tsx'
import { WaitlistDialog, WaitlistTrigger } from '../assets/waitlist-dialog.tsx'
import { ThemeToggle } from '../assets/theme-toggle.tsx'

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return () => (
    <div
      mix={css({
        width: '100%',
        maxWidth: '100vw',
        padding: '16px 16px 0',
        background: 'var(--hero-bg-start)',
        boxSizing: 'border-box',
      })}
    >
      <nav
        mix={css({
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 16px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(8px)',
          boxSizing: 'border-box',
        })}
      >
        <div mix={css({ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 })}>
          <img src="/finishi-logo.svg" alt="Finishi" mix={css({ height: '28px', width: 'auto', maxWidth: '100%' })} />
        </div>
        <div mix={css({ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 })}>
          <ThemeToggle />
          <WaitlistTrigger />
        </div>
      </nav>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero(handle: Handle<{ status?: string; count?: number }>) {
  return () => {
    let { status, count } = handle.props
    return (
      <section
        mix={css({
          width: '100%',
          maxWidth: '100vw',
          background: 'linear-gradient(180deg, var(--hero-bg-start) 0%, var(--hero-bg-end) 100%)',
          padding: '40px 16px 60px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          boxSizing: 'border-box',
        })}
      >
        <span
          mix={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: '999px',
            border: '1px solid var(--brand)',
            background: 'var(--brand-light)',
            color: 'var(--brand)',
            fontSize: '13px',
            fontWeight: 500,
          })}
        >
          AI-Powered Learning Companion
        </span>

        <h1
          mix={css({
            margin: 0,
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            maxWidth: '700px',
          })}
        >
          Stop Searching.{' '}
          <br />
          Start Learning.
        </h1>

        <p
          mix={css({
            margin: 0,
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            maxWidth: '520px',
          })}
        >
          Finishi AI turns scattered self-learning into a daily guided path, with goals, streaks,
          reminders, and progress tracking built in.
        </p>

        <div mix={css({ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' })}>
          <WaitlistTrigger />
          <a
            href="#how-it-works"
            mix={css({
              padding: '10px 22px',
              borderRadius: '8px',
              border: '1.5px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'border-color 150ms, background 150ms',
              '&:hover': { borderColor: 'var(--brand)', background: 'var(--surface-soft)' },
              '&:focus': { borderColor: 'var(--brand)', outline: 'none', color: 'var(--text-primary)' },
              '&:visited': { color: 'var(--text-primary)' },
              '&:active': { color: 'var(--text-primary)' },
              '&:focus-visible': { borderColor: 'var(--brand)', outline: '2px solid var(--brand)', outlineOffset: '2px', color: 'var(--text-primary)' },
            })}
          >
            See How It Works
          </a>
        </div>

        <div
          mix={css({
            marginTop: '16px',
            width: '100%',
            maxWidth: '860px',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 80px rgba(109,46,146,0.12)',
            overflow: 'hidden',
          })}
        >
          <img
            src="/app-mockup.png"
            alt="Finishi app dashboard"
            mix={css({ width: '100%', height: 'auto', display: 'block' })}
          />
        </div>
      </section>
    )
  }
}

// ── The Problem ───────────────────────────────────────────────────────────────
function ProblemSection() {
  return () => {
    const problems = [
      { icon: '\u221e', title: 'Too Much Content', description: 'Courses, videos, newsletters, and tutorials pile up until learning feels overwhelming.' },
      { icon: '\u2442', title: 'No Clear Structure', description: 'You start excited, then lose direction after a few days.' },
      { icon: '\u270f', title: 'No Accountability', description: 'Without streaks, reminders, or progress tracking, consistency fades.' },
    ]

    return (
      <section mix={css({ width: '100%', maxWidth: '100vw', padding: '80px 16px', background: 'var(--surface)', boxSizing: 'border-box' })}>
        <div mix={css({ maxWidth: '1100px', margin: '0 auto', width: '100%' })}>
          <p mix={css({ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' })}>
            The Problem
          </p>
          <h2 mix={css({ margin: '0 0 12px', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)', maxWidth: '560px' })}>
            Self-learning breaks down when there's no structure.
          </h2>
          <p mix={css({ margin: '0 0 48px', fontSize: '16px', lineHeight: 1.65, color: 'var(--text-secondary)', maxWidth: '520px' })}>
            Most learners do not fail because they lack motivation. They fail because they have too much content, no clear path, and no accountability.
          </p>
          <div
            mix={css({
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
            })}
          >
            {problems.map((p) => (
              <div
                key={p.title}
                mix={css({
                  padding: '28px 24px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                })}
              >
                <span mix={css({ fontSize: '24px', color: 'var(--brand)' })} aria-hidden="true">{p.icon}</span>
                <h3 mix={css({ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--brand)' })}>{p.title}</h3>
                <p mix={css({ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' })}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

// ── How Finishi Works ─────────────────────────────────────────────────────────
function HowItWorksSection() {
  return () => {
    const steps = [
      { n: '01', title: 'Start with a goal', desc: 'Tell Finishi what you want to learn, your current level, and how much time you can commit.' },
      { n: '02', title: 'Get your learning path', desc: 'Finishi breaks your goal into simple daily steps, resources, and checkpoints.' },
      { n: '03', title: 'Stay consistent', desc: 'Build streaks, receive reminders, and track small wins every day.' },
      { n: '04', title: 'Learn actively', desc: 'Complete focused exercises, challenges, and reflections instead of passively consuming content.' },
      { n: '05', title: 'Finish what you started', desc: 'Turn unfinished courses and scattered ideas into visible progress.', accent: true },
    ]

    return (
      <section id="how-it-works" mix={css({ width: '100%', maxWidth: '100vw', padding: '80px 16px', background: 'var(--surface-soft)', boxSizing: 'border-box' })}>
        <div mix={css({ maxWidth: '1100px', margin: '0 auto', width: '100%' })}>
          <p mix={css({ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' })}>
            How Finishi Works
          </p>
          <h2 mix={css({ margin: '0 0 12px', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)', maxWidth: '600px' })}>
            Finishi turns scattered learning into a clear guided journey.
          </h2>
          <p mix={css({ margin: '0 0 48px', fontSize: '16px', lineHeight: 1.65, color: 'var(--text-secondary)', maxWidth: '520px' })}>
            Instead of jumping between endless resources, you get a simple daily structure built around your goal, pace, and progress.
          </p>
          <div
            mix={css({
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
            })}
          >
            {steps.map((s) => (
              <div
                key={s.n}
                mix={css({
                  padding: '28px 24px',
                  borderRadius: '12px',
                  border: `1px solid ${s.accent ? 'transparent' : 'var(--border)'}`,
                  background: s.accent ? 'var(--brand)' : 'var(--surface-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                })}
              >
                <span
                  mix={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1.5px solid ${s.accent ? 'rgba(255,255,255,0.5)' : 'var(--brand)'}`,
                    color: s.accent ? '#fff' : 'var(--brand)',
                    fontSize: '13px',
                    fontWeight: 700,
                  })}
                >
                  {s.n}
                </span>
                <h3 mix={css({ margin: 0, fontSize: '16px', fontWeight: 700, color: s.accent ? '#fff' : 'var(--text-primary)' })}>
                  {s.title}
                </h3>
                <p mix={css({ margin: 0, fontSize: '14px', lineHeight: 1.6, color: s.accent ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' })}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

// ── Core Features ─────────────────────────────────────────────────────────────
function CoreFeaturesSection() {
  return () => {
    const features = [
      { icon: '/mingcute-ai-icon.svg', title: 'AI-Powered Learning Paths', desc: 'Personalized daily plans built around your goal, pace, available time, and learning style.' },
      { icon: '/checkbox-icon.svg', title: 'Smart Accountability', desc: 'Streaks, reminders, check-ins, and progress nudges help you stay consistent.' },
      { icon: '/dashboard-outline.svg', title: 'Progress & Completion Tracking', desc: 'Visual dashboards show lessons completed, skills improved, and goals finished.' },
    ]

    return (
      <section mix={css({ width: '100%', maxWidth: '100vw', padding: '80px 16px', background: 'var(--surface)', boxSizing: 'border-box' })}>
        <div mix={css({ maxWidth: '1100px', margin: '0 auto', width: '100%' })}>
          <p mix={css({ margin: '0 0 40px', fontSize: '13px', fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' })}>
            Core Features
          </p>
          <div
            mix={css({
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
            })}
          >
            {features.map((f) => (
              <div
                key={f.title}
                mix={css({
                  padding: '28px 24px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                })}
              >
                <img src={f.icon} alt="" aria-hidden="true" mix={css({ width: '28px', height: '28px' })} />
                <h3 mix={css({ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' })}>{f.title}</h3>
                <p mix={css({ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' })}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

// ── Who Uses Finishi ──────────────────────────────────────────────────────────
function AudienceSection() {
  return () => {
    const audiences = [
      { title: 'Students & Self-Learners', desc: 'People learning new skills online who need structure, focus, and consistency.', img: '/audience-students.jpg' },
      { title: 'Career Switchers & Professionals', desc: 'Learners building new skills without getting lost in scattered resources.', img: '/audience-professionals.jpg' },
      { title: 'Creators, Builders & Curious Minds', desc: 'People who want to explore deeply, stay disciplined, and finish what they start.', img: '/audience-creators.jpg' },
    ]

    return (
      <section mix={css({ width: '100%', maxWidth: '100vw', padding: '80px 16px', background: 'var(--surface-soft)', boxSizing: 'border-box' })}>
        <div mix={css({ maxWidth: '1100px', margin: '0 auto', width: '100%' })}>
          <p mix={css({ margin: '0 0 40px', fontSize: '13px', fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' })}>
            Who Uses Finishi
          </p>
          <div
            mix={css({
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
            })}
          >
            {audiences.map((a) => (
              <div
                key={a.title}
                mix={css({
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  background: 'var(--surface-card)',
                })}
              >
                <img
                  src={a.img}
                  alt={a.title}
                  mix={css({ width: '100%', height: '180px', objectFit: 'cover', display: 'block' })}
                />
                <div mix={css({ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' })}>
                  <h3 mix={css({ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' })}>{a.title}</h3>
                  <p mix={css({ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' })}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CtaBanner() {
  return () => (
    <section mix={css({ width: '100%', maxWidth: '100vw', padding: '80px 16px', background: 'var(--surface)', boxSizing: 'border-box' })}>
      <div
        mix={css({
          maxWidth: '720px',
          margin: '0 auto',
          borderRadius: '20px',
          background: 'var(--brand)',
          padding: '56px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          boxSizing: 'border-box',
          '@media (max-width: 480px)': { padding: '40px 24px' },
        })}
      >
        <h2 mix={css({ margin: 0, fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1 })}>
          Ready to finish what you start?
        </h2>
        <p mix={css({ margin: 0, fontSize: '16px', lineHeight: 1.65, color: 'rgba(255,255,255,0.85)', maxWidth: '420px' })}>
          Join learners using Finishi to build daily momentum, follow clear paths, and make real progress one step at a time.
        </p>
        <WaitlistTrigger />
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return () => (
    <footer mix={css({ width: '100%', maxWidth: '100vw', borderTop: '1px solid var(--border)', padding: '40px 16px', background: 'var(--surface)', boxSizing: 'border-box' })}>
      <div mix={css({ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' })}>
        <div mix={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
          <img src="/finishi-logo.svg" alt="Finishi" mix={css({ height: '28px', width: 'auto' })} />
          <div mix={css({ display: 'flex', alignItems: 'center', gap: '12px' })}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/instagram-icon.svg" alt="Instagram" mix={css({ width: '20px', height: '20px' })} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/linkedin-icon.svg" alt="LinkedIn" mix={css({ width: '20px', height: '20px' })} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/email-icon.svg" alt="LinkedIn" mix={css({ width: '20px', height: '20px' })} />
            </a>
          </div>
        </div>
        <p mix={css({ margin: 0, fontSize: '13px', color: 'var(--text-muted)' })}>
          AI-powered learning built for completion, not distraction.
        </p>
        <p mix={css({ margin: '8px 0 0', fontSize: '12px', color: 'var(--text-muted)' })}>
          &copy; {new Date().getFullYear()} Finishi. Built for people tired of starting and never finishing.
        </p>
      </div>
    </footer>
  )
}

// ── Home Page ─────────────────────────────────────────────────────────────────
export function HomePage(
  handle: Handle<{ status?: 'success' | 'error' | 'duplicate'; count?: number }>,
) {
  return () => {
    let { status, count } = handle.props
    return (
      <Document>
        <Navbar />
        <WaitlistDialog action={routes.waitlistJoin.href()} />
        <main id="main-content" mix={css({ width: '100%', maxWidth: '100vw', overflowX: 'hidden' })}>
          <Hero status={status} count={count} />
          <ProblemSection />
          <HowItWorksSection />
          <CoreFeaturesSection />
          <AudienceSection />
          <CtaBanner />
        </main>
        <Footer />
      </Document>
    )
  }
}

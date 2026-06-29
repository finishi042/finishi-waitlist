import { createController } from 'remix/router'

import { supabase, supabaseAdmin } from '../lib/supabase.server.ts'
import { assetServer } from '../assets.ts'
import { routes } from '../routes.ts'
import { HomePage } from '../ui/home-page.tsx'
import { AdminLoginPage, AdminDashboardPage } from '../ui/admin-page.tsx'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'changeme'
const SESSION_COOKIE = 'finishi_admin'

// Helper to build redirect URLs that respect X-Forwarded-Proto from proxies
function getRedirectUrl(request: Request, path: string): string {
  const url = new URL(request.url)
  // Check if we're behind a proxy (Cloud Run, etc.)
  const proto = request.headers.get('x-forwarded-proto')
  if (proto) {
    url.protocol = proto
  }
  url.pathname = path.split('?')[0]
  url.search = path.includes('?') ? '?' + path.split('?')[1] : ''
  return url.toString()
}

function isAdminAuthed(request: Request): boolean {
  let cookie = request.headers.get('cookie') ?? ''
  return cookie.includes(`${SESSION_COOKIE}=1`)
}

export default createController(routes, {
  actions: {
    // ── Static assets ────────────────────────────────────────────────────────
    async assets(context) {
      return (
        (await assetServer.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
      )
    },

    // ── Landing page ─────────────────────────────────────────────────────────
    async home(context) {
      let { count } = await supabase
        .from('waitlist')
        .select('id', { count: 'exact', head: true })
      let url = new URL(context.request.url)
      let status = url.searchParams.get('s') as 'success' | 'error' | 'duplicate' | undefined
      return context.render(<HomePage status={status ?? undefined} count={count ?? 0} />)
    },

    // ── Waitlist form POST ────────────────────────────────────────────────────
    async waitlistJoin(context) {
      let form = await context.request.formData()
      let email = String(form.get('email') ?? '').trim().toLowerCase()
      let learningGoal = String(form.get('learning_goal') ?? '').trim() || null

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.redirect(getRedirectUrl(context.request, '/?s=error'), 303)
      }

      let { data, error } = await supabaseAdmin.from('waitlist').insert({ email, learning_goal: learningGoal })

      if (error) {
        let s = error.code === '23505' ? 'duplicate'
              : error.code === 'PGRST205' ? 'setup'
              : 'error'
        const redirectUrl = getRedirectUrl(context.request, `/?s=${s}`)
        return Response.redirect(redirectUrl, 303)
      }

      const successUrl = getRedirectUrl(context.request, '/?s=success')
      return Response.redirect(successUrl, 303)
    },

    // ── Admin login GET ───────────────────────────────────────────────────────
    async adminPage(context) {
      if (isAdminAuthed(context.request)) {
        return Response.redirect(getRedirectUrl(context.request, routes.adminDashboard.href()), 302)
      }
      return context.render(<AdminLoginPage />)
    },

    // ── Admin login POST ──────────────────────────────────────────────────────
    async adminAction(context) {
      let form = await context.request.formData()
      let secret = String(form.get('secret') ?? '')

      if (secret !== ADMIN_SECRET) {
        return context.render(<AdminLoginPage error="Incorrect secret. Try again." />)
      }

      let dashUrl = getRedirectUrl(context.request, routes.adminDashboard.href())
      return new Response(null, {
        status: 302,
        headers: {
          Location: dashUrl,
          'Set-Cookie': `${SESSION_COOKIE}=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        },
      })
    },

    // ── Admin dashboard ───────────────────────────────────────────────────────
    async adminDashboard(context) {
      if (!isAdminAuthed(context.request)) {
        return Response.redirect(getRedirectUrl(context.request, routes.adminPage.href()), 302)
      }

      let { data: entries, count } = await supabaseAdmin
        .from('waitlist')
        .select('id, email, learning_goal, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })

      let today = new Date()
      today.setHours(0, 0, 0, 0)

      let todayCount = (entries ?? []).filter(
        (e) => new Date(e.created_at) >= today,
      ).length

      return context.render(
        <AdminDashboardPage
          entries={entries ?? []}
          total={count ?? 0}
          todayCount={todayCount}
        />,
      )
    },

    // ── Admin logout ──────────────────────────────────────────────────────────
    adminLogout(context) {
      let loginUrl = getRedirectUrl(context.request, routes.adminPage.href())
      return new Response(null, {
        status: 302,
        headers: {
          Location: loginUrl,
          'Set-Cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
        },
      })
    },
  },
})

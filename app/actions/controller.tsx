import { createController } from 'remix/router'

import { supabase, supabaseAdmin } from '../lib/supabase.server.ts'
import { assetServer } from '../assets.ts'
import { routes } from '../routes.ts'
import { HomePage } from '../ui/home-page.tsx'
import { AdminLoginPage, AdminDashboardPage } from '../ui/admin-page.tsx'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'changeme'
const SESSION_COOKIE = 'finishi_admin'

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

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.redirect(new URL('/?s=error', context.request.url), 303)
      }

      let { error } = await supabaseAdmin.from('waitlist').insert({ email })

      if (error) {
        // 23505 = unique violation (duplicate email)
        // PGRST205 = table not found (schema not run yet)
        let s = error.code === '23505' ? 'duplicate'
              : error.code === 'PGRST205' ? 'setup'
              : 'error'
        return Response.redirect(new URL(`/?s=${s}`, context.request.url), 303)
      }

      return Response.redirect(new URL('/?s=success', context.request.url), 303)
    },

    // ── Admin login GET ───────────────────────────────────────────────────────
    async adminPage(context) {
      if (isAdminAuthed(context.request)) {
        return Response.redirect(new URL(routes.adminDashboard.href(), context.request.url), 302)
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

      let dashUrl = new URL(routes.adminDashboard.href(), context.request.url)
      return new Response(null, {
        status: 302,
        headers: {
          Location: dashUrl.toString(),
          'Set-Cookie': `${SESSION_COOKIE}=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        },
      })
    },

    // ── Admin dashboard ───────────────────────────────────────────────────────
    async adminDashboard(context) {
      if (!isAdminAuthed(context.request)) {
        return Response.redirect(new URL(routes.adminPage.href(), context.request.url), 302)
      }

      let { data: entries, count } = await supabaseAdmin
        .from('waitlist')
        .select('id, email, created_at', { count: 'exact' })
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
      let loginUrl = new URL(routes.adminPage.href(), context.request.url)
      return new Response(null, {
        status: 302,
        headers: {
          Location: loginUrl.toString(),
          'Set-Cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
        },
      })
    },
  },
})

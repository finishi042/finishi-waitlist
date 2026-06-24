import { get, post, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  waitlistJoin: post('/waitlist'),
  adminPage: get('/admin'),
  adminAction: post('/admin'),
  adminDashboard: get('/admin/dashboard'),
  adminLogout: post('/admin/logout'),
})

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const anonKey = process.env.SUPABASE_ANON_KEY!

console.log('[Supabase] Initializing clients with:', {
  url,
  hasServiceKey: !!serviceKey,
  hasAnonKey: !!anonKey,
  serviceKeyPrefix: serviceKey?.substring(0, 20) + '...',
  anonKeyPrefix: anonKey?.substring(0, 20) + '...'
})

export const supabaseAdmin = createClient(url, serviceKey)
export const supabase = createClient(url, anonKey)

console.log('[Supabase] Clients initialized successfully')

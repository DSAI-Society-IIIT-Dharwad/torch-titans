import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export function createClient(): SupabaseClient<Database, 'public', any> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables')
  }

  // createBrowserClient currently doesn't always propagate the generic through the helper types
  // so cast to the strongly-typed SupabaseClient to ensure `.from()` and related methods are typed.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) as unknown as SupabaseClient<Database, 'public', any>
}

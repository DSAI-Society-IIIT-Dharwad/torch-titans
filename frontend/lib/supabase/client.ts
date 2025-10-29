import { createBrowserClient } from '@supabase/ssr'


// adding the api keys here 
// this will not be used in production
// adding so you can see the projects working.
export function createClient() {
  return createBrowserClient(
    "https://uzdmytfsczbsvnkrhyyp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZG15dGZzY3pic3Zua3JoeXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzMxNjMsImV4cCI6MjA3NzIwOTE2M30.K5c5kdkxJbvHDIJmqGrUg4gLxihJYkfrpbGX0EUSDZo"
  )
}

// pages/_app.tsx
import { useState } from 'react'
import { UserContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@supabase/supabase-js'
import type { AppProps } from 'next/app'
import 'leaflet/dist/leaflet.css'
import '../styles/globals.css'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </UserContextProvider>
  )
}

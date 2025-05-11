import { ReactNode, useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { User } from '@supabase/supabase-js'
import supabase from '../lib/supabaseClient'

type DashboardProps = {
  children: ReactNode
}

export default function Dashboard({ children }: DashboardProps) {
  const user = useUser() as User | null
  const [ulestEposter, setUlestEposter] = useState(0)

  useEffect(() => {
    const hentUlestEpost = async () => {
      if (!user || typeof user.id !== 'string') return

      const { count, error } = await supabase
        .from('epost')
        .select('*', { count: 'exact', head: true })
        .eq('til', user.id)
        .eq('ulest', true)
        .not('slettet', 'is', true)

      if (!error) {
        setUlestEposter(count || 0)
      }
    }

    hentUlestEpost()
  }, [user])

  return (
    <div className="min-h-screen p-8 bg-portalGul text-black">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Frilansportalen Dashboard</h1>
        {ulestEposter > 0 && (
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
            {ulestEposter} uleste meldinger
          </span>
        )}
      </header>
      <main>{children}</main>
    </div>
  )
}

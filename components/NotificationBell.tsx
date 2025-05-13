import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'
import { Bell } from 'lucide-react' // forutsetter at du har lucide-react installert

export default function NotificationBell() {
  const user = useUser()
  const [antall, setAntall] = useState(0)

  useEffect(() => {
    if (!user?.id) return

    const hentVarsler = async () => {
      const { data, error } = await supabase
        .from('varsler')
        .select('id')
        .eq('bruker_id', user.id)
        .eq('lest', false)

      if (error) {
        console.error('Feil ved henting av varsler:', error.message)
      } else {
        setAntall(data?.length || 0)
      }
    }

    hentVarsler()
  }, [user])

  return (
    <div className="relative inline-block">
      <Bell className="w-6 h-6 text-black" />
      {antall > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {antall}
        </span>
      )}
    </div>
  )
}

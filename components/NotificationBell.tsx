// components/NotificationBell.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { getNotifications } from '../lib/notifications'

export default function NotificationBell() {
  const user = useUser()
  const [antall, setAntall] = useState(0)

  useEffect(() => {
    const hentVarsler = async () => {
      if (!user || !('id' in user)) return
      const varsler = await getNotifications(user.id)
      const uleste = varsler.filter((v: any) => !v.lest).length
      setAntall(uleste)
    }

    hentVarsler()
  }, [user])

  return (
    <div className="relative">
      <svg
        className="w-6 h-6 text-black"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 00-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {antall > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
          {antall}
        </span>
      )}
    </div>
  )
}

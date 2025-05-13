import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useAuthGuard() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    // Brukeren er lastet inn og finnes ikke => redirect
    if (user === null) {
      router.push('/login')
    }
  }, [user, router])
}

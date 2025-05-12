// components/RapportNedlasting.tsx
import { useUser } from '@supabase/auth-helpers-react'
import { generateSimplePDF } from '../lib/pdf'

type Props = {
  tittel: string
  innhold: string
  brukLogo: boolean
}

export default function RapportNedlasting({ tittel, innhold, brukLogo }: Props) {
  const user = useUser()

  const lastNed = async () => {
    if (!user?.id) return

    const pdfBlob = await generateSimplePDF(tittel, innhold, user.id, brukLogo)

    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${tittel.replace(/\s+/g, '_')}.pdf`
    link.click()
  }

  return (
    <button
      onClick={lastNed}
      className="bg-black text-white px-4 py-2 rounded mt-4"
    >
      Last ned rapport (PDF)
    </button>
  )
}

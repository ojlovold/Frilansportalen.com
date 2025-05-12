// components/PDFLasting.tsx
import { useUser } from '@supabase/auth-helpers-react'
import { generateSimplePDF } from '../lib/pdf'

type Props = {
  tittel: string
  innhold: string
  brukLogo?: boolean
  knappetekst?: string
}

export default function PDFLasting({
  tittel,
  innhold,
  brukLogo = true,
  knappetekst = 'Last ned PDF',
}: Props) {
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
      {knappetekst}
    </button>
  )
}

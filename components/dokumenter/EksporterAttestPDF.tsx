import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // <-- fikset
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function EksporterAttestPDF() {
  const user = useUser()
  const [data, setData] = useState<any[]>([])
  const [status, setStatus] = useState<string>("")

  useEffect(() => {
    const hent = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('attester')
        .select('*')
        .eq('bruker_id', user.id)

      if (error) {
        setStatus('Feil ved henting av attester')
        console.error(error.message)
      } else {
        setData(data || [])
      }
    }

    hent()
  }, [user])

  const genererPDF = () => {
    if (data.length === 0) {
      setStatus("Ingen attester å eksportere")
      return
    }

    const doc = new jsPDF()
    autoTable(doc, {
      head: [['Tittel', 'Dato', 'Utsteder']],
      body: data.map((attest) => [
        attest.tittel || '–',
        new Date(attest.dato).toLocaleDateString(),
        attest.utsteder || '–'
      ]),
    })
    doc.save('attester.pdf')
    setStatus("PDF generert og lastet ned")
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <button onClick={genererPDF} className="bg-black text-white px-4 py-2 rounded">
        Eksporter attester som PDF
      </button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  )
}

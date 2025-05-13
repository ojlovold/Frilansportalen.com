// components/dokumenter/EksporterAttestPDF.tsx
import { useSafeUser } from "@/lib/useSafeUser"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useState } from "react"

export default function EksporterAttestPDF() {
  const result = useSafeUser()
  const user = (result as any)?.user
  const [data, setData] = useState<any[]>([])
  const [status, setStatus] = useState<string>("")

  const genererPDF = () => {
    if (!user) return setStatus("Ikke innlogget")

    const doc = new jsPDF()
    doc.text("Helseattest", 14, 16)
    autoTable(doc, {
      startY: 24,
      head: [["Navn", "Fødselsnummer", "Gyldig til"]],
      body: data,
    })
    doc.save("attest.pdf")
    setStatus("PDF generert")
  }

  return (
    <div>
      <button onClick={genererPDF} className="bg-black text-white px-4 py-2 rounded">
        Generer PDF
      </button>
      {status && <p>{status}</p>}
    </div>
  )
}

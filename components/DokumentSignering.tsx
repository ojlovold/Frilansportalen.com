// components/DokumentSignering.tsx
import { useSafeUser } from "@/lib/useSafeUser"
import type { User } from "@supabase/supabase-js"
import supabase from "@/lib/supabaseClient"
import { useState } from "react"

export default function DokumentSignering() {
  const { user } = useSafeUser()
  const [status, setStatus] = useState("")

  const signerDokument = async () => {
    if (!user) return setStatus("Ingen bruker logget inn")
    try {
      // Her kan du legge inn signeringslogikk
      setStatus("Dokument signert!")
    } catch (err) {
      setStatus("Feil ved signering")
    }
  }

  return (
    <div className="p-4 border rounded bg-white text-black">
      <h2 className="text-xl font-bold mb-2">Signér dokument</h2>
      <button onClick={signerDokument} className="bg-black text-white px-4 py-2 rounded">
        Signér nå
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  )
}

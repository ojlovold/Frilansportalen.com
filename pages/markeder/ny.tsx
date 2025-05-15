import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function NyAnnonse() {
  const router = useRouter();
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [pris, setPris] = useState("");
  const [lokasjon, setLokasjon] = useState("");
  const [type, setType] = useState("produkt");
  const [objekttype, setObjekttype] = useState("");
  const [aiForslag, setAiForslag] = useState("");

  useEffect(() => {
    const hentAiForslag = async () => {
      if (!objekttype) return;
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Hva er den beste kategorien for objektet "${objekttype}"? Svar kun med ett ord.` })
      });
      const json = await response.json();
      setAiForslag(json.svar);
    };

    const timeout = setTimeout(hentAiForslag, 600);
    return () => clearTimeout(timeout);
  }, [objekttype]);

  const publiser = async () => {
    const { data, error } = await supabase.from("markedsplass").insert([
      {
        tittel,
        beskrivelse,
        pris: pris ? parseInt(pris) : null,
        lokasjon,
        type,
        objekttype,
        ai_kategori: aiForslag
      }
    ]);

    if (!error) router.push("/markeder/sjappa");
  };

  return (
    <main className="bg-yellow-300 min-h-screen p-6 text-black">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Legg ut annonse</h1>

        <Input placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} />
        <Textarea placeholder="Beskrivelse" value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)} />
        <Input placeholder="Pris" type="number" value={pris} onChange={(e) => setPris(e.target.value)} />
        <Input placeholder="Sted eller postnummer" value={lokasjon} onChange={(e) => setLokasjon(e.target.value)} />

        <select
          className="bg-white border border-black rounded p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="produkt">Produkt</option>
          <option value="tjeneste">Tjeneste</option>
          <option value="ønskes kjøpt">Ønskes kjøpt</option>
        </select>

        <div className="space-y-2">
          <Input
            placeholder="Hva selger du? (f.eks. klær, bord, vaskemaskin)"
            value={objekttype}
            onChange={(e) => setObjekttype(e.target.value)}
          />
          {aiForslag && (
            <div className="bg-white text-black p-2 rounded shadow text-sm">
              Forslag: <strong>{aiForslag}</strong> {aiForslag !== objekttype && (
                <button
                  onClick={() => setObjekttype(aiForslag)}
                  className="ml-2 px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                >Bruk forslag</button>
              )}
            </div>
          )}
        </div>

        <Button onClick={publiser}>Publiser annonse</Button>
      </div>
    </main>
  );
}

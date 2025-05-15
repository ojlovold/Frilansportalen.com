import { useState } from "react";
import Head from "next/head";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function NyMarkedsannonse() {
  const [tittel, setTittel] = useState("");
  const [kategori, setKategori] = useState("");
  const [type, setType] = useState("produkt");
  const [lokasjon, setLokasjon] = useState("");
  const [pris, setPris] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [bilde, setBilde] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Lagrer...");

    let bildeUrl = null;
    if (bilde) {
      const filnavn = `${Date.now()}-${bilde.name}`;
      const { data, error } = await supabase.storage.from("markedsbilder").upload(filnavn, bilde);
      if (error) {
        setStatus("Kunne ikke laste opp bilde");
        return;
      }
      bildeUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/markedsbilder/${filnavn}`;
    }

    const { error } = await supabase.from("markedsplass").insert({
      tittel,
      kategori,
      type,
      lokasjon,
      pris: parseInt(pris),
      beskrivelse,
      bilde: bildeUrl,
    });

    if (error) {
      setStatus("Feil ved publisering");
    } else {
      setStatus("Publisert!");
      router.push("/markeder/sjappa");
    }
  };

  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6">
      <Head>
        <title>Ny annonse | Frilansportalen</title>
      </Head>
      <div className="max-w-3xl mx-auto bg-gray-200 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Legg ut ny annonse</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} required />
          <Input placeholder="Sted / postnummer" value={lokasjon} onChange={(e) => setLokasjon(e.target.value)} required />

          <select value={kategori} onChange={(e) => setKategori(e.target.value)} required className="w-full border border-black rounded p-2 bg-white">
            <option value="">Velg kategori</option>
            <option value="Elektronikk">Elektronikk</option>
            <option value="Møbler">Møbler</option>
            <option value="Tjenester">Tjenester</option>
            <option value="Diverse">Diverse</option>
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-black rounded p-2 bg-white">
            <option value="produkt">Produkt</option>
            <option value="tjeneste">Tjeneste</option>
            <option value="ønskes kjøpt">Ønskes kjøpt</option>
          </select>

          <Input type="number" placeholder="Pris (valgfritt)" value={pris} onChange={(e) => setPris(e.target.value)} />

          <Textarea placeholder="Beskrivelse" value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)} rows={6} />

          <input type="file" onChange={(e) => setBilde(e.target.files?.[0] || null)} />

          <Button type="submit">Publiser annonse</Button>
          {status && <p className="text-sm text-gray-700">{status}</p>}
        </form>
      </div>
    </main>
  );
}

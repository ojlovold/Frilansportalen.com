import Head from "next/head";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { supabase } from "../../lib/supabaseClient";

export default function NyStilling() {
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [kategori, setKategori] = useState("fast");
  const [fagfelt, setFagfelt] = useState("");
  const [lokasjonTekst, setLokasjonTekst] = useState("");
  const [lokasjonObjekt, setLokasjonObjekt] = useState(null);
  const [foreslatt, setForeslatt] = useState("");
  const [publisert, setPublisert] = useState(false);

  const brukAI = async () => {
    if (!tittel) return;
    const respons = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `Lag en profesjonell stillingsannonse for: ${tittel}` }),
    });
    const data = await respons.json();
    setBeskrivelse(data.forslag);
    setForeslatt("(forslag generert av AI)");
  };

  const hentLokasjon = async () => {
    if (!lokasjonTekst) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(lokasjonTekst)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const treff = data[0];
        setLokasjonObjekt({
          tekst: lokasjonTekst,
          postnummer: treff.postcode || null,
          kommune: treff.display_name?.split(",")[1]?.trim() || null,
          lat: parseFloat(treff.lat),
          lng: parseFloat(treff.lon),
        });
      }
    } catch (err) {
      console.error("Feil ved henting av lokasjon:", err);
    }
  };

  const publiserStilling = async () => {
    const { error } = await supabase.from("stilling").insert({
      tittel,
      beskrivelse,
      kategori,
      fagfelt,
      lokasjon: lokasjonObjekt
    });
    if (!error) setPublisert(true);
    else alert("Kunne ikke publisere: " + error.message);
  };

  return (
    <>
      <Head>
        <title>Ny stilling | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-yellow-300 text-black p-6">
        <section className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Opprett ny stillingsannonse</h1>

          <Card>
            <CardContent className="p-4 space-y-4">
              <label className="block">Tittel:
                <Input value={tittel} onChange={(e) => setTittel(e.target.value)} placeholder="F.eks. Rørlegger søkes" />
              </label>
              <Button onClick={brukAI}>Foreslå tekst med AI</Button>
              <label className="block">Beskrivelse {foreslatt}:
                <textarea
                  className="w-full border border-black rounded p-2"
                  rows={6}
                  value={beskrivelse}
                  onChange={(e) => setBeskrivelse(e.target.value)}
                  placeholder="Beskriv stillingen, krav og fordeler"
                />
              </label>
              <label className="block">Stillingstype:
                <select
                  className="w-full border border-black rounded p-2"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                >
                  <option value="fast">Fast stilling</option>
                  <option value="sommerjobb">Sommerjobb</option>
                  <option value="småjobb">Småjobb / deltidsoppdrag</option>
                </select>
              </label>
              <label className="block">Fagfelt:
                <Input value={fagfelt} onChange={(e) => setFagfelt(e.target.value)} placeholder="F.eks. Elektriker, Økonomi, Design..." />
              </label>
              <label className="block">Lokasjon:
                <Input value={lokasjonTekst} onChange={(e) => setLokasjonTekst(e.target.value)} placeholder="F.eks. Bergen eller 5003" />
              </label>
              <Button onClick={hentLokasjon}>Hent stedinfo</Button>
              {lokasjonObjekt && (
                <p className="text-sm mt-1 text-green-700">
                  Finner {lokasjonObjekt.tekst} ({lokasjonObjekt.kommune}) – Lat: {lokasjonObjekt.lat}, Lng: {lokasjonObjekt.lng}
                </p>
              )}
              <Button className="mt-4" onClick={publiserStilling}>Publiser stilling</Button>
              {publisert && <p className="text-green-700 font-semibold mt-2">Stillingen er publisert!</p>}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}

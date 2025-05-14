import Head from "next/head";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function NyStilling() {
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [kategori, setKategori] = useState("fast");
  const [fagfelt, setFagfelt] = useState("");
  const [lokasjon, setLokasjon] = useState("");
  const [foreslatt, setForeslatt] = useState("");

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
                <Input value={lokasjon} onChange={(e) => setLokasjon(e.target.value

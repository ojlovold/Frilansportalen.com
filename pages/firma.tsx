import Head from "next/head";
import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function FirmaProfil() {
  const [orgnr, setOrgnr] = useState("");
  const [firmanavn, setFirmanavn] = useState("");
  const [lokasjon, setLokasjon] = useState("");
  const [testvalg, setTestvalg] = useState("none");
  const [testlenke, setTestlenke] = useState("");

  useEffect(() => {
    const hentFirmainfo = async () => {
      if (orgnr.length !== 9) return;
      try {
        const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`);
        if (!res.ok) return;
        const data = await res.json();
        setFirmanavn(data.navn || "");
        setLokasjon(
          data.forretningsadresse?.postnummer +
            " " +
            data.forretningsadresse?.kommune || ""
        );
      } catch (err) {
        console.error("Feil ved henting av firmainfo", err);
      }
    };
    hentFirmainfo();
  }, [orgnr]);

  return (
    <>
      <Head>
        <title>Firmaprofil | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-yellow-300 text-black p-6">
        <section className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Opprett firmaprofil</h1>

          <Card>
            <CardContent className="p-4 space-y-4">
              <label className="block">
                Organisasjonsnummer:
                <Input
                  type="text"
                  value={orgnr}
                  onChange={(e) => setOrgnr(e.target.value)}
                  placeholder="935411343"
                />
              </label>
              <label className="block">
                Firmanavn:
                <Input
                  type="text"
                  value={firmanavn}
                  onChange={(e) => setFirmanavn(e.target.value)}
                  placeholder="Navn på firma"
                />
              </label>
            </CardContent>
          </Card>

          <Card id="plassering">
            <CardContent className="p-4 space-y-4">
              <label className="block">
                Lokasjon (postnummer, sted eller GPS):
                <Input
                  type="text"
                  value={lokasjon}
                  onChange={(e) => setLokasjon(e.target.value)}
                  placeholder="Oslo, 0150"
                />
              </label>
            </CardContent>
          </Card>

          <Card id="personlighetstester">
            <CardContent className="p-4 space-y-4">
              <label className="block">
                Velg testalternativ:
                <select
                  className="w-full border border-black rounded p-2"
                  value={testvalg}
                  onChange={(e) => setTestvalg(e.target.value)}
                >
                  <option value="none">Ingen test</option>
                  <option value="bigfive">Big Five (innebygd)</option>
                  <option value="disc">DISC (innebygd)</option>
                  <option value="lenke">Ekstern testlenke</option>
                  <option value="ai">AI-generert test (automatisk)</option>
                </select>
              </label>

              {testvalg === "lenke" && (
                <label className="block">
                  Testlenke:
                  <Input
                    type="url"
                    value={testlenke}
                    onChange={(e) => setTestlenke(e.target.value)}
                    placeholder="https://alvalabs.io/..."
                  />
                </label>
              )}

              {testvalg === "ai" && (
                <p className="text-sm italic">AI-generert test vil bli satt opp automatisk og analysert i intervju-dashbordet.</p>
              )}
            </CardContent>
          </Card>

          <Button>Lagre firmaprofil</Button>
        </section>
      </main>
    </>
  );
}

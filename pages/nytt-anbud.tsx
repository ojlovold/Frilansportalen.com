import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function NyttAnbud() {
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [pris, setPris] = useState<number>(0);
  const [melding, setMelding] = useState("");

  const kalkulerPris = () => {
    const ord = beskrivelse.trim().split(/\s+/).length;
    const basis = 500;
    const ekstra = ord > 50 ? (ord - 50) * 10 : 0;
    const total = basis + ekstra;
    setPris(total);
  };

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id || !tittel.trim()) return;

    const { error } = await supabase.from("anbud").insert({
      bruker_id: id,
      tittel,
      oppdragsbeskrivelse: beskrivelse,
      pris,
    });

    if (error) {
      setMelding("Feil under lagring.");
    } else {
      setMelding("Anbud registrert!");
      setTittel(""); setBeskrivelse(""); setPris(0);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Nytt anbud | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Opprett nytt anbud</h1>

        <input
          value={tittel}
          onChange={(e) => setTittel(e.target.value)}
          placeholder="Tittel"
          className="w-full p-2 border rounded mb-3"
        />

        <textarea
          value={beskrivelse}
          onChange={(e) => setBeskrivelse(e.target.value)}
          placeholder="Oppdragsbeskrivelse"
          className="w-full p-2 border rounded mb-3 h-32 resize-none"
        />

        <div className="mb-3 text-sm">
          Estimert pris: <strong>{pris} kr</strong>
        </div>

        <button
          onClick={kalkulerPris}
          className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 mr-2"
        >
          Kalkuler pris
        </button>

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          Lagre anbud
        </button>

        {melding && <p className="text-green-600 text-sm mt-4">{melding}</p>}
      </div>
    </Layout>
  );
}

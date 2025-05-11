import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import useAiAssist from "../utils/useAiAssist";
import SuccessBox from "../components/SuccessBox";

export default function Meldinger() {
  const [meldinger, setMeldinger] = useState<any[]>([]);
  const [ny, setNy] = useState("");
  const [valgtId, setValgtId] = useState<string | null>(null);
  const [melding, setMelding] = useState("");

  const { getSvar, svar, laster, feil } = useAiAssist();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data } = await supabase
        .from("meldinger")
        .select("*")
        .or(`fra.eq.${id},til.eq.${id}`)
        .order("tidspunkt", { ascending: false });

      setMeldinger(data || []);
    };

    hent();
  }, []);

  const send = async (tekst: string) => {
    const bruker = await supabase.auth.getUser();
    const fra = bruker.data.user?.id;
    if (!fra || !valgtId) return;

    const original = meldinger.find((m) => m.id === valgtId);
    const til = original.fra === fra ? original.til : original.fra;

    await supabase.from("meldinger").insert({
      fra,
      til,
      tekst,
      tidspunkt: new Date().toISOString(),
    });

    await supabase.from("varsler").insert({
      bruker_id: til,
      tekst: "Du har fått en ny melding",
      lenke: "/meldinger",
    });

    setNy(""); setValgtId(null); setMelding("Melding sendt");
  };

  const foreslå = () => {
    const original = meldinger.find((m) => m.id === valgtId);
    const prompt = `Jeg ønsker å svare på følgende melding på en hyggelig og profesjonell måte:\n\n"${original.tekst}"\n\nGi meg et godt og vennlig svar.`;
    getSvar(prompt, "Du er en høflig og smart samtalepartner for et frilansnettverk.");
  };

  return (
    <Layout>
      <Head><title>Meldinger | Frilansportalen</title></Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Meldinger</h1>

        {melding && <SuccessBox melding={melding} />}

        <ul className="space-y-4 text-sm mb-6">
          {meldinger.map((m) => (
            <li key={m.id} className="bg-white border rounded p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">
                {new Date(m.tidspunkt).toLocaleString("no-NO")}
              </p>
              <p className="mb-2">{m.tekst}</p>
              <button
                onClick={() => setValgtId(m.id)}
                className="text-xs underline text-blue-600 hover:text-blue-800"
              >
                Svar
              </button>
            </li>
          ))}
        </ul>

        {valgtId && (
          <div className="mb-8">
            <textarea
              value={ny}
              onChange={(e) => setNy(e.target.value)}
              placeholder="Skriv svar..."
              className="w-full p-2 border rounded mb-2 h-24"
            />
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => send(ny)}
                className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
              >
                Send svar
              </button>
              <button
                onClick={foreslå}
                className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700"
              >
                Foreslå med AI
              </button>
            </div>
            {laster && <p className="text-xs text-gray-500">Henter AI-forslag...</p>}
            {feil && <p className="text-xs text-red-600">{feil}</p>}
            {svar && (
              <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-2 rounded">
                <strong>AI-forslag:</strong> {svar}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/router";

export default function Kvitteringer() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const [kvitteringer, setKvitteringer] = useState<any[]>([]);
  const [valgte, setValgte] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [visningsvaluta, setVisningsvaluta] = useState("NOK");
  const [kurser, setKurser] = useState<Record<string, number>>({});
  const [valutaer, setValutaer] = useState<string[]>([]);

  useEffect(() => {
    const hentValutaer = async () => {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setValutaer(Object.keys(data).sort());
    };
    hentValutaer();
  }, []);

  useEffect(() => {
    const hent = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("kvitteringer")
        .select("*")
        .eq("bruker_id", user.id)
        .order("dato", { ascending: false });
      if (!error && data) {
        setKvitteringer(data);
        const unike = [...new Set(data.map((k) => k.valuta).filter((v) => v !== visningsvaluta))];
        const iso = new Date().toISOString().split("T")[0];
        const promises = unike.map(async (val) => {
          const res = await fetch(`https://api.frankfurter.app/${iso}?from=${val}&to=${visningsvaluta}`);
          const json = await res.json();
          return [val, json.rates?.[visningsvaluta] || 0];
        });
        const results = await Promise.all(promises);
        const rateMap: Record<string, number> = {};
        results.forEach(([fra, kurs]) => (rateMap[fra] = kurs));
        setKurser(rateMap);
      }
    };
    hent();
  }, [user, visningsvaluta]);

  const slett = async (id: string, fil_url: string) => {
    if (!confirm("Slette kvittering permanent?")) return;
    const path = fil_url.split("/").slice(7).join("/");
    await supabase.storage.from("kvitteringer").remove([path]);
    await supabase.from("kvitteringer").delete().eq("id", id);
    setKvitteringer((prev) => prev.filter((k) => k.id !== id));
  };

  const toggleValgt = (id: string) => {
    setValgte((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const visVedlegg = () => {
    const valgteUrls = kvitteringer
      .filter((k) => valgte.includes(k.id))
      .map((k) => k.fil_url);
    setStatus("Vedlegg:\n" + valgteUrls.join("\n"));
  };

  const lagPDF = () => {
    const pdf = new jsPDF();
    autoTable(pdf, {
      head: [["Dato", "Tittel", "Original", visningsvaluta]],
      body: kvitteringer.map((k) => {
        const omregnet = kurser[k.valuta]
          ? (parseFloat(k.belop) * kurser[k.valuta]).toFixed(2)
          : k.belop;
        return [
          k.dato,
          k.tittel,
          `${k.belop} ${k.valuta}`,
          `${omregnet} ${visningsvaluta}`,
        ];
      }),
    });
    pdf.save("kvitteringer.pdf");
  };

  const skrivUt = () => window.print();

  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow"
        >
          ← Tilbake
        </button>

        <h1 className="text-2xl font-bold mb-4">Mine kvitteringer</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={visningsvaluta}
            onChange={(e) => setVisningsvaluta(e.target.value)}
            className="p-2 border rounded bg-gray-100"
          >
            {valutaer.map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
          <button onClick={lagPDF} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow">
            Last ned PDF
          </button>
          <button onClick={skrivUt} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow">
            Skriv ut
          </button>
          <button onClick={visVedlegg} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow">
            Vis vedlegg for e-post
          </button>
        </div>

        {status && (
          <pre className="bg-gray-100 p-3 mb-4 text-sm whitespace-pre-wrap rounded">
            {status}
          </pre>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border"></th>
                <th className="p-2 border">Dato</th>
                <th className="p-2 border">Tittel</th>
                <th className="p-2 border">Beløp (original)</th>
                <th className="p-2 border">I {visningsvaluta}</th>
                <th className="p-2 border">Fil</th>
                <th className="p-2 border">Handling</th>
              </tr>
            </thead>
            <tbody>
              {kvitteringer.map((k) => {
                const omregnet = kurser[k.valuta]
                  ? (parseFloat(k.belop) * kurser[k.valuta]).toFixed(2)
                  : k.belop;

                return (
                  <tr key={k.id} className="text-center">
                    <td className="p-2 border">
                      <input
                        type="checkbox"
                        checked={valgte.includes(k.id)}
                        onChange={() => toggleValgt(k.id)}
                      />
                    </td>
                    <td className="p-2 border">{k.dato}</td>
                    <td className="p-2 border whitespace-pre-wrap break-words max-w-xs">{k.tittel}</td>
                    <td className="p-2 border">{k.belop} {k.valuta}</td>
                    <td className="p-2 border">{omregnet} {visningsvaluta}</td>
                    <td className="p-2 border">
                      <a href={k.fil_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        Åpne
                      </a>
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => slett(k.id, k.fil_url)}
                        className="text-red-600 hover:underline"
                      >
                        Slett
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import Head from "next/head";
import Layout from "../components/Layout";
import PdfExport from "../components/PdfExport";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Kjorebok() {
  const [ruter, setRuter] = useState<any[]>([]);
  const [fra, setFra] = useState("");
  const [til, setTil] = useState("");
  const [km, setKm] = useState("");
  const [formål, setFormål] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("kjorebok")
        .select("*")
        .eq("bruker_id", id)
        .order("dato", { ascending: false });

      setRuter(data || []);
      setLoading(false);
    };

    hent();
  }, [router]);

  const leggTil = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const antallKm = parseFloat(km);
    const sats = 4.48;
    const sum = Math.round(antallKm * sats * 100) / 100;

    await supabase.from("kjorebok").insert({
      bruker_id: id,
      fra,
      til,
      km: antallKm,
      formål,
      belop: sum,
      dato: new Date().toISOString(),
    });

    setFra("");
    setTil("");
    setKm("");
    setFormål("");
    router.reload();
  };

  const total = ruter.reduce((sum, r) => sum + (r.belop || 0), 0);

  const kolonner = ["Dato", "Fra", "Til", "Km", "Formål", "Beløp"];
  const rader = ruter.map((r) => [
    r.dato?.split("T")[0],
    r.fra,
    r.til,
    r.km,
    r.formål,
    `${r.belop?.toFixed(2)} kr`,
  ]);

  return (
    <Layout>
      <Head>
        <title>Kjørebok | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Kjørebok</h1>

      <div className="max-w-lg space-y-4 mb-10">
        <input placeholder="Fra" value={fra} onChange={(e) => setFra(e.target.value)} className="p-2 border rounded w-full" />
        <input placeholder="Til" value={til} onChange={(e) => setTil(e.target.value)} className="p-2 border rounded w-full" />
        <input placeholder="Antall km" value={km} onChange={(e) => setKm(e.target.value)} className="p-2 border rounded w-full" type="number" />
        <input placeholder="Formål" value={formål} onChange={(e) => setFormål(e.target.value)} className="p-2 border rounded w-full" />
        <button onClick={leggTil} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
          Registrer tur
        </button>
      </div>

      {loading ? (
        <p className="text-sm">Laster...</p>
      ) : ruter.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen turer registrert ennå.</p>
      ) : (
        <>
          <table className="w-full text-sm border border-black bg-white mb-6">
            <thead>
              <tr className="bg-black text-white text-left">
                <th className="p-2">Dato</th>
                <th className="p-2">Fra</th>
                <th className="p-2">Til</th>
                <th className="p-2">Km</th>
                <th className="p-2">Formål</th>
                <th className="p-2">Beløp</th>
              </tr>
            </thead>
            <tbody>
              {ruter.map((r, i) => (
                <tr key={i} className="border-t border-black">
                  <td className="p-2">{r.dato?.split("T")[0]}</td>
                  <td className="p-2">{r.fra}</td>
                  <td className="p-2">{r.til}</td>
                  <td className="p-2">{r.km}</td>
                  <td className="p-2">{r.formål}</td>
                  <td className="p-2">{r.belop?.toFixed(2)} kr</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              Totalt: {total.toFixed(2)} kr
            </p>

            <PdfExport
              tittel="Kjørebok"
              filnavn="kjorebok"
              kolonner={kolonner}
              rader={rader}
            />
          </div>
        </>
      )}
    </Layout>
  );
}

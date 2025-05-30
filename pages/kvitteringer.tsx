import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
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
    setStatus("Vis vedlegg");
  };

  const lastNedValgte = () => {
    kvitteringer
      .filter((k) => valgte.includes(k.id))
      .forEach((k) => {
        const link = document.createElement("a");
        link.href = k.fil_url;
        link.download = k.tittel || "kvittering";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  const kopierLenker = () => {
    const urls = kvitteringer
      .filter((k) => valgte.includes(k.id))
      .map((k) => k.fil_url)
      .join("\n");
    navigator.clipboard.writeText(urls);
    setStatus("Lenker kopiert!");
  };

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
          <button onClick={lastNedValgte} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow">
            Last ned valgte
          </button>
          <button onClick={visVedlegg} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow">
            Vis vedlegg for e-post
          </button>
        </div>

        {status === "Vis vedlegg" && valgte.length > 0 && (
          <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm">
            <h2 className="font-semibold mb-2">Valgte vedlegg:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {kvitteringer
                .filter((k) => valgte.includes(k.id))
                .map((k) => (
                  <li key={k.id}>
                    

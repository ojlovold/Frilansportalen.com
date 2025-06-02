import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Status {
  navn: string;
  status: "ok" | "feil";
  sist?: string;
}

export default function AdminSystemstatus() {
  const [statuser, setStatuser] = useState<Status[]>([]);
  const [dummy, setDummy] = useState<boolean | null>(null);
  const [kommentar, setKommentar] = useState<string>("");
  const [laster, setLaster] = useState(false);

  const hentStatus = async () => {
    setLaster(true);
    const resultat: Status[] = [];

    const test = async (navn: string, fn: () => Promise<boolean>) => {
      try {
        const ok = await fn();
        resultat.push({ navn, status: ok ? "ok" : "feil", sist: new Date().toISOString() });
      } catch {
        resultat.push({ navn, status: "feil", sist: new Date().toISOString() });
      }
    };

    await test("Supabase", async () => {
      const { data } = await supabase.from("settings").select("id").limit(1);
      return !!data;
    });

    await test("Vercel", async () => {
      const r = await fetch("/api/ping");
      return r.ok;
    });

    await test("Stripe", async () => {
      const r = await fetch("/api/stripe/status");
      return r.ok;
    });

    await test("Vipps", async () => {
      const r = await fetch("/api/vipps/status");
      return r.ok;
    });

    await test("Altinn", async () => {
      const r = await fetch("/api/altinn/status");
      return r.ok;
    });

    await test("E-post", async () => {
      const r = await fetch("/api/email/status");
      return r.ok;
    });

    setStatuser(resultat);
    setLaster(false);
  };

  const hentDummy = async () => {
    const { data } = await supabase.from("settings").select("dummyprofiler_aktiv").single();
    setDummy(data?.dummyprofiler_aktiv);
  };

  const toggleDummy = async () => {
    const { error } = await supabase
      .from("settings")
      .update({ dummyprofiler_aktiv: !dummy })
      .eq("id", "global");
    if (!error) hentDummy();
  };

  const hentKommentar = async () => {
    const { data } = await supabase.from("settings").select("systemmelding").single();
    setKommentar(data?.systemmelding || "");
  };

  const oppdaterKommentar = async () => {
    await supabase.from("settings").update({ systemmelding: kommentar }).eq("id", "global");
  };

  useEffect(() => {
    hentStatus();
    hentDummy();
    hentKommentar();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 items-center">
        <button
          onClick={hentStatus}
          className="bg-gray-800 text-white px-4 py-2 rounded shadow"
        >
          Oppdater status
        </button>
        <p className="text-sm text-gray-600">
          Sist testet: {statuser[0]?.sist ? new Date(statuser[0].sist).toLocaleTimeString() : "–"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statuser.map((s) => (
          <div
            key={s.navn}
            className={`p-4 rounded shadow ${
              s.status === "ok" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p className="font-semibold">{s.navn}</p>
            <p className="text-sm">Status: {s.status === "ok" ? "OK" : "Feil"}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">Dummyprofiler</h3>
        <button
          onClick={toggleDummy}
          className={`px-4 py-2 rounded shadow ${dummy ? "bg-green-600" : "bg-red-600"} text-white`}
        >
          {dummy ? "Skru AV dummyprofiler" : "Skru PÅ dummyprofiler"}
        </button>
        <p className="text-sm mt-1 text-gray-700">
          Nåværende status: {dummy === null ? "Laster..." : dummy ? "På" : "Av"}
        </p>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">Adminmelding</h3>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          value={kommentar}
          onChange={(e) => setKommentar(e.target.value)}
        />
        <button
          onClick={oppdaterKommentar}
          className="mt-2 bg-black text-white px-4 py-2 rounded"
        >
          Lagre melding
        </button>
      </div>
    </div>
  );
}

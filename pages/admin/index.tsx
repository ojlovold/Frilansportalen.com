import Head from "next/head";
import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function AdminDashboard() {
  const [vipps, setVipps] = useState<any>({});
  const [altinn, setAltinn] = useState<any>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [farge, setFarge] = useState("#FDE68A");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data: vippsData } = await supabase
        .from("integrasjoner")
        .select("*")
        .eq("id", "vipps")
        .maybeSingle();
      setVipps(vippsData || {});

      const { data: altinnData } = await supabase
        .from("integrasjoner")
        .select("*")
        .eq("id", "altinn")
        .maybeSingle();
      setAltinn(altinnData || {});

      const { data } = supabase.storage
        .from("branding")
        .getPublicUrl("logo.png");
      setLogoUrl(data?.publicUrl || null);
    };

    hent();
  }, []);

  const oppdater = async (id: string, data: any) => {
    setStatus("Lagrer...");
    const { error } = await supabase
      .from("integrasjoner")
      .upsert([{ id, ...data }]);
    setStatus(error ? "Feil ved lagring" : "Lagret!");
  };

  const lastOppLogo = async (fil: File) => {
    const { error } = await supabase.storage
      .from("branding")
      .upload("logo.png", fil, { upsert: true });
    if (!error) {
      const { data } = supabase.storage
        .from("branding")
        .getPublicUrl("logo.png");
      setLogoUrl(data?.publicUrl || null);
    }
  };

  return (
    <Dashboard>
      <Head>
        <title>Adminpanel | Frilansportalen</title>
      </Head>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Adminpanel</h1>

        {/* Vipps */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Vipps-konfigurasjon</h2>
          <input
            className="w-full border p-2 mb-2"
            placeholder="Client ID"
            value={vipps.client_id || ""}
            onChange={(e) => setVipps({ ...vipps, client_id: e.target.value })}
          />
          <input
            className="w-full border p-2 mb-2"
            placeholder="Client Secret"
            value={vipps.client_secret || ""}
            onChange={(e) =>
              setVipps({ ...vipps, client_secret: e.target.value })
            }
          />
          <input
            className="w-full border p-2 mb-2"
            placeholder="API-nøkkel"
            value={vipps.api_key || ""}
            onChange={(e) => setVipps({ ...vipps, api_key: e.target.value })}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => oppdater("vipps", vipps)}
          >
            Lagre Vipps
          </button>
        </div>

        {/* Altinn */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Altinn-konfigurasjon</h2>
          <textarea
            className="w-full border p-2 mb-2"
            placeholder="Sertifikat (PEM)"
            value={altinn.sertifikat || ""}
            onChange={(e) =>
              setAltinn({ ...altinn, sertifikat: e.target.value })
            }
          />
          <input
            className="w-full border p-2 mb-2"
            placeholder="Organisasjonsnummer"
            value={altinn.orgnr || ""}
            onChange={(e) => setAltinn({ ...altinn, orgnr: e.target.value })}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => oppdater("altinn", altinn)}
          >
            Lagre Altinn
          </button>
        </div>

        {/* Fargevalg */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Fargevalg</h2>
          <input
            type="color"
            value={farge}
            onChange={(e) => setFarge(e.target.value)}
            className="w-16 h-10 border"
          />
        </div>

        {/* Logoopplasting */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Logo</h2>
          {logoUrl && (
            <Image src={logoUrl} alt="Logo" width={120} height={120} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const fil = e.target.files?.[0];
              if (fil) lastOppLogo(fil);
            }}
            className="mt-2"
          />
        </div>

        {/* Statusmelding */}
        {status && <p className="text-sm text-green-700">{status}</p>}
      </div>
    </Dashboard>
  );
}

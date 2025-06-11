// pages/profil.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Profil() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [profil, setProfil] = useState<any>(null);
  const [omMeg, setOmMeg] = useState("");
  const [redigerer, setRedigerer] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hentProfil = async () => {
      if (!user) return;
      const { data } = await supabase.from("profiler").select("*").eq("id", user.id).single();
      if (data) {
        setProfil(data);
        setOmMeg(data.om_meg || "");
      }
    };
    hentProfil();
  }, [user]);

  const lagreOmMeg = async () => {
    if (!user) return;
    setStatus("Lagrer...");
    const { error } = await supabase.from("profiler").update({ om_meg: omMeg }).eq("id", user.id);
    if (error) setStatus("❌ Kunne ikke lagre");
    else {
      setStatus("✅ Lagret");
      setRedigerer(false);
    }
  };

  if (!profil) return <div className="p-6">Laster profil...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-black p-6">
      <Head>
        <title>Min profil</title>
      </Head>

      <div className="max-w-5xl mx-auto bg-white/80 rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3 space-y-4">
            {profil.bilde && (
              <Image
                src={profil.bilde}
                alt="Profilbilde"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-md"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{profil.navn}</h2>
              <p className="text-sm text-gray-600">{profil.rolle}</p>
            </div>
            <div className="text-sm text-gray-800">
              <p><strong>E-post:</strong> {profil.epost}</p>
              <p><strong>Telefon:</strong> {profil.telefon}</p>
              <p><strong>Adresse:</strong> {profil.adresse}, {profil.postnummer} {profil.poststed}</p>
              <p><strong>Fødselsdato:</strong> {profil.fodselsdato}</p>
              <p><strong>Kjønn:</strong> {profil.kjonn}</p>
              <p><strong>Nasjonalitet:</strong> {profil.nasjonalitet}</p>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Om meg</h3>
              {redigerer ? (
                <div>
                  <textarea
                    className="w-full p-3 border rounded"
                    rows={6}
                    value={omMeg}
                    onChange={(e) => setOmMeg(e.target.value)}
                  />
                  <button
                    onClick={lagreOmMeg}
                    className="bg-black text-white px-4 py-2 rounded mt-2"
                  >
                    Lagre
                  </button>
                </div>
              ) : (
                <div>
                  <p className="whitespace-pre-line">{omMeg || "Ingen informasjon lagt inn."}</p>
                  <button
                    onClick={() => setRedigerer(true)}
                    className="text-blue-600 text-sm mt-2 underline"
                  >
                    Rediger
                  </button>
                </div>
              )}
              {status && <p className="text-sm mt-2">{status}</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Flere bilder</h3>
              <p className="text-sm text-gray-600">Denne funksjonen kommer snart...</p>
            </div>

            <div>
              <Link href="/dashboard" className="text-sm text-blue-600 underline">
                Gå til dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

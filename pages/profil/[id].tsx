"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";
import Image from "next/image";

export default function OffentligProfil() {
  const router = useRouter();
  const { id } = router.query;
  const [profil, setProfil] = useState<any>(null);
  const [status, setStatus] = useState("Laster...");

  useEffect(() => {
    const hentProfil = async () => {
      if (!id || typeof id !== "string") return;

      const { data, error } = await supabase
        .from("profiler")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setStatus("❌ Fant ikke profil");
      } else {
        setProfil(data);
        setStatus("");
      }
    };

    hentProfil();
  }, [id]);

  if (status) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-black p-10">
        <p>{status}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <Head><title>{profil?.navn || "Profil"}</title></Head>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* TOPPSEKSJON */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 w-full">
            {profil?.bilde ? (
              <Image
                src={profil.bilde}
                alt="Profilbilde"
                width={400}
                height={400}
                className="rounded-xl border border-gray-700 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-xl text-gray-400 border border-gray-700">
                Ingen bilde
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold">{profil?.navn || "Navn ikke oppgitt"}</h1>
            <p className="text-sm text-gray-400">{profil?.poststed || profil?.adresse}</p>

            {profil?.roller?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {profil.roller.map((rolle: string) => (
                  <span key={rolle} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {rolle}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PERSONLIG INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profil.telefon && <p><strong>Telefon:</strong> {profil.telefon}</p>}
          {profil.epost && (
            <p>
              <strong>E-post:</strong>{" "}
              <a href={`mailto:${profil.epost}`} className="underline text-blue-400">
                {profil.epost}
              </a>
            </p>
          )}
          {profil.adresse && <p><strong>Adresse:</strong> {profil.adresse}</p>}
          {profil.postnummer && <p><strong>Postnummer:</strong> {profil.postnummer}</p>}
          {profil.poststed && <p><strong>Poststed:</strong> {profil.poststed}</p>}
          {profil.kjonn && <p><strong>Kjønn:</strong> {profil.kjonn}</p>}
          {profil.fodselsdato && <p><strong>Fødselsdato:</strong> {profil.fodselsdato}</p>}
          {profil.nasjonalitet && <p><strong>Nasjonalitet:</strong> {profil.nasjonalitet}</p>}
        </div>

        {/* OM MEG */}
        {profil.om_meg && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Om meg</h2>
            <p className="text-gray-200 whitespace-pre-wrap">{profil.om_meg}</p>
          </div>
        )}

        {/* CV */}
        {profil.cv && (
          <div>
            <h2 className="text-xl font-semibold mb-2">CV</h2>
            <p className="text-gray-200 whitespace-pre-wrap">{profil.cv}</p>
          </div>
        )}

        {/* GALLERI */}
        {profil.bilder?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Galleri</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {profil.bilder.map((url: string, i: number) => (
                <img
                  key={i}
                  src={url}
                  alt={`Bilde ${i}`}
                  className="w-full h-40 object-cover rounded border border-gray-600"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

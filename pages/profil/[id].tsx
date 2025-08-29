""use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";
import Image from "next/image";
import { format } from "date-fns";

export default function OffentligProfil() {
  const router = useRouter();
  const { id } = router.query;
  const [profil, setProfil] = useState<any>(null);
  const [status, setStatus] = useState("Laster...");
  const [tilgjengelighet, setTilgjengelighet] = useState<any[]>([]);
  const [filter, setFilter] = useState<"alle" | "ledig">("alle");

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

    const hentTilgjengelighet = async () => {
      if (!id || typeof id !== "string") return;
      const { data } = await supabase
        .from("tilgjengelighet")
        .select("*")
        .eq("id", id);
      if (data) setTilgjengelighet(data);
    };

    hentProfil();
    hentTilgjengelighet();
  }, [id]);

  if (status) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-black p-10">
        <p>{status}</p>
      </main>
    );
  }

  const filtrerteTider = filter === "ledig"
    ? tilgjengelighet.filter((t) => t.status === "ledig")
    : tilgjengelighet;

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

        {/* TILGJENGELIGHET */}
        {filtrerteTider.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Tilgjengelighet</h2>
            <div className="flex gap-4 mb-3">
              <button
                onClick={() => setFilter("alle")}
                className={`px-3 py-1 rounded ${filter === "alle" ? "bg-gray-700 text-white" : "bg-gray-600 text-gray-300"}`}
              >
                Vis alle
              </button>
              <button
                onClick={() => setFilter("ledig")}
                className={`px-3 py-1 rounded ${filter === "ledig" ? "bg-green-700 text-white" : "bg-gray-600 text-gray-300"}`}
              >
                Kun ledige
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {filtrerteTider
                .sort((a, b) => a.dato.localeCompare(b.dato) || a.fra_tid.localeCompare(b.fra_tid))
                .map((t, i) => (
                  <li key={`${t.dato}-${t.fra_tid}-${i}`} className="flex justify-between items-center bg-gray-800 p-2 rounded border border-gray-700">
                    <span>{format(new Date(t.dato), "dd.MM.yyyy")} kl. {t.fra_tid.slice(0, 5)}–{t.til_tid.slice(0, 5)}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        t.status === "ledig"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {t.status}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

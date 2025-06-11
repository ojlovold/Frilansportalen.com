// pages/registrer-informasjon.tsx
"use client";

import { useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function RegistrerInformasjon() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [navn, setNavn] = useState("");
  const [telefon, setTelefon] = useState("");
  const [rolle, setRolle] = useState("");
  const [bilde, setBilde] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const lagre = async () => {
    if (!user) return;
    setStatus("Lagrer...");

    let bildeUrl = null;
    if (bilde) {
      const filnavn = `${user.id}/profilbilde.${bilde.name.split(".").pop()}`;
      const { data, error } = await supabase.storage.from("profilbilder").upload(filnavn, bilde, {
        upsert: true,
        contentType: bilde.type,
      });
      if (error) {
        setStatus("❌ Feil ved opplasting av bilde");
        return;
      }
      bildeUrl = supabase.storage.from("profilbilder").getPublicUrl(filnavn).data.publicUrl;
    }

    const { error } = await supabase.from("profiler").upsert({
      id: user.id,
      navn,
      telefon,
      rolle,
      bilde: bildeUrl,
    });

    if (error) {
      setStatus("❌ Feil ved lagring: " + error.message);
    } else {
      setStatus("✅ Lagret");
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-black p-6">
      <Head>
        <title>Fullfør profil | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Fullfør profilen din</h1>

        <label className="block font-semibold">Navn</label>
        <input
          type="text"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <label className="block font-semibold">Telefonnummer</label>
        <input
          type="tel"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <label className="block font-semibold">Velg rolle</label>
        <select
          value={rolle}
          onChange={(e) => setRolle(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        >
          <option value="">Velg...</option>
          <option value="arbeidsgiver">Arbeidsgiver</option>
          <option value="frilanser">Frilanser</option>
          <option value="jobbsoker">Jobbsøker</option>
          <option value="tjenestetilbyder">Tjenestetilbyder</option>
        </select>

        <label className="block font-semibold">Profilbilde</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBilde(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <button
          onClick={lagre}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Lagre informasjon
        </button>

        {status && <p className="mt-4 text-sm text-center">{status}</p>}
      </div>
    </main>
  );
}

import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import supabase from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Innstillinger() {
  const user = useUser() as unknown as User;
  const [data, setData] = useState<any>({});
  const [status, setStatus] = useState<"klar" | "lagret" | "feil">("klar");
  const [logo, setLogo] = useState<File | null>(null);

  useEffect(() => {
    const hent = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("brukerprofiler")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setData(data);
    };

    hent();
  }, [user]);

  const lagre = async () => {
    if (!user?.id) return;

    if (logo) {
      await supabase.storage
        .from("profilbilder")
        .upload(`${user.id}.jpg`, logo, { upsert: true });
    }

    const { error } = await supabase
      .from("brukerprofiler")
      .update(data)
      .eq("id", user.id);

    setStatus(error ? "feil" : "lagret");
  };

  return (
    <>
      <Head>
        <title>Innstillinger | Frilansportalen</title>
        <meta name="description" content="Rediger profil, logo og firmainnstillinger" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Innstillinger</h1>

        <input
          type="text"
          placeholder="Navn"
          value={data.navn || ""}
          onChange={(e) => setData({ ...data, navn: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="text"
          placeholder="E-post"
          value={data.epost || ""}
          onChange={(e) => setData({ ...data, epost: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="text"
          placeholder="Telefon"
          value={data.telefon || ""}
          onChange={(e) => setData({ ...data, telefon: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />

        <textarea
          placeholder="Beskrivelse (CV, firma, bakgrunn...)"
          value={data.beskrivelse || ""}
          onChange={(e) => setData({ ...data, beskrivelse: e.target.value })}
          className="w-full p-2 border rounded mb-4 h-32"
        />

        <label className="block mb-2 font-semibold">Logoopplasting</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <label className="block mb-4">
          <input
            type="checkbox"
            checked={data.bruk_logo || false}
            onChange={(e) => setData({ ...data, bruk_logo: e.target.checked })}
          />
          <span className="ml-2">Bruk logo i dokumenter</span>
        </label>

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Lagre innstillinger
        </button>

        {status === "lagret" && (
          <p className="text-green-600 mt-4">Innstillinger lagret!</p>
        )}
        {status === "feil" && (
          <p className="text-red-600 mt-4">Noe gikk galt.</p>
        )}
      </main>
    </>
  );
}

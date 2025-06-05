// pages/reset-passord.tsx
"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [nyttPassord, setNyttPassord] = useState("");
  const [klar, setKlar] = useState(false);
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const fragment = window.location.hash;
    if (fragment.includes("access_token")) {
      const query = new URLSearchParams(fragment.replace("#", "?"));
      const access_token = query.get("access_token");
      const refresh_token = query.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(() => {
          setKlar(true);
        });
      }
    }
  }, [supabase]);

  const lagre = async () => {
    const { error } = await supabase.auth.updateUser({ password: nyttPassord });
    if (error) {
      setMelding("❌ " + error.message);
    } else {
      setMelding("✅ Passord oppdatert! Du sendes videre...");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-black p-6">
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Tilbakestill passord</h1>
        <p className="text-sm text-black/70 mb-4 text-center">
          Angi nytt passord for kontoen din.
        </p>

        <input
          type="password"
          placeholder="Nytt passord"
          value={nyttPassord}
          onChange={(e) => setNyttPassord(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <button
          onClick={lagre}
          disabled={!klar}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Lagre nytt passord
        </button>

        {melding && (
          <p className="text-center text-sm mt-4">{melding}</p>
        )}
      </div>
    </main>
  );
}

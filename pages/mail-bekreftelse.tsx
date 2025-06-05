// pages/mail-bekreftelse.tsx
"use client";

import { useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function MailBekreftelse() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // Hvis brukeren allerede er logget inn (verifisert), send dem videre
    if (user) {
      router.replace("/velkommen");
    }
  }, [user, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-white font-sans">
      <div className="bg-black/60 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 drop-shadow">Sjekk e-posten din</h1>
        <p className="text-white/90 text-sm mb-6">
          Vi har sendt en bekreftelseslenke til e-posten din.
          <br />
          Klikk på den for å aktivere kontoen din.
        </p>
        <p className="text-white/60 text-xs">
          Når kontoen er aktivert, vil du bli sendt videre automatisk.
        </p>
      </div>
    </main>
  );
}

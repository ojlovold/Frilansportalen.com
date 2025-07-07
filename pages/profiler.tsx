"use client";

import { useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";

export default function Profiler() {
  const user = useUser();

  return (
    <main className="min-h-screen bg-red-800 text-white flex flex-col items-center justify-center p-10">
      <Head><title>TEST – PROFILER.TSX I BRUK</title></Head>

      <h1 className="text-4xl font-bold mb-4">✅ DENNE PROFILER.TSX ER I BRUK</h1>
      <p className="text-xl mb-2">Du ser dette fordi denne filen er aktiv og lastet riktig.</p>

      {user ? (
        <div className="mt-4 p-4 bg-black text-green-400 rounded">
          <p>Logget inn som:</p>
          <p className="font-mono">{user.email}</p>
        </div>
      ) : (
        <p className="mt-4 text-yellow-300">Du er ikke logget inn.</p>
      )}
    </main>
  );
}

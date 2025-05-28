// pages/admin/opprett-bruker.tsx
import { useState } from "react";
import Layout from "../../components/Layout";

export default function OpprettBruker() {
  const [status, setStatus] = useState<"idle" | "ok" | "feil">("idle");
  const [melding, setMelding] = useState("");

  const opprett = async () => {
    setStatus("idle");
    setMelding("Oppretter...");

    try {
      const res = await fetch("/api/opprettBruker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "ole@frilansportalen.com",
          password: "@Bente01",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ FEILDATA FRA BACKEND:", data);
        setStatus("feil");
        setMelding(`❌ ${data.error || "Ukjent feil"}`);
        return;
      }

      setStatus("ok");
      setMelding("✅ Bruker opprettet! Du kan nå logge inn.");
    } catch (err: any) {
      console.error("⚠️ Fetch-feil:", err);
      setStatus("feil");
      setMelding("❌ Fetch failed – kunne ikke kontakte backend");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-portalGul flex flex-col justify-center items-center px-4 text-center">
        <div className="bg-white p-6 rounded-xl shadow max-w-sm w-full space-y-4">
          <h1 className="text-xl font-bold">Opprett Adminbruker</h1>
          <p className="text-sm text-gray-600">
            Trykk for å opprette <strong>ole@frilansportalen.com</strong> med passord <strong>@Bente01</strong>
          </p>
          <button
            onClick={opprett}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
          >
            Opprett bruker
          </button>
          {melding && (
            <p className={status === "feil" ? "text-red-600" : "text-green-600 text-sm"}>{melding}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

import { useState } from "react";

export default function useAiAssist() {
  const [laster, setLaster] = useState(false);
  const [svar, setSvar] = useState("");
  const [feil, setFeil] = useState("");

  const getSvar = async (prompt: string, kontekst = "Du hjelper brukere på Frilansportalen.") => {
    setLaster(true);
    setSvar("");
    setFeil("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, kontekst }),
      });

      const data = await res.json();
      if (data?.forslag) setSvar(data.forslag);
      else setFeil("Ingen svar fra AI.");
    } catch (e) {
      setFeil("Teknisk feil under henting av AI-svar.");
    }

    setLaster(false);
  };

  return { getSvar, svar, laster, feil };
}

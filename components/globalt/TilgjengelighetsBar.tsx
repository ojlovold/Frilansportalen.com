import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";
import useAutoOpplesing from "../../hooks/useAutoOpplesing";

// Utvider Window-typen med lesTekst
declare global {
  interface Window {
    lesTekst: (tekst: string) => void;
  }
}

export default function TilgjengelighetsBar() {
  const user = useUser();
  const [språk, setSpråk] = useState("nb");
  const [lytter, setLytter] = useState(false);
  const [opplesing, setOpplesing] = useState(false);

  useAutoOpplesing();

  useEffect(() => {
    const hent = async () => {
      const brukerId = user && "id" in user ? (user.id as string) : null;
      if (!brukerId) return;

      const { data } = await supabase
        .from("brukerprofiler")
        .select("sprak, opplesing_aktivert")
        .eq("id", brukerId)
        .single();

      if (data?.sprak) setSpråk(data.sprak);
      if (data?.opplesing_aktivert) setOpplesing(true);
    };

    hent();
  }, [user]);

  useEffect(() => {
    const brukerId = user && "id" in user ? (user.id as string) : null;
    if (!brukerId) return;

    supabase
      .from("brukerprofiler")
      .update({ sprak: språk, opplesing_aktivert: opplesing })
      .eq("id", brukerId);

    window.lesTekst = (tekst: string) => {
      if (!opplesing || !tekst) return;
      const u = new SpeechSynthesisUtterance(tekst);
      u.lang = språk === "nb" ? "no-NO" : "en-US";
      window.speechSynthesis.speak(u);
    };
  }, [språk, opplesing, user]);

  const startVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = språk === "nb" ? "no-NO" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setLytter(true);
    recognition.onend = () => setLytter(false);
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      alert(`Talegjenkjenning: ${result}`);
    };
    recognition.start();
  };

  const handleSpeak = () => {
    const sel = window.getSelection()?.toString();
    if (sel) {
      const utter = new SpeechSynthesisUtterance(sel);
      utter.lang = språk === "nb" ? "no-NO" : "en-US";
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="fixed top-2 right-2 bg-white shadow p-2 rounded flex gap-2 items-center z-50 text-sm">
      <select
        value={språk}
        onChange={(e) => setSpråk(e.target.value)}
        className="border rounded p-1"
      >
        <option value="nb">Norsk</option>
        <option value="en">English</option>
      </select>

      <button onClick={startVoiceInput} className="bg-yellow-300 px-2 py-1 rounded">
        Tale → Tekst
      </button>

      <button onClick={handleSpeak} className="bg-yellow-100 px-2 py-1 rounded">
        Les markert
      </button>

      <label className="flex items-center gap-1 text-xs">
        <input
          type="checkbox"
          checked={opplesing}
          onChange={() => setOpplesing(!opplesing)}
        />
        Les menyer og tekst
      </label>
    </div>
  );
}

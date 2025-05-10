import { useEffect, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AccessibilityPanel({
  tekst,
  onDiktert,
}: {
  tekst: string;
  onDiktert?: (verdi: string) => void;
}) {
  const [språk, setSpråk] = useState("no-NO");
  const [stemmer, setStemmer] = useState<SpeechSynthesisVoice[]>([]);
  const [lytter, setLytter] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const oppdater = () => setStemmer(window.speechSynthesis.getVoices());
    oppdater();
    window.speechSynthesis.onvoiceschanged = oppdater;
  }, []);

  const lesOpp = () => {
    const uttale = new SpeechSynthesisUtterance(tekst);
    uttale.lang = språk;
    const valgt = stemmer.find((s) => s.lang === språk);
    if (valgt) uttale.voice = valgt;
    speechSynthesis.speak(uttale);
  };

  const startDiktering = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Talegjenkjenning støttes ikke i nettleseren.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = språk;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      const inn = e.results[0][0].transcript;
      if (onDiktert) onDiktert(inn);
      setLytter(false);
    };

    recognition.onerror = () => {
      alert("Feil under talegjenkjenning.");
      setLytter(false);
    };

    recognition.onend = () => setLytter(false);
    setLytter(true);
    recognition.start();
  };

  return (
    <div className="border border-black bg-gray-50 rounded p-4 text-sm space-y-2 max-w-xl">
      <div>
        <label className="block text-xs font-semibold mb-1">Språk:</label>
        <select
          value={språk}
          onChange={(e) => setSpråk(e.target.value)}
          className="border p-1 rounded w-full"
        >
          <option value="no-NO">Norsk</option>
          <option value="en-US">Engelsk (US)</option>
          <option value="en-GB">Engelsk (UK)</option>
          <option value="sv-SE">Svensk</option>
          <option value="da-DK">Dansk</option>
          <option value="de-DE">Tysk</option>
          <option value="fr-FR">Fransk</option>
        </select>
      </div>

      <div className="flex gap-4 mt-2">
        <button
          onClick={lesOpp}
          className="bg-black text-white px-4 py-1 rounded text-xs hover:bg-gray-800"
        >
          Les opp
        </button>
        <button
          onClick={startDiktering}
          disabled={lytter}
          className="bg-gray-700 text-white px-4 py-1 rounded text-xs hover:bg-gray-900"
        >
          {lytter ? "Lytter..." : "Start diktering"}
        </button>
      </div>
    </div>
  );
}

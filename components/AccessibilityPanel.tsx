// components/AccessibilityPanel.tsx

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccessibilityPanel() {
  const [leser, setLeser] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [kontrast, setKontrast] = useState(false);

  const lesOpp = () => {
    const synth = window.speechSynthesis;
    const tekst = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(tekst);
    synth.cancel();
    synth.speak(utterance);
    setLeser(true);
  };

  const stoppLesing = () => {
    window.speechSynthesis.cancel();
    setLeser(false);
  };

  const toggleZoom = () => {
    document.documentElement.style.fontSize = zoom ? "100%" : "125%";
    setZoom(!zoom);
  };

  const toggleKontrast = () => {
    document.body.classList.toggle("kontrastmodus");
    setKontrast(!kontrast);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-yellow-200 shadow-lg rounded-xl p-4 text-sm max-w-xs border border-yellow-300">
      <h2 className="font-bold mb-2 text-yellow-100">Tilgjengelighet</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/reset-passord" className="text-yellow-400 underline">
            Glemt passord?
          </Link>
        </li>
        <li>
          {leser ? (
            <button onClick={stoppLesing} className="underline text-yellow-300">
              Stopp opplesning
            </button>
          ) : (
            <button onClick={lesOpp} className="underline text-yellow-300">
              Les opp siden
            </button>
          )}
        </li>
        <li>
          <button onClick={toggleZoom} className="underline text-yellow-300">
            {zoom ? "Normal tekststørrelse" : "Større tekst"}
          </button>
        </li>
        <li>
          <button onClick={toggleKontrast} className="underline text-yellow-300">
            {kontrast ? "Standard kontrast" : "Høy kontrast"}
          </button>
        </li>
        <li>
          <a
            href="https://meet.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-yellow-300"
          >
            Trenger hjelp i møte
          </a>
        </li>
      </ul>
    </div>
  );
}

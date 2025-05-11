import { useState } from "react";

export default function TilgjengelighetsBar() {
  const [språk, setSpråk] = useState("nb");
  const [lytter, setLytter] = useState(false);

  const handleSpeak = () => {
    const sel = window.getSelection()?.toString();
    if (sel) {
      const utterance = new SpeechSynthesisUtterance(sel);
      utterance.lang = språk === "nb" ? "no-NO" : "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

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

  return (
    <div className="fixed top-2 right-2 bg-white shadow p-2 rounded flex gap-3 items-center z-50 text-sm">
      <select
        value={språk}
        onChange={(e) => setSpråk(e.target.value)}
        className="border rounded p-1"
      >
        <option value="nb">Norsk</option>
        <option value="en">Engelsk</option>
      </select>

      <button onClick={startVoiceInput} className="bg-yellow-300 px-2 py-1 rounded">
        {lytter ? "Lytter..." : "Tale-til-tekst"}
      </button>

      <button onClick={handleSpeak} className="bg-yellow-100 px-2 py-1 rounded">
        Les opp
      </button>
    </div>
  );
}

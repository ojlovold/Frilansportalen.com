import useTilgjengelighetPref from "@/hooks/useTilgjengelighetPref";
import useAutoOpplesing from "@/hooks/useAutoOpplesing";

export default function TilgjengelighetsBar() {
  const { språk, setSpråk, opplesing, setOpplesing } = useTilgjengelighetPref();
  useAutoOpplesing();

  const startVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = språk === "nb" ? "no-NO" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => console.log("Lytter...");
    recognition.onend = () => console.log("Ferdig");
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

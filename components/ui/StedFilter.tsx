import { useEffect, useState } from "react";
import fylkerOgKommuner from "@/data/fylkerOgKommuner.json";

export default function StedFilter({ onChange }: { onChange: (sted: string) => void }) {
  const [valgtFylke, setValgtFylke] = useState("");
  const [valgtKommune, setValgtKommune] = useState("");

  const fylker = Object.keys(fylkerOgKommuner);
  const kommuner = valgtFylke ? (fylkerOgKommuner as any)[valgtFylke] : [];

  useEffect(() => {
    if (valgtKommune) {
      onChange(valgtKommune);
    } else if (valgtFylke) {
      onChange(valgtFylke);
    } else {
      onChange("");
    }
  }, [valgtFylke, valgtKommune]);

  return (
    <div className="flex flex-col gap-2">
      <select
        className="bg-gray-200 border border-black rounded shadow-inner p-2"
        value={valgtFylke}
        onChange={(e) => {
          setValgtFylke(e.target.value);
          setValgtKommune("");
        }}
      >
        <option value="">Velg fylke</option>
        {fylker.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      {kommuner.length > 0 && (
        <select
          className="bg-gray-200 border border-black rounded shadow-inner p-2"
          value={valgtKommune}
          onChange={(e) => setValgtKommune(e.target.value)}
        >
          <option value="">Velg kommune</option>
          {kommuner.map((k: string) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      )}
    </div>
  );
}

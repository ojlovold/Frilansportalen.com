import { useEffect, useState } from "react";

export default function ProsjektVideo({ romId }: { romId: string }) {
  const [vis, setVis] = useState(true);

  const url = `https://meet.jit.si/${romId}`;

  if (!romId) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[320px] h-[240px] bg-white border shadow-lg rounded overflow-hidden">
      <div className="flex justify-between items-center bg-black text-white px-3 py-2">
        <span className="text-sm font-semibold">Prosjektmøte</span>
        <button onClick={() => setVis(!vis)} className="text-xs underline">
          {vis ? "Minimer" : "Gjenåpne"}
        </button>
      </div>

      {vis && (
        <iframe
          src={url}
          allow="camera; microphone; fullscreen; display-capture"
          className="w-full h-[200px] border-0"
        />
      )}
    </div>
  );
}

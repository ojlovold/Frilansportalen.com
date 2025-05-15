import Image from "next/image";
import { useState } from "react";

export default function AnnonseKort({ annonse }: { annonse: any }) {
  const [favoritt, setFavoritt] = useState(false);

  const visBilde = annonse.bilder?.[0] || "/placeholder.jpg";
  const type = annonse.type || "Til salgs";

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{annonse.tittel}</h2>
        <span className="text-sm bg-gray-200 px-2 py-1 rounded">{type}</span>
      </div>
      <p className="text-sm text-gray-700 mb-2">{annonse.beskrivelse}</p>
      <Image
        src={visBilde}
        alt="Annonsebilde"
        width={400}
        height={300}
        className="rounded-md mb-3"
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {annonse.favoritter || 0} favoritter
        </span>
        <button
          onClick={() => setFavoritt(!favoritt)}
          className={`px-3 py-1 rounded text-white ${
            favoritt ? "bg-red-500" : "bg-gray-500"
          }`}
        >
          {favoritt ? "Favoritt" : "Lagre"}
        </button>
      </div>
    </div>
  );
}

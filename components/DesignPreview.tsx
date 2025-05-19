import { useState } from "react";

export default function DesignPreview() {
  const [bakgrunn, setBakgrunn] = useState("bg-portalGul");
  const [tekst, setTekst] = useState("text-black");

  const tilgjengeligeBakgrunner = [
    "bg-portalGul", "bg-yellow-100", "bg-gray-100", "bg-white", "bg-black"
  ];
  const tilgjengeligeTekstfarger = [
    "text-black", "text-white", "text-gray-800", "text-yellow-800"
  ];

  const lagre = async () => {
    const res = await fetch("/api/lagre-design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bakgrunn, tekst }),
    });
    if (res.ok) alert("Design lagret!");
    else alert("Feil ved lagring");
  };

  return (
    <div className={`${bakgrunn} ${tekst} p-6 rounded-2xl shadow`}>
      <h2 className="text-2xl font-bold mb-4">Forhåndsvisning</h2>

      <div className="mb-4">
        <label className="block mb-1">Bakgrunnsfarge:</label>
        <select value={bakgrunn} onChange={(e) => setBakgrunn(e.target.value)} className="p-2 rounded">
          {tilgjengeligeBakgrunner.map((farge) => (
            <option key={farge} value={farge}>{farge}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Tekstfarge:</label>
        <select value={tekst} onChange={(e) => setTekst(e.target.value)} className="p-2 rounded">
          {tilgjengeligeTekstfarger.map((farge) => (
            <option key={farge} value={farge}>{farge}</option>
          ))}
        </select>
      </div>

      <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
        Lagre design
      </button>
    </div>
  );
}

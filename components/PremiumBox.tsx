import Link from "next/link";

export default function PremiumBox() {
  return (
    <div className="bg-yellow-200 border-2 border-black p-4 rounded-xl shadow mb-6">
      <h2 className="text-xl font-bold mb-2">Denne funksjonen krever Premium</h2>
      <p className="mb-3">
        Du trenger Premium-abonnement for å bruke denne funksjonen. Det koster kun 100 kr per år,
        og gir tilgang til AI, PDF-eksport, Altinn, lagring og mer.
      </p>
      <Link
        href="/premium"
        className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Oppgrader til Premium
      </Link>
    </div>
  );
}

export default function PremiumBox() {
  return (
    <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 text-sm px-4 py-4 rounded mb-6">
      <h2 className="text-base font-semibold mb-2">Hva får du med Premium?</h2>
      <ul className="list-disc ml-5 space-y-1">
        <li>AI-hjelp til meldinger, faktura, stillingsannonser og regnskap</li>
        <li>PDF-generering og eksport</li>
        <li>Altinn-innsending og rapport</li>
        <li>Dokumentarkiv og nedlasting</li>
        <li>Kart og geografisk visning</li>
        <li>Filopplasting og dokumentvarsling</li>
      </ul>
      <p className="mt-4 text-xs text-gray-500">
        Premium koster kun 100 kr/år og gir deg tilgang til alle funksjoner.
      </p>
    </div>
  );
}

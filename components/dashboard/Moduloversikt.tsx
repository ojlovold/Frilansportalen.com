import Link from "next/link";

export default function Moduloversikt() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Moduler</h2>

      {/* Øverste rad: 2 store */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModulBoks
          tittel="Prosjekter"
          beskrivelse="Samarbeid med andre i prosjektrom med chat, oppgaver, AI og eksport."
          href="/prosjektoversikt"
        />
        <ModulBoks
          tittel="Stillinger"
          beskrivelse="Finn eller legg ut jobber, søk med AI-generert tekst og følg status."
          href="/stillinger"
        />
      </div>

      {/* Nederste rad: 3 små */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniModul
          tittel="Dugnadsportalen"
          href="/dugnadsportalen"
        />
        <MiniModul
          tittel="Sommerjobb"
          href="/sommerjobb"
        />
        <MiniModul
          tittel="Småjobb"
          href="/smajobb"
        />
      </div>
    </div>
  );
}

function ModulBoks({ tittel, beskrivelse, href }: { tittel: string; beskrivelse: string; href: string }) {
  return (
    <Link href={href} className="block border p-6 rounded shadow bg-white hover:bg-yellow-100 transition">
      <h3 className="text-xl font-semibold mb-2">{tittel}</h3>
      <p className="text-sm text-gray-700">{beskrivelse}</p>
    </Link>
  );
}

function MiniModul({ tittel, href }: { tittel: string; href: string }) {
  return (
    <Link href={href} className="block border p-4 rounded shadow bg-white hover:bg-yellow-50 text-center">
      <p className="font-medium">{tittel}</p>
    </Link>
  );
}

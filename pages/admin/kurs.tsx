// pages/admin/kurs.tsx
import Head from 'next/head';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminKurs() {
  const [kurs, setKurs] = useState({
    tittel: '',
    tilbyder: '',
    kategori: '',
    sted: '',
    tidspunkt: '',
    pris: 0,
    beskrivelse: '',
  });
  const [status, setStatus] = useState<'klar' | 'lagret' | 'feil'>('klar');

  const publiser = async () => {
    const { error } = await supabase.from('kurs').insert([kurs]);
    if (error) setStatus('feil');
    else {
      setKurs({
        tittel: '',
        tilbyder: '',
        kategori: '',
        sted: '',
        tidspunkt: '',
        pris: 0,
        beskrivelse: '',
      });
      setStatus('lagret');
    }
  };

  return (
    <>
      <Head>
        <title>Admin – Kurs | Frilansportalen</title>
        <meta name="description" content="Legg ut nye kurs i portalen" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Opprett kurs</h1>

        <div className="bg-white p-6 rounded-xl shadow max-w-xl">
          {[
            { key: 'tittel', label: 'Tittel' },
            { key: 'tilbyder', label: 'Tilbyder' },
            { key: 'kategori', label: 'Kategori' },
            { key: 'sted', label: 'Sted' },
            { key: 'tidspunkt', label: 'Tidspunkt (f.eks. 10. juni kl 12)' },
            { key: 'pris', label: 'Pris (0 = gratis)', type: 'number' },
          ].map((felt) => (
            <input
              key={felt.key}
              type={felt.type || 'text'}
              placeholder={felt.label}
              value={(kurs as any)[felt.key]}
              onChange={(e) =>
                setKurs({
                  ...kurs,
                  [felt.key]: felt.type === 'number' ? Number(e.target.value) : e.target.value,
                })
              }
              className="w-full p-2 border rounded mb-4"
            />
          ))}

          <textarea
            placeholder="Beskrivelse"
            value={kurs.beskrivelse}
            onChange={(e) => setKurs({ ...kurs, beskrivelse: e.target.value })}
            className="w-full p-2 border rounded mb-4 h-32"
          />

          <button
            onClick={publiser}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Publiser kurs
          </button>

          {status === 'lagret' && <p className="text-green-600 mt-2">Kurs publisert!</p>}
          {status === 'feil' && <p className="text-red-600 mt-2">Noe gikk galt.</p>}
        </div>
      </main>
    </>
  );
}

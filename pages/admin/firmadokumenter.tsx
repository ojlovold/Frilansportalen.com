// pages/admin/firmadokumenter.tsx
import Head from 'next/head';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import TilbakeKnapp from '@/components/TilbakeKnapp';

export default function AdminFirmadok() {
  const [firmaId, setFirmaId] = useState('');
  const [tittel, setTittel] = useState('');
  const [kategori, setKategori] = useState('');
  const [brukere, setBrukere] = useState('');
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState<'klar' | 'lagrer' | 'lagret' | 'feil'>('klar');

  const lastOpp = async () => {
    if (!fil || !firmaId) return setStatus('feil');
    setStatus('lagrer');

    const filnavn = `firmadokumenter/${firmaId}/${Date.now()}-${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from('dokumenter')
      .upload(filnavn, fil, { upsert: true });

    if (uploadError) return setStatus('feil');

    const { data: urlData } = supabase.storage.from('dokumenter').getPublicUrl(filnavn);

    const { error: dbError } = await supabase.from('firmadokumenter').insert([
      {
        firma_id: firmaId,
        tittel,
        kategori,
        fil_url: urlData.publicUrl,
        kun_for: brukere ? brukere.split(',').map((id) => id.trim()) : null,
      },
    ]);

    if (dbError) setStatus('feil');
    else {
      setTittel('');
      setKategori('');
      setFil(null);
      setBrukere('');
      setStatus('lagret');
    }
  };

  return (
    <>
      <Head>
        <title>Admin – Firmabibliotek | Frilansportalen</title>
        <meta name="description" content="Last opp interne firmadokumenter" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-3xl mx-auto">
        <TilbakeKnapp />
        <h1 className="text-3xl font-bold mb-6">Last opp firmadokument</h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <input
            type="text"
            placeholder="Firma-ID (f.eks. orgnr)"
            value={firmaId}
            onChange={(e) => setFirmaId(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <input
            type="text"
            placeholder="Tittel"
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <input
            type="text"
            placeholder="Kategori (f.eks. vaktplan, HMS)"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <input
            type="text"
            placeholder="Kun for bruker-id-er (komma atskilt), tom = alle i firma"
            value={brukere}
            onChange={(e) => setBrukere(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFil(e.target.files?.[0] || null)}
            className="mb-4"
          />

          <button
            onClick={lastOpp}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Last opp
          </button>

          {status === 'lagret' && (
            <p className="text-green-600 mt-2">Dokument lagret og publisert!</p>
          )}
          {status === 'feil' && (
            <p className="text-red-600 mt-2">Noe gikk galt.</p>
          )}
        </div>
      </main>
    </>
  );
}

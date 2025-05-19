// pages/admin/skjemaer.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminWrapper from '@/components/AdminWrapper';

export default function AdminSkjemaer() {
  const [tittel, setTittel] = useState('');
  const [kategori, setKategori] = useState('');
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState<'klar' | 'opplaster' | 'lagret' | 'feil'>('klar');

  const lastOppSkjema = async () => {
    if (!fil || !tittel || !kategori) return setStatus('feil');
    setStatus('opplaster');

    const filnavn = `skjemaer/${Date.now()}-${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from('dokumenter')
      .upload(filnavn, fil, { upsert: true });

    if (uploadError) return setStatus('feil');

    const { data: urlData } = supabase.storage.from('dokumenter').getPublicUrl(filnavn);

    const { error: dbError } = await supabase.from('skjemaer').insert([
      {
        tittel,
        kategori,
        fil_url: urlData.publicUrl,
      },
    ]);

    if (dbError) setStatus('feil');
    else {
      setTittel('');
      setKategori('');
      setFil(null);
      setStatus('lagret');
    }
  };

  return (
    <AdminWrapper title="Skjemabank">
      <div className="bg-white p-6 rounded-xl shadow max-w-xl">
        <input
          type="text"
          placeholder="Tittel på skjema"
          value={tittel}
          onChange={(e) => setTittel(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="text"
          placeholder="Kategori (f.eks. HMS, helse, kontrakt)"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFil(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <button
          onClick={lastOppSkjema}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Last opp
        </button>

        {status === 'lagret' && (
          <p className="text-green-600 mt-2">Skjema lagret og publisert!</p>
        )}
        {status === 'feil' && (
          <p className="text-red-600 mt-2">Noe gikk galt. Sjekk at alle felt er fylt inn.</p>
        )}
      </div>
    </AdminWrapper>
  );
}

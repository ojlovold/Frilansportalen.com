// pages/admin/integrasjoner.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const typer = ['vipps', 'altinn', 'stripe'] as const;
type Integrasjonstype = typeof typer[number];

export default function AdminIntegrasjoner() {
  const [valg, setValg] = useState<Integrasjonstype>('vipps');
  const [data, setData] = useState<any>({});
  const [status, setStatus] = useState<'klar' | 'lagrer' | 'lagret' | 'feil'>('klar');

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from('integrasjoner')
        .select('*')
        .eq('id', valg)
        .maybeSingle();

      setData(data || { id: valg });
    };

    hent();
  }, [valg]);

  const lagre = async () => {
    setStatus('lagrer');
    const { error } = await supabase
      .from('integrasjoner')
      .upsert([{ ...data, id: valg, sist_oppdatert: new Date().toISOString() }]);
    setStatus(error ? 'feil' : 'lagret');
  };

  const endre = (felt: string, verdi: any) => {
    setData((prev: any) => ({ ...prev, [felt]: verdi }));
  };

  return (
    <>
      <Head>
        <title>Integrasjoner | Admin | Frilansportalen</title>
        <meta name="description" content="Konfigurer eksterne tjenester som Altinn, Vipps og Stripe" />
      </Head>
      <main className="min-h-screen bg-portalGul p-8 text-black max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Integrasjoner</h1>

        <div className="flex gap-4 mb-6">
          {typer.map((t) => (
            <button
              key={t}
              onClick={() => setValg(t)}
              className={`px-4 py-2 rounded ${valg === t ? 'bg-black text-white' : 'bg-white border'}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-4 bg-white p-4 rounded shadow">
          <label className="block font-semibold">Aktiv</label>
          <input
            type="checkbox"
            checked={data.aktiv || false}
            onChange={(e) => endre('aktiv', e.target.checked)}
          />

          <label className="block font-semibold">Testmodus</label>
          <input
            type="checkbox"
            checked={data.testmodus || false}
            onChange={(e) => endre('testmodus', e.target.checked)}
          />

          <label className="block">API-nøkkel</label>
          <input
            type="text"
            value={data.api_key || ''}
            onChange={(e) => endre('api_key', e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block">Klient-ID</label>
          <input
            type="text"
            value={data.client_id || ''}
            onChange={(e) => endre('client_id', e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block">Klient-secret</label>
          <input
            type="text"
            value={data.client_secret || ''}
            onChange={(e) => endre('client_secret', e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block">Organisasjonsnummer</label>
          <input
            type="text"
            value={data.orgnr || ''}
            onChange={(e) => endre('orgnr', e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block">Callback URL</label>
          <input
            type="text"
            value={data.callback_url || ''}
            onChange={(e) => endre('callback_url', e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block">Miljø / server</label>
          <input
            type="text"
            value={data.miljo || ''}
            onChange={(e) => endre('miljo', e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block">Sertifikat (Altinn)</label>
          <textarea
            value={data.sertifikat || ''}
            onChange={(e) => endre('sertifikat', e.target.value)}
            className="w-full p-2 border rounded h-32"
          />

          <button
            onClick={lagre}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Lagre integrasjon
          </button>

          {status === 'lagret' && <p className="text-green-600">Lagret!</p>}
          {status === 'feil' && <p className="text-red-600">Feil under lagring</p>}
        </div>
      </main>
    </>
  );
}

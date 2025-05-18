// lib/altinn.ts
import { supabase } from './supabaseClient';

export type AltinnConfig = {
  aktiv: boolean;
  testmodus: boolean;
  api_key: string;
  client_id?: string;
  client_secret?: string;
  orgnr: string;
  sertifikat: string;
  callback_url?: string;
  miljo?: string;
};

export async function hentAltinnConfig(): Promise<AltinnConfig | null> {
  const { data } = await supabase
    .from('integrasjoner')
    .select('*')
    .eq('id', 'altinn')
    .maybeSingle();

  return data || null;
}

// Klar til innsending (pseudo)
export async function sendTilAltinn(tittel: string, pdfBlob: Blob) {
  const config = await hentAltinnConfig();
  if (!config || !config.aktiv) {
    console.warn('Altinn er ikke aktivert');
    return;
  }

  // Forbered innsending (skjelett, må tilpasses Altinn API-oppsett senere)
  const formData = new FormData();
  formData.append('file', pdfBlob, `${tittel}.pdf`);
  formData.append('orgnr', config.orgnr);
  formData.append('miljo', config.miljo || 'test');
  formData.append('api_key', config.api_key);

  const response = await fetch(config.callback_url || 'https://api.altinn.no/test', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.api_key}`,
    },
    body: formData,
  });

  const result = await response.json();
  return result;
}

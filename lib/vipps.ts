import { supabase } from './supabaseClient';

export type VippsConfig = {
  aktiv: boolean;
  testmodus: boolean;
  api_key: string;
  client_id: string;
  client_secret: string;
  callback_url?: string;
  miljo?: string;
  orgnr: string; // ← lagt til her for å unngå typefeil
};

export async function hentVippsConfig(): Promise<VippsConfig | null> {
  const { data } = await supabase
    .from('integrasjoner')
    .select('*')
    .eq('id', 'vipps')
    .maybeSingle();

  return data || null;
}

// Simulert betalingskall til Vipps
export async function opprettVippsBetaling(belop: number, referanse: string) {
  const config = await hentVippsConfig();
  if (!config || !config.aktiv) {
    console.warn('Vipps er ikke aktivert');
    return null;
  }

  const vippsUrl = config.testmodus
    ? 'https://apitest.vipps.no/ecomm/v2/payments'
    : 'https://api.vipps.no/ecomm/v2/payments';

  const response = await fetch(vippsUrl, {
    method: 'POST',
    headers: {
      'client_id': config.client_id,
      'client_secret': config.client_secret,
      'ocp-apim-subscription-key': config.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchantInfo: {
        merchantSerialNumber: config.orgnr,
        callbackPrefix: config.callback_url || '',
        fallBack: 'https://frilansportalen.com/',
      },
      transaction: {
        amount: belop * 100,
        orderId: referanse,
        transactionText: 'Frilansportalen betaling',
      },
    }),
  });

  const data = await response.json();
  return data;
}

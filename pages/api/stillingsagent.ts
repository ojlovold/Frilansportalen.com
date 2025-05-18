// pages/api/stillingsagent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stilling } = req.body;
  if (!stilling) return res.status(400).json({ error: 'Mangler stilling' });

  const { data: overvakinger } = await supabase
    .from('stillingsovervaking')
    .select('*');

  const match = (o: any) =>
    (!o.sted || o.sted === stilling.sted) &&
    (!o.type || o.type === stilling.type) &&
    (!o.bransje || o.bransje === stilling.bransje);

  const treff = (overvakinger || []).filter(match);

  for (const o of treff) {
    await supabase.from('varsler').insert([
      {
        user_id: o.bruker_id,
        message: `Ny stilling matcher din overvåkning: ${stilling.tittel}`,
        type: 'info',
      },
    ]);
  }

  res.status(200).json({ varslet: treff.length });
}

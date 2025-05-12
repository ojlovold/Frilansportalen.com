// pages/api/attestvarsling.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const today = new Date()
  const cutoff = new Date()
  cutoff.setDate(today.getDate() + 30)

  const { data: attester, error } = await supabase
    .from('attester')
    .select('*')
    .eq('varslet', false)

  if (error) return res.status(500).json({ error })

  const varslede = []

  for (const attest of attester || []) {
    const utlop = new Date(attest.utlopsdato)
    if (utlop <= cutoff) {
      // 1. Send varsel
      await supabase.from('varsler').insert([
        {
          user_id: attest.bruker_id,
          message: `Attest "${attest.navn}" utløper ${attest.utlopsdato}`,
          type: 'advarsel',
        },
      ])

      // 2. Marker som varslet
      await supabase
        .from('attester')
        .update({ varslet: true })
        .eq('id', attest.id)

      varslede.push(attest.id)
    }
  }

  res.status(200).json({ varslet: varslede.length })
}

// pages/api/lastnedAlt.ts
import { NextApiRequest, NextApiResponse } from 'next'
import archiver from 'archiver'
import { Readable } from 'stream'
import supabase from '../../lib/supabaseClient'

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.user as string
  if (!userId) return res.status(400).json({ error: 'Mangler bruker-id' })

  // Sett opp zip-stream
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', 'attachment; filename="rapportpakke.zip"')

  const archive = archiver('zip', { zlib: { level: 9 } })
  archive.pipe(res)

  // 1. Fakturaer
  const fakturaRes = await supabase.from('fakturaer').select('*').eq('frilanser_id', userId)
  const fakturaCsv = fakturaRes.data?.map((f) =>
    `${f.opprettet},${f.belop},"${f.beskrivelse}"`
  ).join('\n')
  archive.append('dato,beløp,beskrivelse\n' + fakturaCsv, { name: 'faktura.csv' })

  // 2. Kjørebok
  const kjorebokRes = await supabase.from('kjorebok').select('*').eq('bruker_id', userId)
  const kjorebokCsv = kjorebokRes.data?.map((t) =>
    `${t.dato},${t.kilometer},${t.fra},${t.til}`
  ).join('\n')
  archive.append('dato,km,fra,til\n' + kjorebokCsv, { name: 'kjorebok.csv' })

  // 3. Rapporter fra Storage
  const rapporter = await supabase.storage.from('rapporter').list(userId)
  for (const fil of rapporter.data || []) {
    const { data } = supabase.storage.from('rapporter').getPublicUrl(`${userId}/${fil.name}`)
    if (data?.publicUrl) {
      archive.append(Readable.from(`URL: ${data.publicUrl}`), { name: `rapporter/${fil.name}.txt` })
    }
  }

  // 4. Kvitteringer fra Storage
  const kvitteringer = await supabase.storage.from('kvitteringer').list(userId)
  for (const fil of kvitteringer.data || []) {
    const { data } = supabase.storage.from('kvitteringer').getPublicUrl(`${userId}/${fil.name}`)
    if (data?.publicUrl) {
      archive.append(Readable.from(`URL: ${data.publicUrl}`), { name: `kvitteringer/${fil.name}.txt` })
    }
  }

  // Avslutt zip
  await archive.finalize()
}

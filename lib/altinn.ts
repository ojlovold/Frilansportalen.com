// lib/altinn.ts
import axios from 'axios'

export async function sendToAltinn(data: {
  orgnr: string
  title: string
  fileUrl: string
  userId: string
}) {
  const response = await axios.post('/api/altinn', data)
  return response.data
}

import axios from 'axios'

export async function hentAIForslag(prompt: string) {
  const response = await axios.post('/api/ai', { prompt })
  return response.data.result
}

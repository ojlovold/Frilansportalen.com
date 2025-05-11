// lib/vipps.ts
import axios from 'axios'

export async function createVippsPayment(data: {
  amount: number
  orderId: string
  phoneNumber: string
  userId: string
}) {
  const response = await axios.post('/api/vipps', data)
  return response.data
}

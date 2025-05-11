// lib/utils.ts
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('no-NO')
}

export function formatCurrency(nok: number): string {
  return new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: 'NOK',
  }).format(nok)
}

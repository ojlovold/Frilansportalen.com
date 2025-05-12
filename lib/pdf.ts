// lib/pdf.ts
import jsPDF from 'jspdf'

export async function generateSimplePDF(
  title: string,
  content: string,
  bruker_id: string,
  bruk_logo: boolean
) {
  const doc = new jsPDF()

  if (bruk_logo && bruker_id) {
    const logoUrl = `https://<YOUR_PROJECT>.supabase.co/storage/v1/object/public/profilbilder/${bruker_id}.jpg`
    const imageData = await fetchImageAsBase64(logoUrl)

    if (imageData) {
      doc.addImage(imageData, 'JPEG', 150, 10, 40, 20) // høyre hjørne
    }
  }

  doc.setFontSize(18)
  doc.text(title, 10, 40)
  doc.setFontSize(12)
  doc.text(content, 10, 60)

  return doc.output('blob')
}

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return await convertBlobToBase64(blob)
  } catch {
    return null
  }
}

function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

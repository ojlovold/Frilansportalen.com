// lib/pdf.ts
import jsPDF from 'jspdf'

export function generateSimplePDF(title: string, content: string) {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text(title, 10, 20)
  doc.setFontSize(12)
  doc.text(content, 10, 40)
  return doc.output('blob')
}

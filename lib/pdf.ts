import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDF({
  title,
  content,
  tableData,
  fileName = "dokument.pdf",
}: {
  title: string;
  content?: string;
  tableData?: {
    head: string[];
    body: string[][];
  };
  fileName?: string;
}) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 22);

  if (content) {
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(content, 180);
    doc.text(splitContent, 14, 32);
  }

  if (tableData) {
    autoTable(doc, {
      startY: content ? 50 : 30,
      head: [tableData.head],
      body: tableData.body,
      styles: { fontSize: 10 },
    });
  }

  doc.save(fileName);
}

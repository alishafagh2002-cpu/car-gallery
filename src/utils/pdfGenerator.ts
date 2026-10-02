import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateVehiclePdf(element: HTMLElement, fileName: string): Promise<void> {
  // Use html2canvas with optimal scale and rendering options for Persian typography
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution for crisp print
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#070707',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // A4 dimensions in millimeters
  const pdfWidth = 210;
  const pdfHeight = 297;
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let heightLeft = imgHeight;
  let position = 0;

  // Render first page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pdfHeight;

  // Add additional pages if content spans across multiple A4 pages
  while (heightLeft > 5) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
  }

  // Trigger browser download
  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
}

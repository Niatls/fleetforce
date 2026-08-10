// PDF questionnaire export module using the HTML A4 template (Application_form (4).html)
import { buildApplicationFormHtml } from './exportDocUtils';

// Helper to open filled HTML form in print window (Print / Save as PDF)
export const handleExportPdf = (cand) => {
  if (!cand) return;
  const html = buildApplicationFormHtml(cand);
  const printWin = window.open('', '_blank');
  if (!printWin) {
    alert('Пожалуйста, разрешите всплывающие окна в браузере для печати в PDF.');
    return;
  }
  printWin.document.open();
  printWin.document.write(html);
  printWin.document.close();
  setTimeout(() => {
    try {
      printWin.print();
    } catch (e) {
      console.error(e);
    }
  }, 500);
};

// Generate Blob for PDF export
export const generatePdfBlob = async (cand) => {
  const html = buildApplicationFormHtml(cand);
  return new Blob(['\ufeff' + html], { type: 'text/html;charset=utf-8' });
};

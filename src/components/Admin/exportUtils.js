// Main export orchestrator module re-exporting DOCX, PDF, CSV and ZIP export functions
export { parseCandidateNameParts, buildApplicationFormHtml, generateDocBlob, handleExportDoc, handleExportWordHtml } from './exportDocUtils';
export { generatePdfBlob, handleExportPdf } from './exportPdfUtils';

import JSZip from 'jszip';
import { generateDocBlob } from './exportDocUtils';
import { generatePdfBlob } from './exportPdfUtils';

export const handleExportCSV = (candidates = []) => {
  let csv = 'ID,Full Name,Rank,Status,Email,Phone,Marlins,Ready Date\n';
  candidates.forEach((c) => {
    csv += `"${c.id}","${c.fullName}","${c.appliedRank}","${c.status}","${c.email}","${c.phone}","${c.marlinsScore}","${c.readyDate}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FleetForce_Seafarers_Export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Convert dataUrl to binary for inclusion in ZIP
const dataUrlToUint8Array = (dataUrl) => {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return array;
};

// Download all files: ZIP containing filled HTML A4 questionnaire (.doc) + all attachedFiles
export const handleDownloadAllFiles = async (cand) => {
  if (!cand) return;
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '').trim();
  const folderName = `FleetForce_${cleanName}_${cand.id}`;

  const zip = new JSZip();
  const folder = zip.folder(folderName);

  // 1. Add filled application form (.doc) based on HTML template Application_form (4).html
  const docBlob = await generateDocBlob(cand);
  const docArrayBuffer = await docBlob.arrayBuffer();
  folder.file(`Application_${cleanName}_${cand.id || 'FORM'}.doc`, docArrayBuffer);

  // 2. Add attached files (from base64 dataUrls)
  const files = cand.attachedFiles || [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.dataUrl && file.dataUrl.includes(',')) {
      const uint8 = dataUrlToUint8Array(file.dataUrl);
      folder.file(file.name || `Document_${i + 1}`, uint8);
    }
  }

  // 3. Generate and trigger download
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
};

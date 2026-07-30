// Utility functions for exporting candidate dossiers to CSV, Word (.doc) and ZIP archives
// JSZip and jsPDF are loaded via CDN in index.html and accessed as window globals

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

export const handleExportDoc = (cand) => {
  if (!cand) return;
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '');
  const seaServiceRows = (cand.seaService || []).map(s => `
    <tr>
      <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${s.vesselName || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.vesselType || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.dwtGrt || '-'} / ${s.engineBhp || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.rankHeld || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.manningCompany || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.dateFrom || '-'} — ${s.dateTo || '-'}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Seafarer Application - ${cand.fullName}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #111; margin: 20px; }
        h1 { color: #003366; font-size: 18pt; margin-bottom: 2px; }
        .sub { color: #666; font-size: 10pt; margin-bottom: 20px; }
        h3 { color: #003366; font-size: 13pt; border-bottom: 1px solid #003366; padding-bottom: 4px; margin-top: 18px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10pt; }
        th { background: #f0f4f8; color: #003366; padding: 6px; border: 1px solid #ccc; text-align: left; }
        td { padding: 6px; border: 1px solid #ccc; }
        .info-grid { width: 100%; margin-bottom: 10px; }
        .info-grid td { border: none; padding: 4px 8px; }
      </style>
    </head>
    <body>
      <h1>FLEETFORCE CREWING ALLIANCE</h1>
      <div class="sub">INTERNATIONAL SEAFARER APPLICATION DOSSIER | REF: ${cand.id} | Date: ${new Date().toLocaleDateString()}</div>

      <h3>1. PERSONAL DETAILS / ЛИЧНЫЕ ДАННЫЕ</h3>
      <table class="info-grid">
        <tr><td><strong>Full Name:</strong> ${cand.fullName}</td><td><strong>Date of Birth:</strong> ${cand.dob || '-'}</td></tr>
        <tr><td><strong>Phone:</strong> ${cand.phone || '-'}</td><td><strong>Citizenship:</strong> ${cand.citizenship || '-'}</td></tr>
        <tr><td><strong>Email:</strong> ${cand.email || '-'}</td><td><strong>Passport / Seaman Book:</strong> ${cand.passportNo || 'Included in Attached Docs'}</td></tr>
      </table>

      <h3>2. APPLICATION DETAILS / ДАННЫЕ ВАКАНСИИ И АНГЛИЙСКИЙ</h3>
      <table class="info-grid">
        <tr><td><strong>Applied Rank:</strong> ${cand.appliedRank}</td><td><strong>Min Desired Salary:</strong> $${cand.minSalary || '0'} / month</td></tr>
        <tr><td><strong>Availability Date:</strong> ${cand.readyDate || '-'}</td><td><strong>Marlins Score:</strong> ${cand.marlinsScore || 'N/A'} (${cand.englishLevel || 'Good'})</td></tr>
      </table>

      <h3>3. SEA EXPERIENCE RECORD MATRIX / ОПЫТ РАБОТЫ В МОРЕ</h3>
      <table>
        <thead>
          <tr>
            <th>Vessel Name</th>
            <th>Type</th>
            <th>DWT / Engine</th>
            <th>Rank</th>
            <th>Manning Company</th>
            <th>Period</th>
          </tr>
        </thead>
        <tbody>
          ${seaServiceRows || '<tr><td colspan="6">No sea experience recorded</td></tr>'}
        </tbody>
      </table>

      ${cand.notes ? `<h3>4. RECRUITER & MANAGER NOTES</h3><p style="background:#fffbe6;padding:10px;border:1px solid #ffe58f;">${cand.notes}</p>` : ''}
      <br/><br/>
      <div style="font-size:9pt;color:#888;text-align:center;border-top:1px solid #ccc;padding-top:8px;">
        Document generated automatically by FleetForce Crewing Platform • ISO 9001 & MLC 2006 Certified System
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FleetForce_Application_${cleanName}_${cand.id}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};

// Helper: generate DOC HTML content and return as blob
const generateDocBlob = (cand) => {
  const seaServiceRows = (cand.seaService || []).map(s => `
    <tr>
      <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${s.vesselName || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.vesselType || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.dwtGrt || '-'} / ${s.engineBhp || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.rankHeld || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.manningCompany || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.dateFrom || '-'} — ${s.dateTo || '-'}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Seafarer Application - ${cand.fullName}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #111; margin: 20px; }
        h1 { color: #003366; font-size: 18pt; margin-bottom: 2px; }
        .sub { color: #666; font-size: 10pt; margin-bottom: 20px; }
        h3 { color: #003366; font-size: 13pt; border-bottom: 1px solid #003366; padding-bottom: 4px; margin-top: 18px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10pt; }
        th { background: #f0f4f8; color: #003366; padding: 6px; border: 1px solid #ccc; text-align: left; }
        td { padding: 6px; border: 1px solid #ccc; }
        .info-grid { width: 100%; margin-bottom: 10px; }
        .info-grid td { border: none; padding: 4px 8px; }
      </style>
    </head>
    <body>
      <h1>FLEETFORCE CREWING ALLIANCE</h1>
      <div class="sub">INTERNATIONAL SEAFARER APPLICATION DOSSIER | REF: ${cand.id} | Date: ${new Date().toLocaleDateString()}</div>

      <h3>1. PERSONAL DETAILS / ЛИЧНЫЕ ДАННЫЕ</h3>
      <table class="info-grid">
        <tr><td><strong>Full Name:</strong> ${cand.fullName}</td><td><strong>Date of Birth:</strong> ${cand.dob || '-'}</td></tr>
        <tr><td><strong>Phone:</strong> ${cand.phone || '-'}</td><td><strong>Citizenship:</strong> ${cand.citizenship || '-'}</td></tr>
        <tr><td><strong>Email:</strong> ${cand.email || '-'}</td><td><strong>Passport / Seaman Book:</strong> ${cand.passportNo || 'Included in Attached Docs'}</td></tr>
      </table>

      <h3>2. APPLICATION DETAILS / ДАННЫЕ ВАКАНСИИ И АНГЛИЙСКИЙ</h3>
      <table class="info-grid">
        <tr><td><strong>Applied Rank:</strong> ${cand.appliedRank}</td><td><strong>Min Desired Salary:</strong> $${cand.minSalary || '0'} / month</td></tr>
        <tr><td><strong>Availability Date:</strong> ${cand.readyDate || '-'}</td><td><strong>Marlins Score:</strong> ${cand.marlinsScore || 'N/A'} (${cand.englishLevel || 'Good'})</td></tr>
      </table>

      <h3>3. SEA EXPERIENCE RECORD MATRIX / ОПЫТ РАБОТЫ В МОРЕ</h3>
      <table>
        <thead>
          <tr>
            <th>Vessel Name</th><th>Type</th><th>DWT / Engine</th><th>Rank</th><th>Manning Company</th><th>Period</th>
          </tr>
        </thead>
        <tbody>
          ${seaServiceRows || '<tr><td colspan="6">No sea experience recorded</td></tr>'}
        </tbody>
      </table>

      ${cand.notes ? `<h3>4. RECRUITER & MANAGER NOTES</h3><p style="background:#fffbe6;padding:10px;border:1px solid #ffe58f;">${cand.notes}</p>` : ''}
      <br/><br/>
      <div style="font-size:9pt;color:#888;text-align:center;border-top:1px solid #ccc;padding-top:8px;">
        Document generated automatically by FleetForce Crewing Platform • ISO 9001 & MLC 2006 Certified System
      </div>
    </body>
    </html>
  `;
  return new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
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

// Generate PDF blob from candidate data using jsPDF (accesses window.jspdf)
const generatePdfBlob = (cand) => {
  const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  if (!jsPDFClass) { console.warn('jsPDF not loaded'); return null; }
  const doc = new jsPDFClass({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const colW = pageW - margin * 2;
  let y = 18;

  const addText = (text, x, curY, opts = {}) => {
    doc.text(String(text ?? ''), x, curY, opts);
  };

  const checkPage = (needed = 10) => {
    if (y + needed > 275) {
      doc.addPage();
      y = 18;
    }
  };

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  addText('FLEETFORCE CREWING ALLIANCE', margin, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  addText(`SEAFARER APPLICATION DOSSIER  |  REF: ${cand.id}  |  Date: ${new Date().toLocaleDateString()}`, margin, y);
  y += 5;

  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 7;

  // Section helper (Latin only - Helvetica font does not support Cyrillic)
  const section = (title) => {
    checkPage(12);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 51, 102);
    addText(title, margin, y);
    y += 2;
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 5;
  };

  // Transliterate Cyrillic to Latin so jsPDF renders it correctly
  const tl = (str) => {
    if (!str) return '-';
    const map = {
      '\u0430':'a','\u0431':'b','\u0432':'v','\u0433':'g','\u0434':'d','\u0435':'e','\u0451':'yo','\u0436':'zh',
      '\u0437':'z','\u0438':'i','\u0439':'y','\u043a':'k','\u043b':'l','\u043c':'m','\u043d':'n','\u043e':'o',
      '\u043f':'p','\u0440':'r','\u0441':'s','\u0442':'t','\u0443':'u','\u0444':'f','\u0445':'kh','\u0446':'ts',
      '\u0447':'ch','\u0448':'sh','\u0449':'sch','\u044a':'','\u044b':'y','\u044c':'','\u044d':'e','\u044e':'yu','\u044f':'ya',
      '\u0410':'A','\u0411':'B','\u0412':'V','\u0413':'G','\u0414':'D','\u0415':'E','\u0401':'Yo','\u0416':'Zh',
      '\u0417':'Z','\u0418':'I','\u0419':'Y','\u041a':'K','\u041b':'L','\u041c':'M','\u041d':'N','\u041e':'O',
      '\u041f':'P','\u0420':'R','\u0421':'S','\u0422':'T','\u0423':'U','\u0424':'F','\u0425':'Kh','\u0426':'Ts',
      '\u0427':'Ch','\u0428':'Sh','\u0429':'Sch','\u042a':'','\u042b':'Y','\u042c':'','\u042d':'E','\u042e':'Yu','\u042f':'Ya'
    };
    return String(str).split('').map(c => map[c] !== undefined ? map[c] : c).join('');
  };

  const field = (label, value) => {
    checkPage(7);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    addText(label + ':', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    const safeVal = tl(value);
    const lines = doc.splitTextToSize(safeVal, colW - 55);
    addText(lines, margin + 55, y);
    y += Math.max(6, lines.length * 5);
  };

  // 1. Personal
  section('1. PERSONAL DETAILS');
  field('Full Name', cand.fullName);
  field('Date of Birth', cand.dob);
  field('Phone', cand.phone);
  field('Email', cand.email);
  field('Citizenship', cand.citizenship);
  field('Passport / Seaman Book', cand.passportNo || 'Included in Attached Docs');
  y += 2;

  // 2. Application
  section('2. APPLICATION DETAILS');
  field('Applied Rank', cand.appliedRank);
  field('Availability Date', cand.readyDate);
  field('Min Desired Salary', `$${cand.minSalary || 0} / month`);
  field('Marlins Score', `${cand.marlinsScore || 'N/A'} (${cand.englishLevel || 'Good'})`);
  y += 2;

  // 3. Sea Service
  section('3. SEA EXPERIENCE RECORD MATRIX');
  const seaHeaders = ['Vessel', 'Type', 'DWT/Engine', 'Rank', 'Manning Co.', 'Period'];
  const seaColW = [32, 24, 24, 22, 30, 32];
  const tableX = margin;

  // Table header row
  checkPage(10);
  doc.setFillColor(220, 230, 242);
  doc.rect(tableX, y - 4, colW, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  let hx = tableX + 1;
  seaHeaders.forEach((h, i) => { addText(h, hx, y); hx += seaColW[i]; });
  y += 5;

  const seaService = cand.seaService || [];
  if (seaService.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    addText('No sea experience recorded', margin, y);
    y += 6;
  } else {
    seaService.forEach((s, idx) => {
      checkPage(8);
      if (idx % 2 === 0) {
        doc.setFillColor(245, 247, 250);
        doc.rect(tableX, y - 4, colW, 7, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(8);
      const period = `${s.dateFrom || '-'} - ${s.dateTo || '-'}`;
      const row = [tl(s.vesselName), tl(s.vesselType), `${s.dwtGrt || '-'}/${s.engineBhp || '-'}`, tl(s.rankHeld), tl(s.manningCompany), period];
      let rx = tableX + 1;
      row.forEach((val, i) => { addText(String(val ?? '-').substring(0, 20), rx, y); rx += seaColW[i]; });
      y += 6;
    });
  }
  y += 3;

  // 4. Notes
  if (cand.notes) {
    section('4. RECRUITER & MANAGER NOTES');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const noteLines = doc.splitTextToSize(tl(cand.notes), colW);
    checkPage(noteLines.length * 5 + 4);
    addText(noteLines, margin, y);
    y += noteLines.length * 5 + 4;
  }

  // Footer
  checkPage(10);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'italic');
  doc.line(margin, y, pageW - margin, y);
  y += 5;
  addText('Generated by FleetForce Crewing Platform  |  ISO 9001 & MLC 2006 Certified System', margin, y, { maxWidth: colW });

  return doc.output('arraybuffer');
};

// Download all files: ZIP containing questionnaire (DOC + PDF) + all attachedFiles
export const handleDownloadAllFiles = async (cand) => {
  if (!cand) return;
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '').trim();
  const folderName = `FleetForce_${cleanName}_${cand.id}`;

  // Load ZIP from CDN global (window.JSZip)
  const JSZip = window.JSZip;
  if (!JSZip) { alert('JSZip library not loaded. Check internet connection.'); return; }

  const zip = new JSZip();
  const folder = zip.folder(folderName);

  // 1. Add DOC questionnaire
  const docBlob = generateDocBlob(cand);
  const docArrayBuffer = await docBlob.arrayBuffer();
  folder.file(`Анкета_${cleanName}_${cand.id}.doc`, docArrayBuffer);

  // 2. Add PDF questionnaire
  const pdfArrayBuffer = generatePdfBlob(cand);
  if (pdfArrayBuffer) {
    folder.file(`Анкета_${cleanName}_${cand.id}.pdf`, pdfArrayBuffer);
  }

  // 3. Add attached files (from base64 dataUrls)
  const files = cand.attachedFiles || [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.dataUrl && file.dataUrl.includes(',')) {
      const uint8 = dataUrlToUint8Array(file.dataUrl);
      folder.file(file.name || `Документ_${i + 1}`, uint8);
    }
  }

  // 4. Generate and trigger download
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
};


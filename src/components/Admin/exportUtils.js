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

// Helper: Build comprehensive HTML application form matching Crew_Application_Form.pdf
const buildApplicationFormHtml = (cand) => {
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '');
  const todayStr = new Date().toISOString().split('T')[0];

  const seaServiceRows = (cand.seaService && cand.seaService.length > 0)
    ? cand.seaService.map(s => `
      <tr>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.dateFrom || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.dateTo || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-weight:bold;font-size:8.5pt;">${s.rankHeld || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">$${s.salary || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-weight:bold;font-size:8.5pt;">${s.vesselName || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.shipowner || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.vesselType || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.engineType || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.buildYear || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.dwtGrt || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.engineBhp || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.flag || '-'}</td>
        <td style="padding:4px;border:1px solid #000;font-size:8.5pt;">${s.manningCompany || '-'}</td>
      </tr>
    `).join('')
    : '<tr><td colspan="13" style="padding:8px;text-align:center;border:1px solid #000;">No sea experience recorded</td></tr>';

  const certificatesRows = (cand.certificates && cand.certificates.length > 0)
    ? cand.certificates.map(c => `
      <tr>
        <td style="padding:5px;border:1px solid #000;font-weight:bold;">${c.certName || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${c.certNo || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${c.certIssued || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${c.certValid || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${c.rankCapacity || '-'}</td>
      </tr>
    `).join('')
    : '';

  const recordBooksRows = (cand.recordBooks && cand.recordBooks.length > 0)
    ? cand.recordBooks.map(rb => `
      <tr>
        <td style="padding:5px;border:1px solid #000;font-weight:bold;">${rb.flag || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${rb.number || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${rb.issuedDate || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${rb.validUntil || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${rb.place || '-'}</td>
      </tr>
    `).join('')
    : '<tr><td colspan="5" style="padding:6px;text-align:center;border:1px solid #000;">No foreign record books listed</td></tr>';

  const employersRows = (cand.employers && cand.employers.length > 0)
    ? cand.employers.map(e => `
      <tr>
        <td style="padding:5px;border:1px solid #000;font-weight:bold;">${e.company || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${e.personInCharge || '-'}</td>
        <td style="padding:5px;border:1px solid #000;">${e.contactDetails || '-'}</td>
      </tr>
    `).join('')
    : '<tr><td colspan="3" style="padding:6px;text-align:center;border:1px solid #000;">No previous employer contacts listed</td></tr>';

  return `
    <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>APPLICATION FORM - ${cand.fullName}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 9.5pt; color: #000; margin: 15px; }
        .header-title { text-align: center; font-size: 16pt; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; }
        .meta-line { font-size: 8pt; color: #555; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        th, td { border: 1px solid #000; padding: 4px 6px; font-size: 9pt; }
        .sec-hdr { background: #b6d7a8; font-weight: bold; text-align: center; font-size: 10pt; text-transform: uppercase; padding: 6px; }
        .tbl-hdr { background: #d9ead3; font-weight: bold; font-size: 8.5pt; text-align: left; }
        .lbl { background: #eef7ea; font-weight: bold; width: 22%; }
        .val { width: 28%; }
      </style>
    </head>
    <body>
      <div class="header-title">APPLICATION FORM</div>
      <div class="meta-line">FLEETFORCE CREWING ALLIANCE | REF: ${cand.id || 'N/A'} | Date: ${todayStr}</div>

      <!-- 1. GENERAL INFORMATION -->
      <table>
        <tr>
          <td class="lbl">Positions applied for:</td>
          <td class="val"><strong>${cand.appliedRank || '-'}</strong></td>
          <td class="lbl">Date of readiness:</td>
          <td class="val">${cand.readyDate || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">Surname:</td>
          <td class="val">${cand.surname || cand.fullName?.split(' ')[0] || '-'}</td>
          <td class="lbl">Name:</td>
          <td class="val">${cand.name || cand.fullName?.split(' ').slice(1).join(' ') || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">Father’s name:</td>
          <td class="val">${cand.fatherName || '-'}</td>
          <td class="lbl">Mother’s name:</td>
          <td class="val">${cand.motherName || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">Date of birth:</td>
          <td class="val">${cand.dob || '-'}</td>
          <td class="lbl">Nationality:</td>
          <td class="val">${cand.nationality || cand.citizenship || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">Place of birth (City, Country):</td>
          <td class="val">${cand.placeOfBirth || '-'}</td>
          <td class="lbl">Marital status:</td>
          <td class="val">${cand.maritalStatus || 'Single'} (Children &lt;18: ${cand.childrenUnder18 || '0'})</td>
        </tr>
        <tr>
          <td class="lbl">Home Address:</td>
          <td colspan="3">${cand.address || cand.homeAddress || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">Home Zip:</td>
          <td class="val">${cand.homeZip || '-'}</td>
          <td class="lbl">Contact Phone:</td>
          <td class="val">${cand.phone || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">E-mail:</td>
          <td class="val">${cand.email || '-'}</td>
          <td class="lbl">Skype/Telegram:</td>
          <td class="val">${cand.skypeTelegram || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">Next of kin:</td>
          <td class="val">${cand.kinName || '-'} (${cand.kinRelation || '-'})</td>
          <td class="lbl">Next of kin phone:</td>
          <td class="val">${cand.kinPhone || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">Physical Details:</td>
          <td colspan="3">Height: ${cand.height || '-'} cm | Weight: ${cand.weight || '-'} kg | Overall: ${cand.overallSize || '-'} EUR | Shoes: ${cand.shoeSize || '-'} EUR | Eyes: ${cand.eyesColour || '-'} | Hair: ${cand.hairColour || '-'}</td>
        </tr>
      </table>

      <!-- 2. MARINE EDUCATION -->
      <table>
        <tr class="sec-hdr"><td colspan="3">Marine Education</td></tr>
        <tr class="tbl-hdr">
          <th style="width:60%;">Name of maritime college or academy</th>
          <th style="width:20%;">From</th>
          <th style="width:20%;">Till</th>
        </tr>
        <tr>
          <td>${cand.collegeName || '-'}</td>
          <td>${cand.collegeFrom || '-'}</td>
          <td>${cand.collegeTill || '-'}</td>
        </tr>
      </table>

      <!-- 3. PASSPORTS AND CERTIFICATES -->
      <table>
        <tr class="sec-hdr"><td colspan="5">PASSPORTS and CERTIFICATES</td></tr>
        <tr class="tbl-hdr">
          <th>DOCUMENT</th>
          <th>NUMBER</th>
          <th>ISSUED DATE</th>
          <th>VALID UNTIL</th>
          <th>PLACE</th>
        </tr>
        <tr>
          <td><strong>TRAVEL PASSPORT:</strong></td>
          <td>${cand.passportNo || '-'}</td>
          <td>${cand.passportIssued || '-'}</td>
          <td>${cand.passportExpiry || '-'}</td>
          <td>${cand.passportPlace || '-'}</td>
        </tr>
        <tr>
          <td><strong>SEAMAN'S BOOK (SID):</strong></td>
          <td>${cand.seamanBookNo || '-'}</td>
          <td>${cand.seamanBookIssued || '-'}</td>
          <td>${cand.seamanBookExpiry || '-'}</td>
          <td>${cand.seamanBookPlace || '-'}</td>
        </tr>
        ${certificatesRows}
      </table>

      <!-- 4. FOREIGN SEAMAN'S RECORD BOOKS -->
      <table>
        <tr class="sec-hdr"><td colspan="5">FOREIGN SEAMAN’S ID / RECORD BOOKS</td></tr>
        <tr class="tbl-hdr">
          <th>FLAG</th>
          <th>NUMBER</th>
          <th>ISSUED DATE</th>
          <th>VALID UNTIL</th>
          <th>PLACE</th>
        </tr>
        ${recordBooksRows}
      </table>

      <!-- 5. PREVIOUS SEA SERVICE -->
      <table>
        <tr class="sec-hdr"><td colspan="13">PREVIOUS SEA SERVICE</td></tr>
        <tr class="tbl-hdr" style="font-size:7.5pt;">
          <th>FROM</th>
          <th>TO</th>
          <th>POSITION</th>
          <th>SALARY</th>
          <th>VESSEL</th>
          <th>SHIPOWNER</th>
          <th>TYPE</th>
          <th>ENGINE</th>
          <th>BUILD</th>
          <th>DWT</th>
          <th>BHP</th>
          <th>FLAG</th>
          <th>AGENT</th>
        </tr>
        ${seaServiceRows}
      </table>

      <!-- 6. BRIEF INFORMATION ABOUT PREVIOUS EMPLOYERS -->
      <table>
        <tr class="sec-hdr"><td colspan="3">BRIEF INFORMATION ABOUT PREVIOUS EMPLOYERS</td></tr>
        <tr class="tbl-hdr">
          <th style="width:35%;">COMPANY</th>
          <th style="width:30%;">PERSON IN CHARGE</th>
          <th style="width:35%;">CONTACT DETAILS (Phone Number, e-mail)</th>
        </tr>
        ${employersRows}
      </table>

      <!-- 7. DECLARATION & SIGNATURE -->
      <div style="margin-top:15px; font-size:8.5pt; border:1px solid #000; padding:10px;">
        <p style="margin:0 0 10px 0; line-height:1.4;">
          I hereby confirm that above information is true and correct to the best of my knowledge. I understand that this information will be held in the computer database due to my real or possible employment. Signing it, I willfully give my permission to collect and process my personal information and to use it in all and legal way. I give my permission for my personal information to be provided to the possible employers and any other persons, if such need arises for my employment. Besides, I permit the Company employees to request personal information (data) about me from my former employers.
        </p>
        <table style="width:100%; border:none; margin-top:15px;">
          <tr>
            <td style="border:none; width:50%;"><strong>Date:</strong> ________________________</td>
            <td style="border:none; width:50%; text-align:right;"><strong>Signature:</strong> ________________________</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
};

export const handleExportDoc = (cand) => {
  if (!cand) return;
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '');
  const htmlContent = buildApplicationFormHtml(cand);
  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FleetForce_Application_${cleanName}_${cand.id || 'FORM'}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};

// Helper: generate DOC HTML content and return as blob
const generateDocBlob = (cand) => {
  const htmlContent = buildApplicationFormHtml(cand);
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

// Cache for loaded cyrillic font base64 data
let _cyrillicFontCache = null;

// Load PT Serif (Times New Roman-style, full Cyrillic support) and register in jsPDF
const loadCyrillicFont = async (doc) => {
  try {
    if (!_cyrillicFontCache) {
      const TTF_DIRECT = 'https://fonts.gstatic.com/s/ptserif/v18/EJRQQgYoZZY2vCFuvAFWzr-_dSb_.woff2';
      const resp = await fetch(TTF_DIRECT);
      if (!resp.ok) throw new Error('Font fetch failed: ' + resp.status);
      const buf = await resp.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      _cyrillicFontCache = btoa(binary);
    }
    doc.addFileToVFS('PTSerif-Regular.woff2', _cyrillicFontCache);
    doc.addFont('PTSerif-Regular.woff2', 'PTSerif', 'normal');
    doc.addFileToVFS('PTSerif-Bold.woff2', _cyrillicFontCache);
    doc.addFont('PTSerif-Bold.woff2', 'PTSerif', 'bold');
    return true;
  } catch (e) {
    console.warn('Could not load PT Serif font, falling back to helvetica:', e);
    return false;
  }
};

// Generate PDF blob from candidate data using jsPDF (accesses window.jspdf)
const generatePdfBlob = async (cand) => {
  const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  if (!jsPDFClass) { console.warn('jsPDF not loaded'); return null; }
  const doc = new jsPDFClass({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 10;
  const colW = pageW - margin * 2;
  let y = 12;

  const cyrillicLoaded = await loadCyrillicFont(doc);
  const mainFont = cyrillicLoaded ? 'PTSerif' : 'helvetica';
  const todayStr = new Date().toISOString().split('T')[0];

  const checkPage = (needed = 10) => {
    if (y + needed > 280) {
      doc.addPage();
      y = 12;
    }
  };

  // Cell rendering helper matching Crew_Application_Form.pdf bordered grid
  const cell = (x, curY, w, h, text, isHeader = false, isLabel = false, align = 'left') => {
    doc.setLineWidth(0.2);
    doc.setDrawColor(0, 0, 0); // Black borders
    if (isHeader) {
      doc.setFillColor(182, 215, 168); // #b6d7a8 green
      doc.rect(x, curY, w, h, 'FD');
      doc.setFont(mainFont, 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
    } else if (isLabel) {
      doc.setFillColor(238, 247, 234); // #eef7ea light green label
      doc.rect(x, curY, w, h, 'FD');
      doc.setFont(mainFont, 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 0);
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(x, curY, w, h, 'FD');
      doc.setFont(mainFont, 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 0);
    }
    const txt = String(text ?? '-');
    const txtX = align === 'center' ? x + w / 2 : x + 1.5;
    doc.text(txt, txtX, curY + h / 2 + 1, { align, maxWidth: w - 2 });
  };

  // Header Title
  doc.setFontSize(16);
  doc.setFont(mainFont, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('APPLICATION FORM', pageW / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(8);
  doc.setFont(mainFont, 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Date: ${todayStr} | Prepared by: Quality Manager. Approved by: Crewing Director. REF: ${cand.id || 'N/A'}`, pageW / 2, y, { align: 'center' });
  y += 4;

  doc.setLineWidth(0.4);
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, y, pageW - margin, y);
  y += 4;

  // 1. GENERAL INFORMATION GRID
  const gRows = [
    [
      { lbl: 'Positions applied for:', val: cand.appliedRank, w1: 38, w2: 55 },
      { lbl: 'Date of readiness:', val: cand.readyDate, w1: 38, w2: 55 }
    ],
    [
      { lbl: 'Surname:', val: cand.surname || cand.fullName?.split(' ')[0], w1: 38, w2: 55 },
      { lbl: 'Name:', val: cand.name || cand.fullName?.split(' ').slice(1).join(' '), w1: 38, w2: 55 }
    ],
    [
      { lbl: 'Father’s name:', val: cand.fatherName, w1: 38, w2: 55 },
      { lbl: 'Mother’s name:', val: cand.motherName, w1: 38, w2: 55 }
    ],
    [
      { lbl: 'Date of birth:', val: cand.dob, w1: 38, w2: 55 },
      { lbl: 'Nationality:', val: cand.nationality || cand.citizenship, w1: 38, w2: 55 }
    ],
    [
      { lbl: 'Place of birth:', val: cand.placeOfBirth, w1: 38, w2: 55 },
      { lbl: 'Marital status:', val: `${cand.maritalStatus || 'Single'} (${cand.childrenUnder18 || '0'} children)`, w1: 38, w2: 55 }
    ],
    [
      { lbl: 'Home Address:', val: cand.address || cand.homeAddress, w1: 38, w2: 148 }
    ],
    [
      { lbl: 'Home Zip:', val: cand.homeZip, w1: 38, w2: 55 },
      { lbl: 'Contact Phone:', val: cand.phone, w1: 38, w2: 55 }
    ],
    [
      { lbl: 'E-mail:', val: cand.email, w1: 38, w2: 55 },
      { lbl: 'Skype/Telegram:', val: cand.skypeTelegram, w1: 38, w2: 55 }
    ],
    [
      { lbl: 'Next of kin:', val: `${cand.kinName || '-'} (${cand.kinRelation || '-'})`, w1: 38, w2: 55 },
      { lbl: 'Next of kin phone:', val: cand.kinPhone, w1: 38, w2: 55 }
    ],
    [
      { lbl: 'Physical Details:', val: `Height: ${cand.height || '-'} cm, Weight: ${cand.weight || '-'} kg, Overall: ${cand.overallSize || '-'}, Shoes: ${cand.shoeSize || '-'}, Eyes: ${cand.eyesColour || '-'}, Hair: ${cand.hairColour || '-'}`, w1: 38, w2: 148 }
    ]
  ];

  gRows.forEach(row => {
    checkPage(6);
    let curX = margin;
    row.forEach(item => {
      cell(curX, y, item.w1, 5.5, item.lbl, false, true);
      curX += item.w1;
      cell(curX, y, item.w2, 5.5, item.val, false, false);
      curX += item.w2;
    });
    y += 5.5;
  });
  y += 3;

  // 2. MARINE EDUCATION
  checkPage(16);
  cell(margin, y, colW, 6, 'Marine Education', true, false, 'center');
  y += 6;
  cell(margin, y, 110, 5.5, 'Name of maritime college or academy', false, true);
  cell(margin + 110, y, 38, 5.5, 'From', false, true);
  cell(margin + 148, y, 38, 5.5, 'Till', false, true);
  y += 5.5;
  cell(margin, y, 110, 5.5, cand.collegeName || '-');
  cell(margin + 110, y, 38, 5.5, cand.collegeFrom || '-');
  cell(margin + 148, y, 38, 5.5, cand.collegeTill || '-');
  y += 8.5;

  // 3. PASSPORTS AND CERTIFICATES
  checkPage(24);
  cell(margin, y, colW, 6, 'PASSPORTS and CERTIFICATES', true, false, 'center');
  y += 6;
  cell(margin, y, 56, 5.5, 'DOCUMENT', false, true);
  cell(margin + 56, y, 35, 5.5, 'NUMBER', false, true);
  cell(margin + 91, y, 30, 5.5, 'ISSUED DATE', false, true);
  cell(margin + 121, y, 30, 5.5, 'VALID UNTIL', false, true);
  cell(margin + 151, y, 35, 5.5, 'PLACE', false, true);
  y += 5.5;

  cell(margin, y, 56, 5.5, 'TRAVEL PASSPORT:', false, true);
  cell(margin + 56, y, 35, 5.5, cand.passportNo);
  cell(margin + 91, y, 30, 5.5, cand.passportIssued);
  cell(margin + 121, y, 30, 5.5, cand.passportExpiry);
  cell(margin + 151, y, 35, 5.5, cand.passportPlace);
  y += 5.5;

  cell(margin, y, 56, 5.5, "SEAMAN'S BOOK (SID):", false, true);
  cell(margin + 56, y, 35, 5.5, cand.seamanBookNo);
  cell(margin + 91, y, 30, 5.5, cand.seamanBookIssued);
  cell(margin + 121, y, 30, 5.5, cand.seamanBookExpiry);
  cell(margin + 151, y, 35, 5.5, cand.seamanBookPlace);
  y += 5.5;

  if (cand.certificates && cand.certificates.length > 0) {
    cand.certificates.forEach(c => {
      checkPage(6);
      cell(margin, y, 56, 5.5, c.certName || 'Certificate', false, true);
      cell(margin + 56, y, 35, 5.5, c.certNo);
      cell(margin + 91, y, 30, 5.5, c.certIssued);
      cell(margin + 121, y, 30, 5.5, c.certValid);
      cell(margin + 151, y, 35, 5.5, c.rankCapacity);
      y += 5.5;
    });
  }
  y += 3;

  // 4. FOREIGN SEAMAN'S ID / RECORD BOOKS
  checkPage(16);
  cell(margin, y, colW, 6, 'FOREIGN SEAMAN’S ID / RECORD BOOKS', true, false, 'center');
  y += 6;
  cell(margin, y, 40, 5.5, 'FLAG', false, true);
  cell(margin + 40, y, 40, 5.5, 'NUMBER', false, true);
  cell(margin + 80, y, 35, 5.5, 'ISSUED DATE', false, true);
  cell(margin + 115, y, 35, 5.5, 'VALID UNTIL', false, true);
  cell(margin + 150, y, 36, 5.5, 'PLACE', false, true);
  y += 5.5;

  if (cand.recordBooks && cand.recordBooks.length > 0) {
    cand.recordBooks.forEach(rb => {
      checkPage(6);
      cell(margin, y, 40, 5.5, rb.flag);
      cell(margin + 40, y, 40, 5.5, rb.number);
      cell(margin + 80, y, 35, 5.5, rb.issuedDate);
      cell(margin + 115, y, 35, 5.5, rb.validUntil);
      cell(margin + 150, y, 36, 5.5, rb.place);
      y += 5.5;
    });
  } else {
    cell(margin, y, colW, 5.5, 'No foreign record books listed', false, false, 'center');
    y += 5.5;
  }
  y += 3;

  // 5. PREVIOUS SEA SERVICE
  checkPage(16);
  cell(margin, y, colW, 6, 'PREVIOUS SEA SERVICE', true, false, 'center');
  y += 6;

  const sCols = [
    { name: 'FROM', w: 16 }, { name: 'TO', w: 16 }, { name: 'RANK', w: 20 },
    { name: 'SALARY', w: 14 }, { name: 'VESSEL', w: 22 }, { name: 'SHIPOWNER', w: 18 },
    { name: 'TYPE', w: 18 }, { name: 'ENGINE', w: 14 }, { name: 'BUILD', w: 11 },
    { name: 'DWT', w: 11 }, { name: 'BHP', w: 11 }, { name: 'FLAG', w: 15 }
  ];

  let sx = margin;
  sCols.forEach(col => {
    cell(sx, y, col.w, 5.5, col.name, false, true);
    sx += col.w;
  });
  y += 5.5;

  const seaService = cand.seaService || [];
  if (seaService.length === 0) {
    cell(margin, y, colW, 5.5, 'No sea experience recorded', false, false, 'center');
    y += 5.5;
  } else {
    seaService.forEach(s => {
      checkPage(6);
      let rx = margin;
      const rData = [
        s.dateFrom, s.dateTo, s.rankHeld, `$${s.salary || '-'}`,
        s.vesselName, s.shipowner, s.vesselType, s.engineType,
        s.buildYear, s.dwtGrt, s.engineBhp, s.flag
      ];
      rData.forEach((val, idx) => {
        cell(rx, y, sCols[idx].w, 5.5, val);
        rx += sCols[idx].w;
      });
      y += 5.5;
    });
  }
  y += 3;

  // 6. BRIEF INFORMATION ABOUT PREVIOUS EMPLOYERS
  checkPage(16);
  cell(margin, y, colW, 6, 'BRIEF INFORMATION ABOUT PREVIOUS EMPLOYERS', true, false, 'center');
  y += 6;
  cell(margin, y, 65, 5.5, 'COMPANY', false, true);
  cell(margin + 65, y, 56, 5.5, 'PERSON IN CHARGE', false, true);
  cell(margin + 121, y, 65, 5.5, 'CONTACT DETAILS (Phone / E-mail)', false, true);
  y += 5.5;

  if (cand.employers && cand.employers.length > 0) {
    cand.employers.forEach(e => {
      checkPage(6);
      cell(margin, y, 65, 5.5, e.company);
      cell(margin + 65, y, 56, 5.5, e.personInCharge);
      cell(margin + 121, y, 65, 5.5, e.contactDetails);
      y += 5.5;
    });
  } else {
    cell(margin, y, colW, 5.5, 'No previous employer contacts listed', false, false, 'center');
    y += 5.5;
  }
  y += 4;

  // 7. DECLARATION
  checkPage(30);
  doc.setLineWidth(0.2);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, colW, 30);

  doc.setFontSize(7);
  doc.setFont(mainFont, 'normal');
  doc.setTextColor(0, 0, 0);
  const declText = "I hereby confirm that above information is true and correct to the best of my knowledge. I understand that this information will be held in the computer database due to my real or possible employment. Signing it, I willfully give my permission to collect and process my personal information and to use it in all and legal way. I give my permission for my personal information to be provided to the possible employers and any other persons, if such need arises for my employment. Besides, I permit the Company employees to request personal information (data) about me from my former employers.";
  const declLines = doc.splitTextToSize(declText, colW - 4);
  doc.text(declLines, margin + 2, y + 4);

  y += 22;
  doc.setFont(mainFont, 'bold');
  doc.text('Date: ________________________', margin + 4, y);
  doc.text('Signature: ________________________', margin + 110, y);
  y += 12;

  // Footer
  doc.setFontSize(7.5);
  doc.setFont(mainFont, 'normal');
  doc.setTextColor(120, 120, 120);
  doc.line(margin, y, pageW - margin, y);
  y += 4;
  doc.text('Generated by FleetForce Crewing Platform  |  ISO 9001 & MLC 2006 Certified System', pageW / 2, y, { align: 'center' });

  return doc.output('arraybuffer');
};

// Download all files: ZIP containing questionnaire (DOC + PDF) + all attachedFiles
export const handleDownloadAllFiles = async (cand) => {
  if (!cand) return;
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '').trim();
  const folderName = `FleetForce_${cleanName}_${cand.id}`;

  const JSZip = window.JSZip;
  if (!JSZip) { alert('JSZip library not loaded. Check internet connection.'); return; }

  const zip = new JSZip();
  const folder = zip.folder(folderName);

  // 1. Add DOC questionnaire
  const docBlob = generateDocBlob(cand);
  const docArrayBuffer = await docBlob.arrayBuffer();
  folder.file(`Application_${cleanName}_${cand.id || 'FORM'}.doc`, docArrayBuffer);

  // 2. Add PDF questionnaire (async — font loading)
  const pdfArrayBuffer = await generatePdfBlob(cand);
  if (pdfArrayBuffer) {
    folder.file(`Application_${cleanName}_${cand.id || 'FORM'}.pdf`, pdfArrayBuffer);
  }

  // 3. Add attached files (from base64 dataUrls)
  const files = cand.attachedFiles || [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.dataUrl && file.dataUrl.includes(',')) {
      const uint8 = dataUrlToUint8Array(file.dataUrl);
      folder.file(file.name || `Document_${i + 1}`, uint8);
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

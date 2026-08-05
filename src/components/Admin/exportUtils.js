// Utility functions for exporting candidate dossiers to CSV, Word (.doc) and ZIP archives
import { PDFDocument } from 'pdf-lib';

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

// Helper: Build comprehensive HTML application form matching Crew_Application_Form.pdf for Word (.doc)
const buildApplicationFormHtml = (cand) => {
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

export const handleExportDoc = async (cand) => {
  if (!cand) return;
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '');
  const blob = await generateDocBlob(cand);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FleetForce_Application_${cleanName}_${cand.id || 'FORM'}.docx`;
  a.click();
  URL.revokeObjectURL(url);
};

export const handleExportPdf = async (cand) => {
  if (!cand) return;
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '');
  const pdfBytes = await generatePdfBlob(cand);
  if (!pdfBytes) {
    alert('Не удалось сформировать заполненную PDF анкету.');
    return;
  }
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FleetForce_Application_${cleanName}_${cand.id || 'FORM'}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

// Helper: fill exact Application form.docx template file using JSZip
const generateDocBlob = async (cand) => {
  try {
    const resp = await fetch('./Application form.docx');
    if (!resp.ok) throw new Error('Could not fetch template DOCX');
    const templateBytes = await resp.arrayBuffer();

    const JSZip = window.JSZip;
    if (!JSZip) throw new Error('JSZip not loaded');

    const zip = await JSZip.loadAsync(templateBytes);
    let xml = await zip.file('word/document.xml').async('text');

    const fillLabel = (label, val) => {
      if (val === undefined || val === null || val === '') return;
      const escapedVal = String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const idx = xml.indexOf(label);
      if (idx !== -1) {
        const tcEnd = xml.indexOf('</w:tc>', idx);
        if (tcEnd !== -1) {
          const nextTcStart = xml.indexOf('<w:tc', tcEnd);
          const nextTcEnd = xml.indexOf('</w:tc>', nextTcStart);
          if (nextTcStart !== -1 && nextTcEnd !== -1) {
            const innerTc = xml.substring(nextTcStart, nextTcEnd + 7);
            const fontMatch = innerTc.match(/<w:rPr>.*?<\/w:rPr>/s);
            const rPr = fontMatch ? fontMatch[0] : '<w:rPr><w:b/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>';
            const tcPrMatch = innerTc.match(/<w:tcPr>.*?<\/w:tcPr>/s);
            const tcPr = tcPrMatch ? tcPrMatch[0] : '';
            const newValXml = `<w:tc>${tcPr}<w:p><w:r>${rPr}<w:t>${escapedVal}</w:t></w:r></w:p></w:tc>`;
            xml = xml.substring(0, nextTcStart) + newValXml + xml.substring(nextTcEnd + 7);
          }
        }
      }
    };

    const setRowCellValues = (rowXml, cellMap) => {
      const tcRegex = /<w:tc[\s>].*?<\/w:tc>/gs;
      let cells = [];
      let match;
      while ((match = tcRegex.exec(rowXml)) !== null) {
        cells.push({ xml: match[0], index: match.index, length: match[0].length });
      }

      let lastEnd = 0;
      let result = '';

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        result += rowXml.substring(lastEnd, cell.index);
        lastEnd = cell.index + cell.length;

        if (cellMap[i] !== undefined && cellMap[i] !== null && cellMap[i] !== '') {
          const innerTc = cell.xml;
          const tcPrMatch = innerTc.match(/<w:tcPr>.*?<\/w:tcPr>/s);
          const fontMatch = innerTc.match(/<w:rPr>.*?<\/w:rPr>/s);
          const tcPr = tcPrMatch ? tcPrMatch[0] : '';
          const rPr = fontMatch ? fontMatch[0] : '<w:rPr><w:b/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>';
          const escapedVal = String(cellMap[i]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          result += `<w:tc>${tcPr}<w:p><w:r>${rPr}<w:t>${escapedVal}</w:t></w:r></w:p></w:tc>`;
        } else {
          result += cell.xml;
        }
      }
      result += rowXml.substring(lastEnd);
      return result;
    };

    const trRegex = /(<w:tr[\s>].*?<\/w:tr>)/gs;
    let trMatches = [];
    let match;
    while ((match = trRegex.exec(xml)) !== null) {
      trMatches.push({ xml: match[0], index: match.index, text: match[0].replace(/<[^>]+>/g, '') });
    }

    // Row 0: Positions applied for & Date of readiness
    if (trMatches[0]) {
      const updated = setRowCellValues(trMatches[0].xml, { 1: cand.appliedRank, 4: cand.readyDate });
      xml = xml.replace(trMatches[0].xml, updated);
    }

    // Personal Details (Rows 1 to 11 & Education)
    const labelRowMap = [
      { label: 'Surname:', map: { 1: cand.surname || cand.fullName?.split(' ')[0], 3: cand.name || cand.fullName?.split(' ').slice(1).join(' ') } },
      { label: 'Father’s name:', map: { 1: cand.fatherName, 3: cand.motherName } },
      { label: 'Date of birth:', map: { 1: cand.dob, 3: cand.nationality || cand.citizenship } },
      { label: 'Place of birth:', map: { 1: cand.placeOfBirth, 3: cand.maritalStatus } },
      { label: 'N of children under 18:', map: { 1: cand.childrenUnder18 } },
      { label: 'Home Address:', map: { 1: cand.address || cand.homeAddress, 3: cand.phone } },
      { label: 'E-mail:', map: { 1: cand.email, 5: cand.skypeTelegram } },
      { label: 'Next of kin:', map: { 1: cand.kinName || cand.kin?.name, 3: cand.kinRelation || cand.kin?.relation } },
      { label: 'Next of kin’s address:', map: { 1: cand.kinAddress || cand.kin?.address, 5: cand.kinPhone || cand.kin?.phone } },
      { label: 'Height (cm):', map: { 1: cand.height, 3: cand.weight, 5: cand.overallSize, 7: cand.shoeSize } },
      { label: 'Eyes Colour:', map: { 1: cand.eyesColour, 3: cand.hairColour } },
      { label: 'Name of maritime college or academy', map: { 1: cand.collegeName, 3: cand.collegeFrom } },
      { label: 'Department', map: { 3: cand.collegeTill } }
    ];

    labelRowMap.forEach(lr => {
      trMatches.forEach(tr => {
        if (tr.text.includes(lr.label)) {
          const updated = setRowCellValues(tr.xml, lr.map);
          xml = xml.replace(tr.xml, updated);
        }
      });
    });

    // Populate Passports table rows
    trMatches.forEach((tr) => {
      if (tr.text.includes('TRAVEL PASSPORT:')) {
        const updated = setRowCellValues(tr.xml, { 1: cand.passportNo || cand.passport?.no, 2: cand.passportIssued || cand.passport?.issued, 3: cand.passportExpiry || cand.passport?.expiry, 4: cand.passportPlace || cand.passport?.place });
        xml = xml.replace(tr.xml, updated);
      } else if (tr.text.includes('SEAMAN’S BOOK:')) {
        const updated = setRowCellValues(tr.xml, { 1: cand.seamanBookNo || cand.seamanBook?.no, 2: cand.seamanBookIssued || cand.seamanBook?.issued, 3: cand.seamanBookExpiry || cand.seamanBook?.expiry, 4: cand.seamanBookPlace || cand.seamanBook?.place });
        xml = xml.replace(tr.xml, updated);
      }
    });

    // Populate Certificate of Competency CoC #1
    trMatches.forEach((tr, idx) => {
      if (tr.text.includes('CERTIFICATE OF COMPETENCY # 1') && trMatches[idx + 2]) {
        const coc1 = (cand.certificates && cand.certificates[0]) || {};
        const updated = setRowCellValues(trMatches[idx + 2].xml, { 0: coc1.certName || coc1.certNo, 1: coc1.certNo, 2: coc1.certIssued, 3: coc1.certValid, 4: coc1.rankCapacity });
        xml = xml.replace(trMatches[idx + 2].xml, updated);
      }
    });

    // Populate Sea Service table rows
    let seaHeaderIdx = trMatches.findIndex(tr => tr.text.includes('PREVIOUS SEA SERVICE'));
    if (seaHeaderIdx !== -1 && cand.seaService && cand.seaService.length > 0) {
      cand.seaService.forEach((s, sIdx) => {
        const targetTr = trMatches[seaHeaderIdx + 2 + sIdx];
        if (targetTr) {
          const updated = setRowCellValues(targetTr.xml, {
            0: s.dateFrom, 1: s.dateTo, 2: s.rankHeld, 3: s.salary,
            4: s.vesselName, 5: s.shipowner, 6: s.vesselType, 7: s.engineType,
            8: s.buildYear, 9: s.dwtGrt, 10: s.engineBhp, 11: s.flag, 12: s.manningCompany
          });
          xml = xml.replace(targetTr.xml, updated);
        }
      });
    }

    // Populate Employers table rows
    let empHeaderIdx = trMatches.findIndex(tr => tr.text.includes('BRIEF INFORMATION ABOUT PREVIOUS EMPLOYERS'));
    if (empHeaderIdx !== -1 && cand.employers && cand.employers.length > 0) {
      cand.employers.forEach((e, eIdx) => {
        const targetTr = trMatches[empHeaderIdx + 2 + eIdx];
        if (targetTr) {
          const updated = setRowCellValues(targetTr.xml, {
            0: e.company, 1: e.personInCharge, 2: e.contactDetails
          });
          xml = xml.replace(targetTr.xml, updated);
        }
      });
    }

    zip.file('word/document.xml', xml);
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    return blob;
  } catch (e) {
    console.warn('DOCX template filling fallback to HTML doc:', e);
    const htmlContent = buildApplicationFormHtml(cand);
    return new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  }
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

// Generate PDF by directly populating fields of official Crew_Application_Form.pdf template!
const generatePdfBlob = async (cand) => {
  try {
    const resp = await fetch('./Crew_Application_Form.pdf');
    if (!resp.ok) throw new Error('Could not fetch template PDF');
    const templateBytes = await resp.arrayBuffer();
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    const setF = (fieldName, value) => {
      if (value === undefined || value === null || value === '') return;
      try {
        const field = form.getField(fieldName);
        if (!field) return;
        const valStr = String(value).trim();
        if (field.constructor.name === 'PDFTextField') {
          field.setText(valStr);
        } else if (field.constructor.name === 'PDFDropdown') {
          const opts = field.getOptions() || [];
          if (!opts.length) return;
          if (opts.includes(valStr)) {
            field.select(valStr);
            return;
          }
          const lowerVal = valStr.toLowerCase();
          let matched = null;
          if (lowerVal.includes('master') || lowerVal.includes('captain')) matched = opts.find(o => o === '#MST' || o === 'MAST' || o === 'MASTER');
          else if (lowerVal.includes('chief engineer')) matched = opts.find(o => o === '#CE' || o === 'CE');
          else if (lowerVal.includes('chief officer') || lowerVal.includes('1st mate')) matched = opts.find(o => o === '#CO' || o === 'CO');
          else if (lowerVal.includes('2nd engineer')) matched = opts.find(o => o === '#2E' || o === '2E');
          else if (lowerVal.includes('2nd officer') || lowerVal.includes('2nd mate')) matched = opts.find(o => o === '#2O' || o === '2O');
          else if (lowerVal.includes('3rd engineer')) matched = opts.find(o => o === '#3E' || o === '3E');
          else if (lowerVal.includes('3rd officer') || lowerVal.includes('3rd mate')) matched = opts.find(o => o === '#3O' || o === '3O');
          else if (lowerVal.includes('4th engineer')) matched = opts.find(o => o === '#4E' || o === '4E');
          else if (lowerVal.includes('electrical engineer') || lowerVal.includes('eto')) matched = opts.find(o => o === '#EE' || o === 'ETO');
          else if (lowerVal.includes('bosun')) matched = opts.find(o => o === '#BSN' || o === 'BOSUN');
          else if (lowerVal.includes('ab') || lowerVal.includes('able')) matched = opts.find(o => o === '#AB' || o === 'AB');
          else if (lowerVal.includes('os') || lowerVal.includes('ordinary')) matched = opts.find(o => o === '#OS' || o === 'OS');
          else if (lowerVal.includes('cook')) matched = opts.find(o => o === '#COOK' || o === 'COOK');
          else if (lowerVal.includes('fitter')) matched = opts.find(o => o === '#FTR' || o === 'FITTER');
          else if (lowerVal.includes('wiper')) matched = opts.find(o => o === '#WIPER' || o === 'WIPER');
          else if (lowerVal.includes('oiler')) matched = opts.find(o => o === 'OIL');

          if (!matched) {
            if (lowerVal.includes('container')) matched = opts.find(o => o === 'CONTAINER');
            else if (lowerVal.includes('chemical')) matched = opts.find(o => o === 'CHEMICAL' || o === 'OIL AND CHEM');
            else if (lowerVal.includes('oil') || lowerVal.includes('product')) matched = opts.find(o => o === 'OIL' || o === 'TANKER');
            else if (lowerVal.includes('bulk')) matched = opts.find(o => o === 'BULK CARRIER');
            else if (lowerVal.includes('lpg') || lowerVal.includes('lng') || lowerVal.includes('gas')) matched = opts.find(o => o === 'GAS' || o === 'LNG' || o === 'LPG');
            else if (lowerVal.includes('russia')) matched = opts.find(o => o.toLowerCase().includes('rus'));
            else if (lowerVal.includes('marri') || lowerVal.includes('женат')) matched = opts.find(o => o.toLowerCase().includes('marr'));
          }

          if (!matched) {
            matched = opts.find(o => o.toLowerCase() === lowerVal || lowerVal.includes(o.toLowerCase()) || o.toLowerCase().includes(lowerVal));
          }

          if (matched) {
            field.select(matched);
          }
        }
      } catch(e) {}
    };

    // Populate Personal Info
    setF('Surname', cand.surname || cand.fullName?.split(' ')[0]);
    setF('Firstname', cand.name || cand.fullName?.split(' ').slice(1).join(' '));
    setF('Fathersname', cand.fatherName);
    setF('Mothersname', cand.motherName);
    setF('DOB', cand.dob);
    setF('DOA', cand.readyDate);
    setF('Nationality', cand.nationality || cand.citizenship);
    setF('PlaceofBirth', cand.placeOfBirth);
    setF('Maritalstatus', cand.maritalStatus);
    setF('No_Of_Children', cand.childrenUnder18);
    setF('Per_Add', cand.address || cand.homeAddress);
    setF('Per_Zip', cand.homeZip);
    setF('Telephone1', cand.phone);
    setF('Email1', cand.email);
    setF('Social_media1', cand.skypeTelegram);
    setF('NOK_Name', cand.kinName || cand.kin?.name);
    setF('NOK_Address', cand.kinRelation || cand.kin?.relation);
    setF('NOK_phone', cand.kinPhone || cand.kin?.phone);
    setF('Height', cand.height);
    setF('Weight', cand.weight);
    setF('Shoes', cand.shoeSize);
    setF('Chest', cand.overallSize);
    setF('Eyes_Colour', cand.eyesColour);
    setF('Hair_Colour', cand.hairColour);
    setF('RANK', cand.appliedRank);

    // Education
    setF('PreSea_Institution', cand.collegeName);
    setF('PreSea_From_Date', cand.collegeFrom);
    setF('PreSea_To_Date', cand.collegeTill);

    // Passports
    setF('DOC_NO_1', cand.passportNo || cand.passport?.no);
    setF('ISSUED_DATE_1', cand.passportIssued || cand.passport?.issued);
    setF('VALID_UNTIL_DATE_1', cand.passportExpiry || cand.passport?.expiry);
    setF('PLACE_1', cand.passportPlace || cand.passport?.place);

    setF('DOC_NO_3', cand.seamanBookNo || cand.seamanBook?.no);
    setF('ISSUED_DATE_3', cand.seamanBookIssued || cand.seamanBook?.issued);
    setF('VALID_UNTIL_DATE_3', cand.seamanBookExpiry || cand.seamanBook?.expiry);
    setF('PLACE_3', cand.seamanBookPlace || cand.seamanBook?.place);

    // Certificates
    (cand.certificates || []).forEach((c, idx) => {
      const fIdx = idx + 4;
      setF('DOC_NO_' + fIdx, c.certNo || c.certName);
      setF('ISSUED_DATE_' + fIdx, c.certIssued);
      setF('VALID_UNTIL_DATE_' + fIdx, c.certValid);
      setF('PLACE_' + fIdx, c.rankCapacity);
    });

    // Foreign Record Books
    (cand.recordBooks || []).forEach((rb, idx) => {
      const rIdx = idx + 1;
      setF('SB_FLAG_NO_' + rIdx, rb.number);
      setF('SB_FLAG_ISSUED_DATE_' + rIdx, rb.issuedDate);
      setF('SB_FLAG_VALID_UNTIL_DATE_' + rIdx, rb.validUntil);
      setF('SB_FLAG_PLACE_NO_' + rIdx, rb.place);
    });

    // Sea Service
    (cand.seaService || []).forEach((s, idx) => {
      const sIdx = idx + 1;
      setF('FROM_DATE_' + sIdx, s.dateFrom);
      setF('TO_DATE_' + sIdx, s.dateTo);
      setF('POSITION_' + sIdx, s.rankHeld);
      setF('SALARY_' + sIdx, s.salary);
      setF('NAME_OF_VESSEL_' + sIdx, s.vesselName);
      setF('SHIPOWNER_' + sIdx, s.shipowner);
      setF('TYPE_OF_VESSEL_' + sIdx, s.vesselType);
      setF('TYPE_OF_ENGINE_' + sIdx, s.engineType);
      setF('BUILD_YEAR_' + sIdx, s.buildYear);
      setF('DWT_' + sIdx, s.dwtGrt);
      setF('BHP_' + sIdx, s.engineBhp);
      setF('FLAG_' + sIdx, s.flag);
      setF('CREWING_AGENT_' + sIdx, s.manningCompany);
    });

    // Employers
    (cand.employers || []).forEach((e, idx) => {
      const eIdx = idx + 1;
      setF('COMPANY_' + eIdx, e.company);
      setF('PIC_' + eIdx, e.personInCharge);
      setF('CONTACT_' + eIdx, e.contactDetails);
    });

    setF('APPLIED_DATE', new Date().toISOString().split('T')[0]);

    const filledPdfBytes = await pdfDoc.save();
    return filledPdfBytes;
  } catch (e) {
    console.error('Error generating PDF from template:', e);
    return null;
  }
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

  // 1. Add DOC questionnaire (filled template Application form.docx)
  const docBlob = await generateDocBlob(cand);
  const docArrayBuffer = await docBlob.arrayBuffer();
  folder.file(`Application_${cleanName}_${cand.id || 'FORM'}.docx`, docArrayBuffer);

  // 2. Add PDF questionnaire (async — direct template filling with pdf-lib)
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

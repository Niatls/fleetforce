// Utility functions for DOCX questionnaire generation and export
import JSZip from 'jszip';

// Helper: Parse Full Name into Surname, Name (First name), and Father's name (Patronymic)
export const parseCandidateNameParts = (cand) => {
  const nameParts = (cand?.fullName || '').trim().split(/\s+/).filter(Boolean);
  const surname = cand?.surname || nameParts[0] || '';
  const name = cand?.name || (nameParts.length > 2 ? nameParts[1] : nameParts.slice(1).join(' ')) || '';
  const fatherName = cand?.fatherName || (nameParts.length > 2 ? nameParts.slice(2).join(' ') : '') || '';
  return { surname, name, fatherName };
};

// Helper: Format applied rank string
export const formatAppliedPositionsText = (cand) => {
  if (!cand) return '-';
  return cand.appliedRank || '-';
};

// Helper: Build comprehensive HTML application form matching Crew_Application_Form.pdf for Word (.doc) fallback
export const buildApplicationFormHtml = (cand) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const { surname: parsedSurname, name: parsedName, fatherName: parsedFatherName } = parseCandidateNameParts(cand);

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
          <td class="val"><strong>${formatAppliedPositionsText(cand)}</strong></td>
          <td class="lbl">Date of readiness:</td>
          <td class="val">${cand.readyDate || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">Surname:</td>
          <td class="val">${parsedSurname || '-'}</td>
          <td class="lbl">Name:</td>
          <td class="val">${parsedName || '-'}</td>
        </tr>
        <tr>
          <td class="lbl">Father’s name:</td>
          <td class="val">${parsedFatherName || '-'}</td>
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
          <td colspan="3">${[cand.address || cand.homeAddress, cand.homeZip ? `Zip: ${cand.homeZip}` : ''].filter(Boolean).join(', ') || '-'}</td>
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

// Fill exact Application form.docx template file using JSZip
export const generateDocBlob = async (cand) => {
  try {
    const baseUrl = window.location.href.split('#')[0].replace(/\/[^\/]*$/, '/');
    const templateUrl = new URL('Application form.docx', baseUrl).href;
    const resp = await fetch(templateUrl);
    if (!resp.ok) throw new Error('Could not fetch template DOCX from ' + templateUrl);
    const templateBytes = await resp.arrayBuffer();

    const zip = await JSZip.loadAsync(templateBytes);
    let xml = await zip.file('word/document.xml').async('text');

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
      const fullRankText = formatAppliedPositionsText(cand);
      const updated = setRowCellValues(trMatches[0].xml, { 1: fullRankText, 3: cand.readyDate });
      xml = xml.replace(trMatches[0].xml, updated);
    }

    const { surname: parsedSurname, name: parsedName, fatherName: parsedFatherName } = parseCandidateNameParts(cand);

    const combinedAddress = [cand.address || cand.homeAddress, cand.homeZip ? `Zip: ${cand.homeZip}` : ''].filter(Boolean).join(', ');

    // Personal Details (Rows 1 to 11 & Education)
    const labelRowMap = [
      { label: 'Surname:', map: { 1: parsedSurname, 3: parsedName } },
      { label: 'Father’s name:', map: { 1: parsedFatherName, 3: cand.motherName } },
      { label: 'Date of birth:', map: { 1: cand.dob, 3: cand.nationality || cand.citizenship } },
      { label: 'Place of birth:', map: { 1: cand.placeOfBirth, 3: cand.maritalStatus } },
      { label: 'N of children under 18:', map: { 1: cand.childrenUnder18 } },
      { label: 'Home Address:', map: { 1: combinedAddress, 3: cand.phone } },
      { label: 'E-mail:', map: { 1: cand.email, 3: cand.skypeTelegram } },
      { label: 'Next of kin:', map: { 1: cand.kinName || cand.kin?.name, 3: cand.kinRelation || cand.kin?.relation } },
      { label: 'Next of kin’s address:', map: { 1: cand.kinAddress || cand.kin?.address, 3: cand.kinPhone || cand.kin?.phone } },
      { label: 'Height (cm):', map: { 1: cand.height, 3: cand.weight, 5: cand.overallSize, 7: cand.shoeSize } },
      { label: 'Eyes Colour:', map: { 1: cand.eyesColour, 3: cand.hairColour } },
      { label: 'Name of maritime college or academy', map: { 1: cand.collegeName, 3: cand.collegeFrom } },
      { label: 'Department', map: { 1: cand.collegeDepartment, 3: cand.collegeTill } }
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

    // Match candidate certificates against pre-printed STCW certificate rows
    (cand.certificates || []).forEach(c => {
      const name = (c.certName || '').toLowerCase();
      if (!name) return;

      trMatches.forEach(tr => {
        const rowText = tr.text.toLowerCase();
        let matched = false;

        if (name.includes('gmdss') && rowText.includes('gmdss')) matched = true;
        else if (name.includes('basic safety') && rowText.includes('basic safety')) matched = true;
        else if (name.includes('survival craft') && rowText.includes('survival craft')) matched = true;
        else if (name.includes('fire fighting') && rowText.includes('advanced fire fighting')) matched = true;
        else if (name.includes('first aid') && rowText.includes('first aid')) matched = true;
        else if (name.includes('medical care') && rowText.includes('medical care')) matched = true;
        else if (name.includes('ship security officer') && rowText.includes('ships security officer')) matched = true;
        else if (name.includes('security duties') && rowText.includes('designated security duties')) matched = true;
        else if (name.includes('security awareness') && rowText.includes('security awareness')) matched = true;
        else if (name.includes('radar') && rowText.includes('radar navigation')) matched = true;
        else if (name.includes('engine room') && rowText.includes('engine room resource')) matched = true;
        else if (name.includes('bridge team') && rowText.includes('bridge team')) matched = true;
        else if (name.includes('ecdis') && rowText.includes('ecdis')) matched = true;
        else if (name.includes('high voltage') && rowText.includes('high voltage')) matched = true;
        else if (name.includes('cook') && rowText.includes('cook certificate')) matched = true;
        else if (name.includes('yellow fever') && rowText.includes('yellow fever')) matched = true;
        else if (name.includes('covid') && rowText.includes('covid-19')) matched = true;

        if (matched) {
          const updated = setRowCellValues(tr.xml, {
            1: c.certNo || '-',
            2: c.certIssued || '-',
            3: c.certValid || '-',
            4: c.rankCapacity || '-'
          });
          xml = xml.replace(tr.xml, updated);
        }
      });
    });

    // Populate Sea Service table rows
    let seaHeaderIdx = trMatches.findIndex(tr => tr.text.includes('PREVIOUS SEA SERVICE'));
    if (seaHeaderIdx !== -1 && cand.seaService && cand.seaService.length > 0) {
      cand.seaService.forEach((s, sIdx) => {
        const targetTr = trMatches[seaHeaderIdx + 2 + sIdx];
        if (targetTr) {
          const updated = setRowCellValues(targetTr.xml, {
            0: s.dateFrom || '-', 1: s.dateTo || '-', 2: s.rankHeld || '-', 3: s.salary || '-',
            4: s.vesselName || '-', 5: s.shipowner || '-', 6: s.vesselType || '-', 7: s.engineType || '-',
            8: s.buildYear || '-', 9: s.dwtGrt || '-', 10: s.engineBhp || '-', 11: s.flag || '-', 12: s.manningCompany || '-'
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
            0: e.company || '-', 1: e.personInCharge || '-', 2: e.contactDetails || '-'
          });
          xml = xml.replace(targetTr.xml, updated);
        }
      });
    }

    // Ensure table indentation from left margin is zero
    xml = xml.replace(/<w:tblInd\s+[^>]*\/>/gi, '<w:tblInd w:w="0" w:type="dxa"/>');

    zip.file('word/document.xml', xml);
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    return blob;
  } catch (e) {
    console.warn('DOCX template filling fallback to HTML doc:', e);
    const htmlContent = buildApplicationFormHtml(cand);
    return new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  }
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

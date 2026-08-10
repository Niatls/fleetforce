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
  if (!cand) cand = {};
  const todayStr = new Date().toLocaleDateString('ru-RU');
  const { surname: parsedSurname, name: parsedName, fatherName: parsedFatherName } = parseCandidateNameParts(cand);

  const surname = cand.surname || parsedSurname || '';
  const name = cand.name || parsedName || '';
  const fatherName = cand.fatherName || parsedFatherName || '';

  const getDocVal = (docName, field) => {
    // 1. Check cand.primaryDocs if present (exact or fuzzy key)
    if (cand.primaryDocs) {
      if (cand.primaryDocs[docName] && cand.primaryDocs[docName][field]) {
        return cand.primaryDocs[docName][field];
      }
      const cleanTarget = docName.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const foundKey = Object.keys(cand.primaryDocs).find(k => {
        const cleanK = k.toUpperCase().replace(/[^A-Z0-9]/g, '');
        return cleanK.length > 3 && (cleanK.includes(cleanTarget.substring(0, 8)) || cleanTarget.includes(cleanK.substring(0, 8)));
      });
      if (foundKey && cand.primaryDocs[foundKey] && cand.primaryDocs[foundKey][field]) {
        return cand.primaryDocs[foundKey][field];
      }
    }

    // 2. Fallback to flat properties
    const uName = docName.toUpperCase();
    if (uName.includes('TRAVEL PASSPORT')) {
      if (field === 'number') return cand.passNo || cand.passportNo || cand.passNum || '';
      if (field === 'issued') return cand.passIssued || cand.passportIssued || '';
      if (field === 'expiry') return cand.passValid || cand.passportExpiry || cand.passValidUntil || '';
      if (field === 'place') return cand.passPlace || cand.passportPlace || '';
    }
    if (uName.includes('SEAMAN')) {
      if (field === 'number') return cand.seamanNo || cand.seamanBookNo || '';
      if (field === 'issued') return cand.seamanIssued || cand.seamanBookIssued || '';
      if (field === 'expiry') return cand.seamanValid || cand.seamanBookExpiry || '';
      if (field === 'place') return cand.seamanPlace || cand.seamanBookPlace || '';
    }
    if (uName.includes('SEAFARERS')) {
      if (field === 'number') return cand.sidNo || cand.sidNumber || '';
      if (field === 'issued') return cand.sidIssued || '';
      if (field === 'expiry') return cand.sidValid || cand.sidExpiry || '';
      if (field === 'place') return cand.sidPlace || '';
    }
    if (uName.includes('CIVIL PASSPORT')) {
      if (field === 'number') return cand.civilPassNo || cand.civilPassportNo || '';
      if (field === 'issued') return cand.civilPassIssued || '';
      if (field === 'expiry') return cand.civilPassValid || cand.civilPassportExpiry || '';
      if (field === 'place') return cand.civilPassPlace || '';
    }
    if (uName.includes('U.S. VISA') || uName.includes('US VISA')) {
      if (field === 'number') return cand.usVisaNo || cand.c1dNo || '';
      if (field === 'issued') return cand.usVisaIssued || cand.c1dIssued || '';
      if (field === 'expiry') return cand.usVisaValid || cand.c1dValid || '';
      if (field === 'place') return cand.usVisaPlace || cand.c1dPlace || '';
    }
    if (uName.includes('OTHER VALID VISA')) {
      if (field === 'number') return cand.schengenNo || cand.otherVisaNo || '';
      if (field === 'issued') return cand.schengenIssued || cand.otherVisaIssued || '';
      if (field === 'expiry') return cand.schengenValid || cand.otherVisaValid || '';
      if (field === 'place') return cand.schengenPlace || cand.otherVisaPlace || '';
    }
    if (uName.includes('CERTIFICATE OF COMPETENCY # 1') || uName === 'CERTIFICATE OF COMPETENCY # 1') {
      if (field === 'number') return cand.cocNo || cand.coc1No || '';
      if (field === 'issued') return cand.cocIssued || cand.coc1Issued || '';
      if (field === 'expiry') return cand.cocValid || cand.coc1Valid || '';
      if (field === 'place') return cand.cocPlace || cand.coc1Place || '';
    }
    if (uName === 'RANK_CAPACITY_1') {
      if (field === 'number') return cand.cocRank || cand.coc1Rank || cand.appliedRank || '';
    }
    if (uName.includes('ENDORSEMENT OF CERTIFICATE # 1') || uName.includes('ENDORSEMENT OF CERTIFICATE #1')) {
      if (field === 'number') return cand.endorseNo || cand.endorse1No || '';
      if (field === 'issued') return cand.endorseIssued || cand.endorse1Issued || '';
      if (field === 'expiry') return cand.endorseValid || cand.endorse1Valid || '';
      if (field === 'place') return cand.endorsePlace || cand.endorse1Place || '';
    }
    if (uName.includes('CERTIFICATE OF COMPETENCY # 2') || uName === 'CERTIFICATE OF COMPETENCY # 2') {
      if (field === 'number') return cand.coc2No || '';
      if (field === 'issued') return cand.coc2Issued || '';
      if (field === 'expiry') return cand.coc2Valid || '';
      if (field === 'place') return cand.coc2Place || '';
    }
    if (uName === 'RANK_CAPACITY_2') {
      if (field === 'number') return cand.coc2Rank || '';
    }
    if (uName.includes('ENDORSEMENT OF CERTIFICATE # 2') || uName.includes('ENDORSEMENT OF CERTIFICATE #2')) {
      if (field === 'number') return cand.endorse2No || '';
      if (field === 'issued') return cand.endorse2Issued || '';
      if (field === 'expiry') return cand.endorse2Valid || '';
      if (field === 'place') return cand.endorse2Place || '';
    }
    return '';
  };

  const getStcwVal = (certName, field) => {
    // 1. Check cand.stcwCertificates or cand.stcwDocs
    const stcwMap = cand.stcwCertificates || cand.stcwDocs;
    if (stcwMap) {
      if (stcwMap[certName] && stcwMap[certName][field]) {
        return stcwMap[certName][field];
      }
      const cleanTarget = certName.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const foundKey = Object.keys(stcwMap).find(k => {
        const cleanK = k.toUpperCase().replace(/[^A-Z0-9]/g, '');
        return cleanK.length > 3 && (cleanK.includes(cleanTarget.substring(0, 8)) || cleanTarget.includes(cleanK.substring(0, 8)));
      });
      if (foundKey && stcwMap[foundKey] && stcwMap[foundKey][field]) {
        return stcwMap[foundKey][field];
      }
    }

    // 2. Check special flat fields
    const uCert = certName.toUpperCase();
    if (uCert.includes('YELLOW FEVER')) {
      if (field === 'number') return cand.yellowFeverNo || '';
      if (field === 'issued') return cand.yellowFeverIssued || '';
      if (field === 'expiry') return cand.yellowFeverValid || '';
      if (field === 'place') return cand.yellowFeverPlace || '';
    }
    if (uCert.includes('MEDICAL CARE') || uCert.includes('MEDICAL CERTIFICATE')) {
      if (field === 'number') return cand.medCertNo || '';
      if (field === 'issued') return cand.medCertIssued || '';
      if (field === 'expiry') return cand.medCertValid || '';
      if (field === 'place') return cand.medCertPlace || '';
    }

    // 3. Search in cand.certificates array if present
    if (cand.certificates && Array.isArray(cand.certificates)) {
      const found = cand.certificates.find(c => {
        const nameInArray = (c.certName || c.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        const cleanTarget = certName.toUpperCase().replace(/[^A-Z0-9]/g, '');
        return nameInArray.includes(cleanTarget.substring(0, 8)) || cleanTarget.includes(nameInArray.substring(0, 8));
      });
      if (found) {
        if (field === 'number') return found.certNo || found.number || '';
        if (field === 'issued') return found.certIssued || found.issued || '';
        if (field === 'expiry') return found.certValid || found.expiry || found.validUntil || '';
        if (field === 'place') return found.rankCapacity || found.place || '';
      }
    }
    return '';
  };

  const photoHtml = cand.photoDataUrl
    ? `<img src="${cand.photoDataUrl}" style="max-width:30mm;max-height:40mm;object-fit:cover;display:block;margin:0 auto;" />`
    : `<div class="photo-placeholder">PHOTO</div>`;

  const primaryDocsRows = [
    { label: 'TRAVEL PASSPORT:', key: 'TRAVEL PASSPORT:' },
    { label: "SEAMAN’S BOOK:", key: "SEAMAN'S BOOK (SID):" },
    { label: 'SEAFARERS’S IDENTITY DOCUMENT(SID):', key: "SEAFARERS'S IDENTITY DOCUMENT(SID):" },
    { label: 'CIVIL PASSPORT:', key: 'CIVIL PASSPORT:' },
    { label: 'U.S. VISA:', key: 'U.S. VISA:' },
    { label: 'OTHER VALID VISA:', key: 'OTHER VALID VISA:' },
    { label: 'CERTIFICATE OF COMPETENCY # 1', key: 'CERTIFICATE OF COMPETENCY # 1', hasRank: 1 },
    { label: 'ENDORSEMENT OF CERTIFICATE # 1', key: 'ENDORSEMENT OF CERTIFICATE #1' },
    { label: 'CERTIFICATE OF COMPETENCY # 2', key: 'CERTIFICATE OF COMPETENCY # 2', hasRank: 2 },
    { label: 'ENDORSEMENT OF CERTIFICATE # 2', key: 'ENDORSEMENT OF CERTIFICATE #2' },
  ].map(item => {
    const num = getDocVal(item.key, 'number');
    const iss = getDocVal(item.key, 'issued');
    const exp = getDocVal(item.key, 'expiry');
    const plc = getDocVal(item.key, 'place');
    let html = `
      <tr>
        <td style="width:61.32mm;background-color:#E2EFD9;font-size:10pt;font-weight:bold;" colspan="4">${item.label}</td>
        <td style="width:29.71mm;background-color:#FFFFFF;" colspan="2">${num}</td>
        <td style="width:21.22mm;background-color:#FFFFFF;" colspan="2">${iss}</td>
        <td style="width:21.37mm;background-color:#FFFFFF;" colspan="2">${exp}</td>
        <td style="width:36.38mm;background-color:#FFFFFF;" colspan="3">${plc}</td>
      </tr>
    `;
    if (item.hasRank) {
      const rankVal = getDocVal(`RANK_CAPACITY_${item.hasRank}`, 'number');
      html += `
        <tr>
          <td style="width:31.62mm;background-color:#E2EFD9;font-size:10pt;font-weight:bold;" colspan="2">RANK / CAPACITY</td>
          <td style="width:138.38mm;background-color:#FFFFFF;" colspan="11">${rankVal}</td>
        </tr>
      `;
    }
    return html;
  }).join('');

  const stcwList = [
    "GMDSS CERTIFICATE/ENDORSEMENT",
    "BASIC SAFETY TRAINING",
    "PROFICIENCY IN SURVIVAL CRAFT",
    "ADVANCED FIRE FIGHTING",
    "MEDICAL FIRST AID",
    "MEDICAL CARE",
    "SHIPS SECURITY OFFICER",
    "DESIGNATED SECURITY DUTIES",
    "SECURITY AWARENESS",
    "SHIPS SAFETY OFFICER / ISM",
    "RADAR NAVIGATION, RADAR PLOTTING AND USE OF ARPA",
    "ADVANCED TRAINING FOR SHIPS OPERATING IN POLAR WATERS CERTIFICATE",
    "BASIC TRAINING FOR SHIPS OPERATING IN POLAR WATERS CERTIFICATE",
    "DANGEROUS & HAZARDOUS CARGOES",
    "BRIDGE TEAM MNGT",
    "ENGINE ROOM RESOURCE MNGT",
    "ECDIS GENERIC",
    "ECDIS SPECIFIC",
    "BASIC TRAINING FOR OIL & CHEMICAL TANKER CERTIFICATE",
    "ADV. TRAINING FOR CHEMICAL TANKER CERTIFICATE",
    "ADV. TRAINING FOR CHEMICAL TANKER CERTIFICATE",
    "BASIC TRAINING FOR OIL AND CHEMICAL TANKER - ENDORSEMENT",
    "ADV. TRAINING FOR OIL TANKER -ENDORSEMENT",
    "ADV. TRAINING FOR CHEMICAL TANKER -ENDORSEMENT",
    "BASIC/ADV. TRAINING FOR GAS TANKER ENDO",
    "HIGH VOLTAGE EL. EQUIPMENT",
    "COOK CERTIFICATE",
    "MESSMAN (MLC-2006)",
    "YELLOW FEVER CERTIFICATE",
    "COVID-19 VACCINATION CERTIFICATE"
  ];

  const stcwRows = stcwList.map(name => {
    const num = getStcwVal(name, 'number');
    const iss = getStcwVal(name, 'issued');
    const exp = getStcwVal(name, 'expiry');
    const plc = getStcwVal(name, 'place');
    return `
      <tr>
        <td class="cert-label-cell" style="width:61.32mm;background-color:#E2EFD9;font-size:10pt;font-weight:bold;" colspan="4" title="${name}">${name}</td>
        <td style="width:29.71mm;background-color:#FFFFFF;" colspan="2">${num}</td>
        <td style="width:21.22mm;background-color:#FFFFFF;" colspan="2">${iss}</td>
        <td style="width:21.37mm;background-color:#FFFFFF;" colspan="2">${exp}</td>
        <td style="width:36.38mm;background-color:#FFFFFF;" colspan="3">${plc}</td>
      </tr>
    `;
  }).join('');

  const v = (val) => (val !== undefined && val !== null && String(val).trim() !== '') ? val : '&nbsp;';

  const recBookRows = Array.from({ length: 4 }).map((_, i) => {
    const rb = (cand.recordBooks || [])[i] || {};
    return `
      <tr style="height:6mm;">
        <td style="width:92.95mm;background-color:#FFFFFF;height:6mm;">${v(rb.flag)}</td>
        <td style="width:53.94mm;background-color:#FFFFFF;height:6mm;">${v(rb.number)}</td>
        <td style="width:53.94mm;background-color:#FFFFFF;height:6mm;">${v(rb.issuedDate)}</td>
        <td style="width:38.08mm;background-color:#FFFFFF;height:6mm;">${v(rb.validUntil)}</td>
        <td style="width:38.08mm;background-color:#FFFFFF;height:6mm;">${v(rb.place)}</td>
      </tr>
    `;
  }).join('');

  const seaRows = Array.from({ length: 10 }).map((_, i) => {
    const s = (cand.seaService || [])[i] || {};
    return `
      <tr style="height:6mm;">
        <td style="width:18.00mm;background-color:#FFFFFF;height:6mm;" colspan="2">${v(s.dateFrom)}</td>
        <td style="width:18.00mm;background-color:#FFFFFF;height:6mm;" colspan="2">${v(s.dateTo)}</td>
        <td style="width:15.00mm;background-color:#FFFFFF;height:6mm;">${v(s.rankHeld)}</td>
        <td style="width:13.00mm;background-color:#FFFFFF;height:6mm;">${s.salary ? '$' + s.salary : '&nbsp;'}</td>
        <td style="width:30.00mm;background-color:#FFFFFF;height:6mm;" colspan="2">${v(s.vesselName)}</td>
        <td style="width:28.00mm;background-color:#FFFFFF;height:6mm;" colspan="2">${v(s.shipowner)}</td>
        <td style="width:28.00mm;background-color:#FFFFFF;height:6mm;" colspan="2">${v(s.vesselType)}</td>
        <td style="width:28.00mm;background-color:#FFFFFF;height:6mm;" colspan="2">${v(s.engineType)}</td>
        <td style="width:15.00mm;background-color:#FFFFFF;height:6mm;">${v(s.buildYear)}</td>
        <td style="width:14.00mm;background-color:#FFFFFF;height:6mm;">${v(s.dwtGrt)}</td>
        <td style="width:14.00mm;background-color:#FFFFFF;height:6mm;">${v(s.engineBhp)}</td>
        <td style="width:22.00mm;background-color:#FFFFFF;height:6mm;">${v(s.flag)}</td>
        <td style="width:31.00mm;background-color:#FFFFFF;height:6mm;">${v(s.manningCompany)}</td>
      </tr>
    `;
  }).join('');

  const empRows = Array.from({ length: 5 }).map((_, i) => {
    const e = (cand.employers || [])[i] || {};
    return `
      <tr style="height:6mm;">
        <td style="width:80.00mm;background-color:#FFFFFF;height:6mm;" colspan="7">${v(e.company)}</td>
        <td style="width:114.00mm;background-color:#FFFFFF;height:6mm;" colspan="8">${v(e.personInCharge)}</td>
        <td style="width:81.00mm;background-color:#FFFFFF;height:6mm;" colspan="4">${v(e.contactDetails)}</td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Seafarer Application Form - ${cand.fullName || 'FleetForce'}</title>
<style>
  @page {
    size: A4;
    margin: 0;
  }
  @page page-portrait {
    size: A4 portrait;
    margin: 5mm;
  }
  @page page-landscape {
    size: A4 landscape;
    margin: 5mm;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 7.5pt;
    color: #000;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .page-portrait {
    page: page-portrait;
    width: 200mm;
    margin: 0 auto;
    padding: 6mm 3mm 4mm 3mm;
  }
  .page-landscape {
    page: page-landscape;
    width: 287mm;
    margin: 0 auto;
    padding: 6mm 3mm 4mm 3mm;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
    border-left: 0.75pt solid #000000;
    border-right: 0.75pt solid #000000;
  }
  .page-portrait tr {
    height: 6mm !important;
  }
  .page-portrait td {
    border: 0.5pt solid #000000;
    padding: 1px 3px;
    height: 6mm !important;
    vertical-align: middle;
    font-size: 10pt;
    line-height: 1.1;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
  }
  .page-landscape tr {
    height: 6mm !important;
  }
  .page-landscape td {
    border: 0.5pt solid #000000;
    padding: 1px 3px;
    height: 6mm !important;
    vertical-align: middle;
    font-size: 10pt;
    line-height: 1.1;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
  }
  .photo-cell { text-align: center; vertical-align: middle; padding: 2px; }
  .photo-placeholder {
    display: flex; align-items: center; justify-content: center;
    width: 26mm; height: 34mm; margin: 0 auto;
    border: 1pt solid #000; color: #999; font-size: 9pt;
  }
  .declaration-text {
    font-size: 10pt;
    line-height: 1.1;
    padding: 2px 4px;
    white-space: normal !important;
  }
  .cert-label-cell {
    font-size: 10pt !important;
    line-height: 1.0 !important;
    word-break: break-word;
    white-space: normal !important;
  }
  @media print {
    body { background: #fff; width: 100%; }
    .page-portrait {
      page: page-portrait;
      width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
      page-break-after: always !important;
      break-after: page !important;
    }
    .page-landscape {
      page: page-landscape;
      width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
      page-break-after: always !important;
      break-after: page !important;
    }
    .page-landscape:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }
  }
  @media screen {
    body { background: #e0e0e0; padding: 10mm; padding-top: 10mm; }
    .page-portrait, .page-landscape {
      background: #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      margin-bottom: 10mm;
    }
    .page-portrait { page-break-after: always; }
    .page-landscape { page-break-after: always; }
    .page-landscape:last-child { page-break-after: auto; }
  }
  td[contenteditable="true"] { outline: none; cursor: text; }
  td[contenteditable="true"]:focus {
    background-color: #fffde7 !important;
    box-shadow: inset 0 0 0 1.5pt #2196F3;
  }
</style>
</head>
<body>

<!-- Page 1: Portrait - Personal Information, Education, Certificates -->
<div class="page-portrait">
<table>
  <colgroup>
    <col style="width:15.81mm">
    <col style="width:15.81mm">
    <col style="width:14.85mm">
    <col style="width:14.85mm">
    <col style="width:14.85mm">
    <col style="width:14.86mm">
    <col style="width:14.86mm">
    <col style="width:10.61mm">
    <col style="width:10.61mm">
    <col style="width:10.61mm">
    <col style="width:10.76mm">
    <col style="width:10.76mm">
    <col style="width:10.76mm">
  </colgroup>
  <tr>
    <td style="width:31.62mm;background-color:#A8D08D;font-size:10.0pt;font-weight:bold;" colspan="2">Positions applied for:</td>
    <td style="width:44.56mm;background-color:#FFFFFF;font-size:10.0pt;font-weight:bold;" colspan="3">${cand.appliedRank || cand.position || ''}</td>
    <td style="width:29.72mm;background-color:#A8D08D;font-size:10.0pt;font-weight:bold;" colspan="2">Date of readiness:</td>
    <td style="width:31.83mm;background-color:#FFFFFF;" colspan="3">${cand.readyDate || cand.readinessDate || ''}</td>
    <td style="width:32.27mm;background-color:#FFFFFF;font-weight:bold;" colspan="3" rowspan="8" class="photo-cell">${photoHtml}</td>
  </tr>
  <tr>
    <td style="width:31.62mm;background-color:#A8D08D;font-size:10.0pt;font-weight:bold;" colspan="2">Surname:</td>
    <td style="width:44.56mm;background-color:#FFFFFF;" colspan="3">${surname}</td>
    <td style="width:29.72mm;background-color:#A8D08D;font-size:10.0pt;font-weight:bold;" colspan="2">Name:</td>
    <td style="width:31.83mm;background-color:#FFFFFF;" colspan="3">${name}</td>
  </tr>
  <tr>
    <td style="width:31.62mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Father’s name:</td>
    <td style="width:44.56mm;background-color:#FFFFFF;" colspan="3">${fatherName}</td>
    <td style="width:29.72mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Mother’s name:</td>
    <td style="width:31.83mm;background-color:#FFFFFF;" colspan="3">${cand.motherName || ''}</td>
  </tr>
  <tr>
    <td style="width:31.62mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Date of birth:</td>
    <td style="width:44.56mm;background-color:#FFFFFF;" colspan="3">${cand.dob || cand.birthDate || ''}</td>
    <td style="width:29.72mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Nationality:</td>
    <td style="width:31.83mm;background-color:#FFFFFF;" colspan="3">${cand.nationality || cand.citizenship || ''}</td>
  </tr>
  <tr>
    <td style="width:31.62mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Place of birth:</td>
    <td style="width:44.56mm;background-color:#FFFFFF;" colspan="3">${cand.placeOfBirth || cand.birthPlace || ''}</td>
    <td style="width:29.72mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Marital status:</td>
    <td style="width:31.83mm;background-color:#FFFFFF;" colspan="3">${cand.maritalStatus || ''}</td>
  </tr>
  <tr>
    <td style="width:31.62mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">N of children under 18:</td>
    <td style="width:106.11mm;background-color:#FFFFFF;" colspan="8">${cand.childrenUnder18 || cand.childrenCount || ''}</td>
  </tr>
  <tr>
    <td style="width:31.62mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Home Address:</td>
    <td style="width:44.56mm;background-color:#FFFFFF;" colspan="3">${cand.address || cand.homeAddress || ''}${cand.homeZip ? ` (Zip: ${cand.homeZip})` : ''}</td>
    <td style="width:29.72mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Contact Phone:</td>
    <td style="width:31.83mm;background-color:#FFFFFF;" colspan="3">${cand.phone || cand.contactPhone || ''}</td>
  </tr>
  <tr>
    <td style="width:31.62mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">E-mail:</td>
    <td style="width:44.56mm;background-color:#FFFFFF;" colspan="3">${cand.email || ''}</td>
    <td style="width:29.72mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Skype/Telegram:</td>
    <td style="width:31.83mm;background-color:#FFFFFF;" colspan="3">${cand.skypeTelegram || cand.skype || cand.telegram || ''}</td>
  </tr>
  <tr>
    <td style="width:31.62mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Next of kin:</td>
    <td style="width:74.28mm;background-color:#FFFFFF;" colspan="5">${cand.kinName || cand.nextOfKin || ''}</td>
    <td style="width:31.83mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="3">Relation:</td>
    <td style="width:32.27mm;background-color:#FFFFFF;" colspan="3">${cand.kinRelation || cand.nextOfKinRelation || ''}</td>
  </tr>
  <tr>
    <td style="width:31.62mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Next of kin’s address:</td>
    <td style="width:74.28mm;background-color:#FFFFFF;" colspan="5">${cand.kinAddress || cand.nextOfKinAddress || ''}</td>
    <td style="width:31.83mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="3">Next of kin’s phone №:</td>
    <td style="width:32.27mm;background-color:#FFFFFF;" colspan="3">${cand.kinPhone || cand.nextOfKinPhone || ''}</td>
  </tr>
  <tr>
    <td style="width:15.81mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;">Height (cm):</td>
    <td style="width:15.81mm;background-color:#FFFFFF;">${cand.height || ''}</td>
    <td style="width:14.85mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;">Weight (kg):</td>
    <td style="width:14.85mm;background-color:#FFFFFF;">${cand.weight || ''}</td>
    <td style="width:44.57mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="3" rowspan="2">Size of Overall (EUR):</td>
    <td style="width:10.61mm;background-color:#FFFFFF;" rowspan="2">${cand.overallSize || cand.clothesSize || ''}</td>
    <td style="width:42.73mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="4" rowspan="2">Shoes (EUR):</td>
    <td style="width:10.76mm;background-color:#FFFFFF;" rowspan="2">${cand.shoeSize || cand.shoesSize || ''}</td>
  </tr>
  <tr>
    <td style="width:15.81mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;">Eyes Colour:</td>
    <td style="width:15.81mm;background-color:#FFFFFF;">${cand.eyesColour || cand.eyeColor || ''}</td>
    <td style="width:14.85mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;">Hair Colour:</td>
    <td style="width:14.85mm;background-color:#FFFFFF;">${cand.hairColour || cand.hairColor || ''}</td>
  </tr>
  <tr>
    <td style="width:46.48mm;background-color:#FFFFFF;" colspan="3"></td>
    <td style="width:70.04mm;background-color:#A8D08D;font-size:10.0pt;font-weight:bold;text-align:center;" colspan="5">Marine Education</td>
    <td style="width:53.49mm;background-color:#FFFFFF;" colspan="5"></td>
  </tr>
  <tr>
    <td style="width:46.48mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="3">Name of maritime college or academy</td>
    <td style="width:80.65mm;background-color:#FFFFFF;" colspan="6">${cand.collegeName || cand.maritimeCollege || ''}</td>
    <td style="width:21.37mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">From</td>
    <td style="width:21.51mm;background-color:#FFFFFF;" colspan="2">${cand.collegeFrom || cand.educationFrom || ''}</td>
  </tr>
  <tr>
    <td style="width:46.48mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="3">Department</td>
    <td style="width:80.65mm;background-color:#FFFFFF;" colspan="6">${cand.collegeDepartment || cand.educationDepartment || ''}</td>
    <td style="width:21.37mm;background-color:#E2EFD9;font-size:10.0pt;font-weight:bold;" colspan="2">Till</td>
    <td style="width:21.51mm;background-color:#FFFFFF;" colspan="2">${cand.collegeTill || cand.collegeTo || cand.educationTill || cand.educationTo || ''}</td>
  </tr>
  <tr>
    <td style="width:46.48mm;background-color:#FFFFFF;" colspan="3"></td>
    <td style="width:70.04mm;background-color:#A8D08D;font-size:10.0pt;font-weight:bold;text-align:center;" colspan="5">PASSPORTS and CERTIFICATES</td>
    <td style="width:53.49mm;background-color:#FFFFFF;" colspan="5"></td>
  </tr>
  <tr>
    <td style="width:61.32mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="4">DOCUMENT</td>
    <td style="width:29.71mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="2">NUMBER</td>
    <td style="width:21.22mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="2">ISSUED DATE</td>
    <td style="width:21.37mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="2">VALID UNTIL</td>
    <td style="width:36.38mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="3">PLACE</td>
  </tr>
  ${primaryDocsRows}
  <tr>
    <td style="width:61.32mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="4">CERTIFICATE</td>
    <td style="width:29.71mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="2">NUMBER</td>
    <td style="width:21.22mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="2">ISSUED DATE</td>
    <td style="width:21.37mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="2">VALID UNTIL</td>
    <td style="width:36.38mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;" colspan="3">PLACE</td>
  </tr>
  ${stcwRows}
</table>
</div>

<!-- Page 2: Landscape - Foreign Seaman's ID / Record Books -->
<div class="page-landscape">
<table>
  <colgroup>
    <col style="width:92.95mm">
    <col style="width:53.94mm">
    <col style="width:53.94mm">
    <col style="width:38.08mm">
    <col style="width:38.08mm">
  </colgroup>
  <tr>
    <td style="width:92.95mm;background-color:#FFFFFF;"></td>
    <td style="width:107.88mm;background-color:#A8D08D;font-size:9.0pt;font-weight:bold;text-align:center;" colspan="2">FOREIGN SEAMAN’S ID / RECORD BOOKS</td>
    <td style="width:76.17mm;background-color:#FFFFFF;" colspan="2"></td>
  </tr>
  <tr>
    <td style="width:92.95mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;">CERTIFICATE</td>
    <td style="width:53.94mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;">NUMBER</td>
    <td style="width:53.94mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;">ISSUED DATE</td>
    <td style="width:38.08mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;">VALID UNTIL</td>
    <td style="width:38.08mm;background-color:#E2EFD9;font-size:9.0pt;font-weight:bold;">PLACE</td>
  </tr>
  ${recBookRows}
</table>
</div>

<!-- Page 3: Landscape - Previous Sea Service & Employers -->
<div class="page-landscape">
<table>
  <colgroup>
    <col style="width:9.00mm">
    <col style="width:9.00mm">
    <col style="width:9.00mm">
    <col style="width:9.00mm">
    <col style="width:15.00mm">
    <col style="width:13.00mm">
    <col style="width:15.00mm">
    <col style="width:15.00mm">
    <col style="width:14.00mm">
    <col style="width:14.00mm">
    <col style="width:14.00mm">
    <col style="width:14.00mm">
    <col style="width:14.00mm">
    <col style="width:14.00mm">
    <col style="width:15.00mm">
    <col style="width:14.00mm">
    <col style="width:14.00mm">
    <col style="width:22.00mm">
    <col style="width:31.00mm">
  </colgroup>
  <tr>
    <td style="width:275.00mm;background-color:#A8D08D;font-size:10.0pt;font-weight:bold;text-align:center;" colspan="19">PREVIOUS SEA SERVICE</td>
  </tr>
  <tr>
    <td style="width:18.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;" colspan="2">FROM</td>
    <td style="width:18.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;" colspan="2">TO</td>
    <td style="width:15.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;">POSITION</td>
    <td style="width:13.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;">SALARY</td>
    <td style="width:30.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;" colspan="2">NAME OF VESSEL</td>
    <td style="width:28.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;" colspan="2">SHIPOWNER</td>
    <td style="width:28.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;" colspan="2">TYPE OF VESSEL</td>
    <td style="width:28.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;" colspan="2">TYPE OF ENGINE</td>
    <td style="width:15.00mm;background-color:#C5E0B3;font-size:8.5pt;font-weight:bold;white-space:nowrap;">BUILD YEAR</td>
    <td style="width:14.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;">DWT</td>
    <td style="width:14.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;">BHP</td>
    <td style="width:22.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;">FLAG</td>
    <td style="width:31.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;">CREWING AGENT</td>
  </tr>
  ${seaRows}
  <tr>
    <td style="width:275.00mm;background-color:#A8D08D;font-size:9.0pt;font-weight:bold;text-align:center;" colspan="19">BRIEF INFORMATION ABOUT PREVIOUS EMPLOYERS</td>
  </tr>
  <tr>
    <td style="width:80.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;text-align:center;" colspan="7">COMPANY</td>
    <td style="width:114.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;text-align:center;" colspan="8">PERSON IN CHARGE</td>
    <td style="width:81.00mm;background-color:#C5E0B3;font-size:9.0pt;font-weight:bold;text-align:center;" colspan="4">CONTACT DETAILS (Phone Number, e-mail)</td>
  </tr>
  ${empRows}
  <tr>
    <td style="width:27.00mm;background-color:#FFFFFF;" colspan="2"></td>
    <td style="width:245.00mm;background-color:#FFFFFF;font-size:9.0pt;" colspan="17">I hereby confirm that above information is true and correct to the best of my knowledge. I understand that this information will be held in the computer database due to my real or possible employment. Signing it, I willfully give my permission to collect and process my personal information and to use it in all and legal way. I give my permission for my personal information to be provided to the possible employers and any other persons, if such need arises for my employment. Besides, I permit the Company employees to request personal information (data) about me from my former employers.</td>
  </tr>
  <tr>
    <td style="width:18.00mm;background-color:#C5E0B3;font-size:10.0pt;font-weight:bold;white-space:nowrap;" colspan="2">Date:</td>
    <td style="width:33.00mm;background-color:#FFFFFF;font-size:10.0pt;" colspan="3">${cand.signDate || todayStr}</td>
    <td style="width:128.00mm;background-color:#FFFFFF;" colspan="9"></td>
    <td style="width:29.00mm;background-color:#C5E0B3;font-size:10.0pt;font-weight:bold;" colspan="2">Signature:</td>
    <td style="width:67.00mm;background-color:#FFFFFF;font-size:10.0pt;" colspan="3">${cand.signature || cand.fullName || ''}</td>
  </tr>
</table>
</div>

<script>
document.querySelectorAll('td').forEach(function(td) {
  if (td.style.backgroundColor === 'rgb(255, 255, 255)' ||
      td.style.backgroundColor === '#FFFFFF' ||
      td.style.backgroundColor === '#ffffff') {
    if (!td.textContent.trim()) {
      td.setAttribute('contenteditable', 'true');
    }
  }
});
</script>

</body>
</html>`;
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

export const handleExportWordHtml = (cand) => {
  if (!cand) return;
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '');
  const htmlContent = buildApplicationFormHtml(cand);
  const docContent =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
    'xmlns:w="urn:schemas-microsoft-com:office:word" ' +
    'xmlns="http://www.w3.org/TR/REC-html40">' +
    '<head><meta charset="utf-8">' +
    '<!--[if gte mso 9]><xml>' +
    '<w:WordDocument><w:View>Print</w:View>' +
    '<w:Zoom>100</w:Zoom></w:WordDocument>' +
    '</xml><![endif]-->' +
    '</head><body>' +
    htmlContent +
    '</body></html>';
  const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FleetForce_Application_${cleanName}_${cand.id || 'FORM'}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};

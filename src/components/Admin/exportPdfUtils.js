// Utility functions for PDF questionnaire generation and export using pdf-lib
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { parseCandidateNameParts, formatAppliedPositionsText } from './exportDocUtils';

// Generate PDF by directly populating fields of official Crew_Application_Form.pdf template!
export const generatePdfBlob = async (cand) => {
  try {
    const baseUrl = window.location.href.split('#')[0].replace(/\/[^\/]*$/, '/');
    const templateUrl = new URL('Crew_Application_Form.pdf', baseUrl).href;
    const resp = await fetch(templateUrl);
    if (!resp.ok) throw new Error('Could not fetch template PDF from ' + templateUrl);
    const templateBytes = await resp.arrayBuffer();
    const pdfDoc = await PDFDocument.load(templateBytes);
    let font = null;
    try { font = await pdfDoc.embedFont(StandardFonts.Helvetica); } catch(e) {}
    const form = pdfDoc.getForm();

    // Transliterate Cyrillic characters to WinAnsi compatible Latin characters
    const transliteratePdf = (str) => {
      if (!str) return '';
      const ruMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
        'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
        'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
        'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
        'Я': 'Ya'
      };
      let res = String(str).split('').map(c => ruMap[c] !== undefined ? ruMap[c] : c).join('');
      return res.replace(/[^\x20-\x7E]/g, '');
    };

    const setF = (fieldName, value) => {
      if (value === undefined || value === null || value === '') return;
      try {
        const field = form.getField(fieldName);
        if (!field) return;
        const valStr = transliteratePdf(String(value)).trim();
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
            else if (lowerVal.includes('russia') || lowerVal.includes('rossiy')) matched = opts.find(o => o.toLowerCase().includes('rus'));
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
    const { surname: pdfSurname, name: pdfName, fatherName: pdfFatherName } = parseCandidateNameParts(cand);
    setF('Surname', pdfSurname);
    setF('Firstname', pdfName);
    setF('Fathersname', pdfFatherName);
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
    setF('RANK', formatAppliedPositionsText(cand));

    // Education
    setF('PreSea_Institution', cand.collegeName);
    setF('PreSea_Grade', cand.collegeDepartment);
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

    try { if (font) form.updateFieldAppearances(font); } catch(e) {}
    try { form.flatten(); } catch(e) {}

    const filledPdfBytes = await pdfDoc.save();
    return filledPdfBytes;
  } catch (e) {
    console.error('Error generating PDF from template:', e);
    return null;
  }
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

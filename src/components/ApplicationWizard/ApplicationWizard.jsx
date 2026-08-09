import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X, CheckCircle2, ChevronRight, ChevronLeft,
  Plus, Trash2, Upload, FileText, Printer, ArrowLeft, Anchor, Eye, Download
} from 'lucide-react';
import {
  MARITIME_RANKS, VESSEL_TYPES,
  getRankLabel, getVesselLabel, getEnglishLevelLabel, ENGLISH_LEVELS_TRANSLATIONS,
  MARITAL_STATUS, KIN_RELATIONS, OVERALL_SIZES_EUR, SHOE_SIZES,
  ENGINE_TYPES, FLAG_STATES, CERTIFICATE_TYPES
} from '../../data/initialData';
import { handleExportDoc, handleExportPdf, buildApplicationFormHtml, generatePdfBlob, generateDocBlob } from '../Admin/exportUtils';

// ─── helpers ───────────────────────────────────────────────────────────────
const mkId = () => Date.now() + Math.random();

const emptySeaService = (rank = '') => ({
  id: mkId(), dateFrom: '', dateTo: '',
  rankHeld: rank, salary: '',
  vesselName: '', shipowner: '',
  vesselType: '', engineType: '',
  buildYear: '', dwtGrt: '', engineBhp: '',
  flag: '', manningCompany: ''
});

const emptyRecordBook = () => ({
  id: mkId(), flag: '', number: '',
  issuedDate: '', validUntil: '', place: ''
});

const emptyCertificate = () => ({
  id: mkId(),
  certName: '',
  certNo: '', certIssued: '', certValid: '',
  rankCapacity: '',
  endorseNo: '', endorseIssued: '', endorseValid: ''
});

const emptyEmployer = () => ({
  id: mkId(), company: '', personInCharge: '', contactDetails: ''
});

// ─── Field / Row helpers ───────────────────────────────────────────────────
const FG = ({ label, children, col }) => (
  <div className="form-group" style={col ? { gridColumn: col } : {}}>
    {label && <label className="form-label">{label}</label>}
    {children}
  </div>
);

const Inp = ({ value, onChange, ...rest }) => (
  <input className="form-input" value={value || ''} onChange={e => onChange(e.target.value)} {...rest} />
);

const Sel = ({ value, onChange, options, children, placeholder = '-- SELECT --', ...rest }) => (
  <select className="form-select" value={value || ''} onChange={e => onChange(e.target.value)} {...rest}>
    {placeholder !== false && <option value="">{placeholder}</option>}
    {options ? (
      <>
        {options.map(o => {
          const val = typeof o === 'object' ? o.value : o;
          const lbl = typeof o === 'object' ? o.label : o;
          if (val === '') return null;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </>
    ) : children}
  </select>
);

const SectionTitle = ({ children }) => (
  <div style={{
    gridColumn: '1 / -1',
    borderBottom: '1px solid var(--color-accent)',
    paddingBottom: '0.4rem',
    marginTop: '0.8rem',
    marginBottom: '0.2rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--color-accent)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}>
    <Anchor size={14} />
    <span>{children}</span>
  </div>
);

const PRIMARY_DOCS_LIST = [
  "TRAVEL PASSPORT:",
  "SEAMAN'S BOOK (SID):",
  "CIVIL PASSPORT:",
  "U.S. VISA:",
  "OTHER VALID VISA:",
  "CERTIFICATE OF COMPETENCY # 1",
  "ENDORSEMENT OF CERTIFICATE #1",
  "CERTIFICATE OF COMPETENCY # 2",
  "ENDORSEMENT OF CERTIFICATE #2"
];

const STCW_CERTS_LIST = [
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
  "RADAR NAVIGATION & ARPA",
  "DANGEROUS & HAZARDOUS CARGOES",
  "BRIDGE TEAM MNGT",
  "ENGINE ROOM RESOURCE MNGT",
  "ECDIS GENERIC",
  "ECDIS SPECIFIC",
  "BASIC TRAINING OIL/CHEM TANKER",
  "ADV. TRAINING OIL TANKER",
  "ADV. TRAINING CHEM TANKER",
  "HIGH VOLTAGE EL. EQUIPMENT",
  "COOK CERTIFICATE",
  "MESSMAN (MLC-2006)",
  "YELLOW FEVER CERTIFICATE",
  "COVID-19 VACCINATION"
];

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.85rem',
  color: 'var(--text-primary)',
};
const thStyle = {
  padding: '0.6rem 0.8rem',
  background: 'rgba(30, 41, 59, 0.8)',
  border: '1px solid var(--border-color)',
  color: 'var(--color-accent)',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  textAlign: 'left',
};
const tdStyle = {
  padding: '0.3rem 0.4rem',
  border: '1px solid var(--border-color)',
};
const tableInputStyle = {
  width: '100%',
  background: 'rgba(0, 0, 0, 0.25)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  padding: '0.4rem 0.6rem',
  color: '#FFFFFF',
  fontSize: '0.85rem',
};

const STEP_LABELS = [
  '1. Personal Details',
  '2. Position & Education',
  '3. Passports & Docs',
  '4. CoC & STCW Certs',
  '5. Sea Service Matrix',
  '6. Previous Employers',
  '7. Submit',
];

// ═══════════════════════════════════════════════════════════════════════════
export const ApplicationWizard = ({ isOpen, onClose, initialRank = '', initialVesselType = '', onSubmitSuccess }) => {
  const { lang } = useLanguage();
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 7;
  const [submitted, setSubmitted] = useState(false);
  const [inlinePreview, setInlinePreview] = useState(null);
  const docxContainerRef = React.useRef(null);

  const [fd, setFd] = useState({
    appliedRank: initialRank || '',
    readyDate: '',
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    placeOfBirth: '',
    nationality: '',
    maritalStatus: '',
    childrenUnder18: '',
    phone: '',
    email: '',
    skypeTelegram: '',
    address: '',
    homeZip: '',
    kinName: '',
    kinRelation: '',
    kinPhone: '',
    kinAddress: '',
    height: '',
    weight: '',
    overallSize: '',
    shoeSize: '',
    eyesColour: '',
    hairColour: '',
    photoDataUrl: '',

    alternativeRank: '',
    minSalary: '',
    preferredVessels: initialVesselType || '',
    contractDuration: '',
    englishLevel: '',
    marlinsScore: '',
    nearestAirport: '',
    collegeName: '',
    collegeFrom: '',
    collegeTill: '',
    collegeDepartment: '',

    passportNo: '', passportIssued: '', passportExpiry: '', passportPlace: '',
    seamanBookNo: '', seamanBookIssued: '', seamanBookExpiry: '', seamanBookPlace: '',
    recordBooks: [emptyRecordBook()],

    cocName: '',
    cocNo: '', cocIssued: '', cocExpiry: '', cocCapacity: '',
    certificates: [emptyCertificate()],

    seaService: [emptySeaService(''), emptySeaService(''), emptySeaService('')],
    employers: [emptyEmployer(), emptyEmployer(), emptyEmployer()],
    attachedFiles: [],
    consent: false,
    signature: '',
    signDate: '',
  });

  const [primaryDocs, setPrimaryDocs] = useState(() => {
    const obj = {};
    PRIMARY_DOCS_LIST.forEach(doc => {
      obj[doc] = { number: '', issued: '', expiry: '', place: '' };
    });
    return obj;
  });

  const [stcwDocs, setStcwDocs] = useState(() => {
    const obj = {};
    STCW_CERTS_LIST.forEach(cert => {
      obj[cert] = { number: '', issued: '', expiry: '', place: '' };
    });
    return obj;
  });

  React.useEffect(() => {
    if ((inlinePreview?.type === 'docx_blob' || inlinePreview?.type === 'html') && docxContainerRef.current) {
      docxContainerRef.current.innerHTML = buildApplicationFormHtml(fd);
    }
  }, [inlinePreview, fd]);

  const handlePreviewHtmlInline = () => {
    setInlinePreview({
      title: `Просмотр A4 Бланка Application_form (${fd.fullName || 'Без имени'})`,
      type: 'html'
    });
  };

  const handlePreviewPdfInline = async () => {
    try {
      const pdfBytes = await generatePdfBlob(fd);
      if (!pdfBytes) {
        alert('Не удалось сформировать PDF для просмотра.');
        return;
      }
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setInlinePreview({
        title: `Просмотр PDF анкеты Crew_Application_Form.pdf (${fd.fullName || 'Без имени'})`,
        type: 'pdf',
        src: url
      });
    } catch(e) {
      console.error(e);
      alert('Ошибка при генерации PDF');
    }
  };

  const handlePreviewDocInline = async () => {
    try {
      const docBlob = await generateDocBlob(fd);
      setInlinePreview({
        title: `Просмотр DOCX анкеты Application form.docx (${fd.fullName || 'Без имени'})`,
        type: 'docx_blob',
        blob: docBlob
      });
    } catch(e) {
      console.error(e);
      alert('Ошибка при генерации DOCX');
    }
  };

  const handlePrintForm = () => {
    const html = buildApplicationFormHtml(fd);
    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Пожалуйста, разрешите всплывающие окна в браузере для печати.');
      return;
    }
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>FleetForce Application Form - ${fd.fullName || 'Seafarer'}</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { font-family: Arial, sans-serif; color: #000; background: #fff; margin: 0; padding: 15px; font-size: 11px; }
            h1, h2, h3 { color: #000; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 12px; page-break-inside: avoid; }
            th, td { border: 1px solid #000; padding: 4px 6px; font-size: 10px; text-align: left; }
            th { background: #e2e8f0; font-weight: bold; }
            .lbl { font-weight: bold; background: #f1f5f9; width: 25%; }
            @media print {
              .no-print { display: none !important; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 15px; text-align: right;">
            <button onclick="window.print()" style="padding: 8px 18px; background: #0EA5E9; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">🖨️ Распечатать страницу</button>
          </div>
          ${html}
          <script>
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  React.useEffect(() => {
    if (isOpen) {
      setFd(prev => ({
        ...prev,
        appliedRank: initialRank || prev.appliedRank,
        preferredVessels: initialVesselType || prev.preferredVessels,
      }));
    }
  }, [isOpen, initialRank, initialVesselType]);

  if (!isOpen) return null;

  const set = (field, value) => setFd(prev => ({ ...prev, [field]: value }));

  const setArr = (field, index, subfield, value) =>
    setFd(prev => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [subfield]: value };
      return { ...prev, [field]: arr };
    });

  const updatePrimaryDoc = (docName, field, value) => {
    setPrimaryDocs(prev => {
      const updated = {
        ...prev,
        [docName]: { ...prev[docName], [field]: value }
      };
      if (docName === 'TRAVEL PASSPORT:') {
        if (field === 'number') set('passportNo', value);
        if (field === 'issued') set('passportIssued', value);
        if (field === 'expiry') set('passportExpiry', value);
        if (field === 'place') set('passportPlace', value);
      } else if (docName === "SEAMAN'S BOOK (SID):") {
        if (field === 'number') set('seamanBookNo', value);
        if (field === 'issued') set('seamanBookIssued', value);
        if (field === 'expiry') set('seamanBookExpiry', value);
        if (field === 'place') set('seamanBookPlace', value);
      } else if (docName === 'CERTIFICATE OF COMPETENCY # 1') {
        if (field === 'number') set('cocNo', value);
        if (field === 'issued') set('cocIssued', value);
        if (field === 'expiry') set('cocExpiry', value);
        if (field === 'place') set('cocCapacity', value);
      }
      return updated;
    });
  };

  const updateStcwDoc = (certName, field, value) => {
    setStcwDocs(prev => {
      const updated = {
        ...prev,
        [certName]: { ...prev[certName], [field]: value }
      };
      const certList = Object.entries(updated)
        .filter(([_, data]) => data.number || data.issued || data.expiry || data.place)
        .map(([name, data]) => ({
          id: name,
          certName: name,
          certNo: data.number,
          certIssued: data.issued,
          certValid: data.expiry,
          rankCapacity: data.place
        }));
      set('certificates', certList);
      return updated;
    });
  };

  const addRow = (field, empty) =>
    setFd(prev => ({ ...prev, [field]: [...prev[field], empty()] }));

  const removeRow = (field, index) =>
    setFd(prev => ({
      ...prev,
      [field]: prev[field].length > 1 ? prev[field].filter((_, i) => i !== index) : prev[field]
    }));

  const handleFileUpload = e => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setFd(prev => ({
        ...prev,
        attachedFiles: [...prev.attachedFiles, {
          id: mkId(), name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type || file.name.split('.').pop(),
          dataUrl: ev.target.result
        }]
      }));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!fd.consent) { alert('Please confirm consent to data processing!'); return; }

    const parts = (fd.fullName || 'Seafarer').trim().split(/\s+/);
    const surname = parts[0] || '';
    const name = parts.slice(1).join(' ') || '';

    onSubmitSuccess({
      id: `APP-2026-${Date.now().toString().slice(-5)}-${Math.floor(10 + Math.random() * 90)}`,
      fullName: fd.fullName || 'Seafarer',
      surname: surname,
      name: name,
      fatherName: fd.fatherName,
      motherName: fd.motherName,
      dob: fd.dob,
      placeOfBirth: fd.placeOfBirth,
      citizenship: fd.nationality,
      nationality: fd.nationality,
      maritalStatus: fd.maritalStatus,
      childrenUnder18: fd.childrenUnder18,
      phone: fd.phone,
      email: fd.email,
      skypeTelegram: fd.skypeTelegram,
      address: fd.address,
      homeAddress: fd.address,
      appliedRank: fd.appliedRank,
      alternativeRank: fd.alternativeRank,
      minSalary: fd.minSalary,
      readyDate: fd.readyDate,
      preferredVessels: fd.preferredVessels,
      status: 'New',
      marlinsScore: fd.marlinsScore,
      englishLevel: fd.englishLevel,
      contractDuration: fd.contractDuration,
      nearestAirport: fd.nearestAirport,
      height: fd.height,
      weight: fd.weight,
      overallSize: fd.overallSize,
      shoeSize: fd.shoeSize,
      eyesColour: fd.eyesColour,
      hairColour: fd.hairColour,
      kinName: fd.kinName,
      kinRelation: fd.kinRelation,
      kinPhone: fd.kinPhone,
      kinAddress: fd.kinAddress,
      kin: { name: fd.kinName, relation: fd.kinRelation, phone: fd.kinPhone, address: fd.kinAddress },
      collegeName: fd.collegeName,
      collegeFrom: fd.collegeFrom,
      collegeTill: fd.collegeTill,
      collegeDepartment: fd.collegeDepartment,
      passportNo: fd.passportNo,
      passportIssued: fd.passportIssued,
      passportExpiry: fd.passportExpiry,
      passportPlace: fd.passportPlace,
      seamanBookNo: fd.seamanBookNo,
      seamanBookIssued: fd.seamanBookIssued,
      seamanBookExpiry: fd.seamanBookExpiry,
      seamanBookPlace: fd.seamanBookPlace,
      passport: { no: fd.passportNo, issued: fd.passportIssued, expiry: fd.passportExpiry, place: fd.passportPlace },
      seamanBook: { no: fd.seamanBookNo, issued: fd.seamanBookIssued, expiry: fd.seamanBookExpiry, place: fd.seamanBookPlace },
      recordBooks: fd.recordBooks,
      certificates: fd.certificates,
      seaService: fd.seaService,
      employers: fd.employers,
      attachedFiles: fd.attachedFiles,
      photoDataUrl: fd.photoDataUrl,
      submittedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  const grid = (cols = 'repeat(auto-fit, minmax(230px, 1fr))') => ({
    display: 'grid', gridTemplateColumns: cols, gap: '1rem'
  });

  const cardStyle = {
    background: 'rgba(21,39,66,0.6)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '1.2rem',
    marginBottom: '1rem'
  };

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <div>
          <SectionTitle>Applied Position & Personal Details</SectionTitle>
          <div style={{ overflowX: 'auto', marginTop: '0.8rem', marginBottom: '1.2rem' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '18%', background: 'rgba(30,41,59,0.5)' }}>Positions applied for: *</td>
                  <td style={{ ...tdStyle, width: '27%' }}>
                    <select style={tableInputStyle} value={fd.appliedRank} onChange={e => set('appliedRank', e.target.value)} required>
                      <option value="">-- SELECT --</option>
                      {MARITIME_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '18%', background: 'rgba(30,41,59,0.5)' }}>Date of readiness: *</td>
                  <td style={{ ...tdStyle, width: '22%' }}>
                    <input style={tableInputStyle} placeholder="DD.MM.YYYY" value={fd.readyDate} onChange={e => set('readyDate', e.target.value)} required />
                  </td>
                  <td rowSpan={8} style={{ ...tdStyle, width: '15%', textAlign: 'center', verticalAlign: 'middle', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.4rem' }}>
                      {fd.photoDataUrl ? (
                        <div style={{ position: 'relative', width: '80px', height: '100px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-accent)' }}>
                          <img src={fd.photoDataUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button" 
                            onClick={() => set('photoDataUrl', '')}
                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(220,38,38,0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', cursor: 'pointer' }}
                          >✕</button>
                        </div>
                      ) : (
                        <div style={{ width: '80px', height: '100px', borderRadius: '6px', border: '1px dashed var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'center' }}>
                          Candidate Photo
                        </div>
                      )}
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
                        Upload
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => set('photoDataUrl', ev.target.result);
                            reader.readAsDataURL(file);
                          }}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Full Name (Surname, Name): *</td>
                  <td colSpan={3} style={tdStyle}>
                    <input style={tableInputStyle} placeholder="Surname Name Patronymic" value={fd.fullName} onChange={e => set('fullName', e.target.value)} required />
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Father's name:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} value={fd.fatherName} onChange={e => set('fatherName', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Mother's name:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} value={fd.motherName} onChange={e => set('motherName', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Date of birth: *</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} placeholder="DD.MM.YYYY" value={fd.dob} onChange={e => set('dob', e.target.value)} required />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Nationality:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} value={fd.nationality} onChange={e => set('nationality', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Place of birth:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} placeholder="City, Country" value={fd.placeOfBirth} onChange={e => set('placeOfBirth', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Marital status:</td>
                  <td style={tdStyle}>
                    <select style={tableInputStyle} value={fd.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                      <option value="">-- SELECT --</option>
                      {MARITAL_STATUS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>No. of Children under 18:</td>
                  <td colSpan={3} style={tdStyle}>
                    <input style={tableInputStyle} type="number" min="0" max="20" value={fd.childrenUnder18} onChange={e => set('childrenUnder18', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Home Address:</td>
                  <td colSpan={3} style={tdStyle}>
                    <input style={tableInputStyle} placeholder="Full Address" value={fd.address} onChange={e => set('address', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Home Zip Code:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} placeholder="e.g. 190000" value={fd.homeZip} onChange={e => set('homeZip', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Contact Phone: *</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} type="tel" placeholder="+7 (900) 000-00-00" value={fd.phone} onChange={e => set('phone', e.target.value)} required />
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Email: *</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} type="email" placeholder="seaman@example.com" value={fd.email} onChange={e => set('email', e.target.value)} required />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Skype / Telegram:</td>
                  <td colSpan={2} style={tdStyle}>
                    <input style={tableInputStyle} placeholder="@username" value={fd.skypeTelegram} onChange={e => set('skypeTelegram', e.target.value)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <SectionTitle>Next of Kin (Emergency Contact)</SectionTitle>
          <div style={{ overflowX: 'auto', marginTop: '0.8rem', marginBottom: '1.2rem' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '20%', background: 'rgba(30,41,59,0.3)' }}>Next of Kin Full Name:</td>
                  <td style={{ ...tdStyle, width: '30%' }}>
                    <input style={tableInputStyle} placeholder="Spouse / Parent Name" value={fd.kinName} onChange={e => set('kinName', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '20%', background: 'rgba(30,41,59,0.3)' }}>Relation:</td>
                  <td style={{ ...tdStyle, width: '30%' }}>
                    <select style={tableInputStyle} value={fd.kinRelation} onChange={e => set('kinRelation', e.target.value)}>
                      <option value="">-- SELECT --</option>
                      {KIN_RELATIONS.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Next of Kin Address:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} placeholder="Address if different" value={fd.kinAddress} onChange={e => set('kinAddress', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Next of Kin Phone:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} type="tel" placeholder="+7 (900) 000-00-00" value={fd.kinPhone} onChange={e => set('kinPhone', e.target.value)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <SectionTitle>Physical Details & Uniform Sizes</SectionTitle>
          <div style={{ overflowX: 'auto', marginTop: '0.8rem' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '16%', background: 'rgba(30,41,59,0.3)' }}>Height (cm):</td>
                  <td style={{ ...tdStyle, width: '17%' }}>
                    <input style={tableInputStyle} type="number" placeholder="182" value={fd.height} onChange={e => set('height', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '16%', background: 'rgba(30,41,59,0.3)' }}>Weight (kg):</td>
                  <td style={{ ...tdStyle, width: '17%' }}>
                    <input style={tableInputStyle} type="number" placeholder="80" value={fd.weight} onChange={e => set('weight', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '17%', background: 'rgba(30,41,59,0.3)' }}>Size of Overall (EUR):</td>
                  <td style={{ ...tdStyle, width: '17%' }}>
                    <select style={tableInputStyle} value={fd.overallSize} onChange={e => set('overallSize', e.target.value)}>
                      <option value="">-- SELECT --</option>
                      {OVERALL_SIZES_EUR.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Eyes Colour:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} placeholder="Brown / Blue" value={fd.eyesColour} onChange={e => set('eyesColour', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Hair Colour:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} placeholder="Dark / Fair" value={fd.hairColour} onChange={e => set('hairColour', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.3)' }}>Shoes (EUR):</td>
                  <td style={tdStyle}>
                    <select style={tableInputStyle} value={fd.shoeSize} onChange={e => set('shoeSize', e.target.value)}>
                      <option value="">-- SELECT --</option>
                      {SHOE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

      case 2: return (
        <div>
          <SectionTitle>Maritime Education & Qualifications</SectionTitle>
          <div style={{ overflowX: 'auto', marginTop: '0.8rem' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '35%', background: 'rgba(30,41,59,0.5)' }}>
                    Name of maritime college or academy
                  </td>
                  <td colSpan={2} style={{ ...tdStyle, width: '45%' }}>
                    <input style={tableInputStyle} placeholder="Full Name of Academy / University" value={fd.collegeName} onChange={e => set('collegeName', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '8%', background: 'rgba(30,41,59,0.5)' }}>From:</td>
                  <td style={{ ...tdStyle, width: '12%' }}>
                    <input style={tableInputStyle} type="number" placeholder="YYYY" value={fd.collegeFrom} onChange={e => set('collegeFrom', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.5)' }}>
                    Department / Specialty
                  </td>
                  <td colSpan={2} style={tdStyle}>
                    <input style={tableInputStyle} placeholder="Nautical / Engineering / etc." value={fd.collegeDepartment} onChange={e => set('collegeDepartment', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.5)' }}>Till:</td>
                  <td style={tdStyle}>
                    <input style={tableInputStyle} type="number" placeholder="YYYY" value={fd.collegeTill} onChange={e => set('collegeTill', e.target.value)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

      case 3: return (
        <div>
          <SectionTitle>Passports and Primary Documents</SectionTitle>
          <div style={{ overflowX: 'auto', marginTop: '0.8rem' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: '30%' }}>Document</th>
                  <th style={thStyle}>Number</th>
                  <th style={{ ...thStyle, width: '15%' }}>Issued Date</th>
                  <th style={{ ...thStyle, width: '15%' }}>Valid Until</th>
                  <th style={{ ...thStyle, width: '25%' }}>Place Issued</th>
                </tr>
              </thead>
              <tbody>
                {PRIMARY_DOCS_LIST.map(doc => {
                  const isCoC1 = doc === "CERTIFICATE OF COMPETENCY # 1";
                  const isCoC2 = doc === "CERTIFICATE OF COMPETENCY # 2";
                  return (
                    <React.Fragment key={doc}>
                      <tr>
                        <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem' }}>{doc}</td>
                        <td style={tdStyle}>
                          <input style={tableInputStyle} value={primaryDocs[doc]?.number || ''} onChange={e => updatePrimaryDoc(doc, 'number', e.target.value)} />
                        </td>
                        <td style={tdStyle}>
                          <input style={tableInputStyle} placeholder="DD.MM.YY" value={primaryDocs[doc]?.issued || ''} onChange={e => updatePrimaryDoc(doc, 'issued', e.target.value)} />
                        </td>
                        <td style={tdStyle}>
                          <input style={tableInputStyle} placeholder="DD.MM.YY" value={primaryDocs[doc]?.expiry || ''} onChange={e => updatePrimaryDoc(doc, 'expiry', e.target.value)} />
                        </td>
                        <td style={tdStyle}>
                          <input style={tableInputStyle} value={primaryDocs[doc]?.place || ''} onChange={e => updatePrimaryDoc(doc, 'place', e.target.value)} />
                        </td>
                      </tr>
                      {(isCoC1 || isCoC2) && (
                        <tr>
                          <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', background: 'rgba(30,41,59,0.4)' }}>RANK / CAPACITY</td>
                          <td colSpan={4} style={tdStyle}>
                            <input
                              style={tableInputStyle}
                              value={primaryDocs[`RANK_CAPACITY_${isCoC1 ? 1 : 2}`]?.number || ''}
                              onChange={e => updatePrimaryDoc(`RANK_CAPACITY_${isCoC1 ? 1 : 2}`, 'number', e.target.value)}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );

      case 4: return (
        <div>
          <SectionTitle>Certificates of Competency & STCW</SectionTitle>
          <div style={{ overflowX: 'auto', maxHeight: '60vh', overflowY: 'auto', marginTop: '0.8rem' }}>
            <table style={tableStyle}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 5 }}>
                <tr>
                  <th style={{ ...thStyle, width: '35%' }}>Certificate Name</th>
                  <th style={thStyle}>Number</th>
                  <th style={{ ...thStyle, width: '15%' }}>Issued Date</th>
                  <th style={{ ...thStyle, width: '15%' }}>Valid Until</th>
                  <th style={{ ...thStyle, width: '25%' }}>Place Issued</th>
                </tr>
              </thead>
              <tbody>
                {STCW_CERTS_LIST.map(cert => (
                  <tr key={cert}>
                    <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem' }}>{cert}</td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={stcwDocs[cert]?.number || ''} onChange={e => updateStcwDoc(cert, 'number', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} placeholder="DD.MM.YY" value={stcwDocs[cert]?.issued || ''} onChange={e => updateStcwDoc(cert, 'issued', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} placeholder="DD.MM.YY" value={stcwDocs[cert]?.expiry || ''} onChange={e => updateStcwDoc(cert, 'expiry', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={stcwDocs[cert]?.place || ''} onChange={e => updateStcwDoc(cert, 'place', e.target.value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

      case 5: return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <SectionTitle>Previous Sea Service</SectionTitle>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => addRow('seaService', () => emptySeaService(fd.appliedRank))}>
              <Plus size={14} /> Add Row
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, minWidth: '68px' }}>FROM</th>
                  <th style={{ ...thStyle, minWidth: '68px' }}>TO</th>
                  <th style={{ ...thStyle, minWidth: '100px' }}>POSITION</th>
                  <th style={{ ...thStyle, minWidth: '70px' }}>SALARY</th>
                  <th style={{ ...thStyle, minWidth: '110px' }}>NAME OF VESSEL</th>
                  <th style={{ ...thStyle, minWidth: '120px' }}>SHIPOWNER</th>
                  <th style={{ ...thStyle, minWidth: '110px' }}>TYPE OF VESSEL</th>
                  <th style={{ ...thStyle, minWidth: '110px' }}>TYPE OF ENGINE</th>
                  <th style={{ ...thStyle, minWidth: '80px' }}>BUILD YEAR</th>
                  <th style={{ ...thStyle, minWidth: '60px' }}>DWT</th>
                  <th style={{ ...thStyle, minWidth: '60px' }}>BHP</th>
                  <th style={{ ...thStyle, minWidth: '70px' }}>FLAG</th>
                  <th style={{ ...thStyle, minWidth: '100px' }}>CREWING AGENT</th>
                  <th style={{ ...thStyle, width: '36px' }}></th>
                </tr>
              </thead>
              <tbody>
                {fd.seaService.map((s, i) => (
                  <tr key={s.id || i}>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} placeholder="MM.YY" value={s.dateFrom} onChange={e => setArr('seaService', i, 'dateFrom', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} placeholder="MM.YY" value={s.dateTo} onChange={e => setArr('seaService', i, 'dateTo', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <select style={tableInputStyle} value={s.rankHeld} onChange={e => setArr('seaService', i, 'rankHeld', e.target.value)}>
                        <option value="">-</option>
                        {MARITIME_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={s.salary} onChange={e => setArr('seaService', i, 'salary', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={s.vesselName} onChange={e => setArr('seaService', i, 'vesselName', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={s.shipowner} onChange={e => setArr('seaService', i, 'shipowner', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <select style={tableInputStyle} value={s.vesselType} onChange={e => setArr('seaService', i, 'vesselType', e.target.value)}>
                        <option value="">-</option>
                        {VESSEL_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={s.engineType} onChange={e => setArr('seaService', i, 'engineType', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={s.buildYear} onChange={e => setArr('seaService', i, 'buildYear', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={s.dwtGrt} onChange={e => setArr('seaService', i, 'dwtGrt', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={s.engineBhp} onChange={e => setArr('seaService', i, 'engineBhp', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={s.flag} onChange={e => setArr('seaService', i, 'flag', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={s.manningCompany} onChange={e => setArr('seaService', i, 'manningCompany', e.target.value)} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {fd.seaService.length > 1 && (
                        <button type="button" onClick={() => removeRow('seaService', i)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

      case 6: return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <SectionTitle>Brief Information About Previous Employers</SectionTitle>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => addRow('employers', emptyEmployer)}>
              <Plus size={14} /> Add Row
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: '35%' }}>Company</th>
                  <th style={{ ...thStyle, width: '30%' }}>Person in Charge</th>
                  <th style={thStyle}>Contact Details (Phone, E-mail)</th>
                  <th style={{ ...thStyle, width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {fd.employers.map((emp, i) => (
                  <tr key={emp.id || i}>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={emp.company} onChange={e => setArr('employers', i, 'company', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={emp.personInCharge} onChange={e => setArr('employers', i, 'personInCharge', e.target.value)} />
                    </td>
                    <td style={tdStyle}>
                      <input style={tableInputStyle} value={emp.contactDetails} onChange={e => setArr('employers', i, 'contactDetails', e.target.value)} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {fd.employers.length > 1 && (
                        <button type="button" onClick={() => removeRow('employers', i)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

      case 7: return (
        <div>
          <SectionTitle>Attach Documents & Scans</SectionTitle>
          <div style={{ overflowX: 'auto', marginTop: '0.8rem', marginBottom: '1.2rem' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, padding: '1.2rem', textAlign: 'center', background: 'rgba(30,41,59,0.3)' }}>
                    <Upload size={28} color="var(--color-accent)" style={{ marginBottom: '0.4rem' }} />
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.3rem' }}>
                      Upload Scans or CV Document
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                      Supported Formats: <strong>.doc, .docx, .pdf, .jpg, .png, .zip</strong> (up to 25 MB each)
                    </div>
                    <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                      Select Files
                      <input type="file" multiple accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.zip" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {fd.attachedFiles.length > 0 && (
            <div style={{ overflowX: 'auto', marginBottom: '1.2rem' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '60%' }}>File Name</th>
                    <th style={{ ...thStyle, width: '25%' }}>Size</th>
                    <th style={{ ...thStyle, width: '15%', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fd.attachedFiles.map((file, idx) => (
                    <tr key={file.id || idx}>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText size={15} color="var(--color-accent)" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{file.name}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{file.size}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <button type="button" onClick={() => set('attachedFiles', fd.attachedFiles.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <SectionTitle>Declaration & Consent</SectionTitle>
          <div style={{ overflowX: 'auto', marginTop: '0.8rem', marginBottom: '1.2rem' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, padding: '1rem', background: 'rgba(30,41,59,0.3)', lineHeight: 1.6, fontSize: '0.82rem' }}>
                    I hereby confirm that above information is true and correct to the best of my knowledge. I understand that this information will be held in the computer database due to my real or possible employment. Signing it, I willfully give my permission to collect and process my personal information and to use it in all and legal way. I give my permission for my personal information to be provided to the possible employers and any other persons, if such need arises for my employment. Besides, I permit the Company employees to request personal information (data) about me from my former employers.
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, padding: '0.8rem 1rem', background: 'rgba(30,41,59,0.6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <input type="checkbox" id="consent" required checked={fd.consent} onChange={e => set('consent', e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <label htmlFor="consent" style={{ fontSize: '0.88rem', color: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}>
                        I agree to the terms stated above. *
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '15%', background: 'rgba(30,41,59,0.5)' }}>Date:</td>
                  <td style={{ ...tdStyle, width: '35%' }}>
                    <input style={tableInputStyle} value={fd.signDate || new Date().toLocaleDateString('ru-RU')} onChange={e => set('signDate', e.target.value)} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem', width: '25%', background: 'rgba(30,41,59,0.5)' }}>Digital Signature:</td>
                  <td style={{ ...tdStyle, width: '25%' }}>
                    <input style={tableInputStyle} placeholder="Type Full Name" value={fd.signature} onChange={e => set('signature', e.target.value)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg-main)',
        color: 'var(--text-primary)',
        overflowY: 'auto',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(11, 19, 41, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0.85rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} /> На главную страницу
          </button>
          <div>
            <div className="badge badge-gold" style={{ fontSize: '0.7rem' }}>ОФИЦИАЛЬНАЯ АНКЕТА МОРЯКА (MLC 2006 / IMO STANDARD)</div>
            <h1 style={{ fontSize: '1.3rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>FleetForce Seafarer Application Form</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePreviewDocInline}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Eye size={15} /> 👁️ Просмотр DOCX
          </button>
          <button
            type="button"
            onClick={handlePreviewPdfInline}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: 'var(--color-emerald)', color: 'var(--color-emerald)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Eye size={15} /> 👁️ Просмотр PDF
          </button>
          <button
            type="button"
            onClick={handlePrintForm}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Printer size={15} /> 🖨️ Печать анкеты
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-emerald-light)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#FFFFFF' }}>Application Successfully Submitted!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1rem' }}>
              Your seafarer application form has been registered in the Fleet Force Alliance database. Our manager will review your qualifications and contact you shortly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handlePreviewDocInline} className="btn btn-secondary btn-lg">
                <Eye size={18} /> 👁️ Просмотр (.DOCX)
              </button>
              <button onClick={handlePreviewPdfInline} className="btn btn-secondary btn-lg">
                <Eye size={18} /> 👁️ Просмотр (.PDF)
              </button>
              <button onClick={handlePrintForm} className="btn btn-primary btn-lg">
                <Printer size={18} /> 🖨️ Печать анкеты
              </button>
              <button onClick={onClose} className="btn btn-primary btn-lg">Return to Website</button>
            </div>
          </div>
        ) : (
          <div>
            {/* Live DOCX & PDF Test Preview Bar */}
            <div style={{ background: 'var(--color-accent-light)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1.2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} color="var(--color-accent)" />
                <span><strong>Встроенный просмотр анкеты:</strong> Проверяйте заполненность DOCX и PDF непосредственно на экране:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button type="button" onClick={handlePreviewHtmlInline} className="btn btn-secondary btn-sm" style={{ fontWeight: 700, color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>
                  👁️ Бланк A4
                </button>
                <button type="button" onClick={handlePreviewDocInline} className="btn btn-secondary btn-sm" style={{ fontWeight: 700, borderColor: 'var(--color-accent)' }}>
                  👁️ Просмотр DOCX
                </button>
                <button type="button" onClick={handlePreviewPdfInline} className="btn btn-secondary btn-sm" style={{ fontWeight: 700, color: 'var(--color-emerald)', borderColor: 'var(--color-emerald)' }}>
                  👁️ Просмотр PDF
                </button>
                <button type="button" onClick={handlePrintForm} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  🖨️ Печать
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', overflowX: 'auto' }}>
              {STEP_LABELS.map((label, idx) => {
                const s = idx + 1;
                const active = step === s;
                const done = step > s;
                return (
                  <div key={s} onClick={() => setStep(s)}
                    style={{
                      flex: 1, minWidth: '110px', padding: '0.75rem 0.5rem', textAlign: 'center',
                      background: active ? 'var(--color-accent-light)' : done ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? 'var(--color-accent)' : done ? 'var(--color-emerald)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition-fast)'
                    }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: active ? 'var(--color-accent)' : done ? 'var(--color-emerald)' : 'var(--text-muted)', letterSpacing: '0.04em' }}>
                      {done ? '✓' : s}. {label}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit}>
              {renderStep()}

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                {step > 1
                  ? <button type="button" onClick={() => setStep(s => s - 1)} className="btn btn-secondary"><ChevronLeft size={18} /> Back</button>
                  : <div />}
                {step < TOTAL_STEPS
                  ? <button type="button" onClick={() => setStep(s => s + 1)} className="btn btn-primary">Next <ChevronRight size={18} /></button>
                  : <button 
                      type="submit" 
                      disabled={!fd.consent} 
                      className="btn btn-accent btn-lg"
                      style={{ 
                        opacity: fd.consent ? 1 : 0.4, 
                        cursor: fd.consent ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <CheckCircle2 size={20} /> Submit Application
                    </button>}
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Interactive On-Screen Document Preview Modal */}
      {inlinePreview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', width: '94%', maxWidth: '1050px', height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(11, 19, 41, 0.95)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Eye size={20} color="var(--color-accent)" />
                <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>{inlinePreview.title}</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                {inlinePreview.type === 'pdf' ? (
                  <button type="button" onClick={() => handleExportPdf(fd)} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Download size={15} /> Скачать PDF
                  </button>
                ) : (
                  <button type="button" onClick={() => handleExportDoc(fd)} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Download size={15} /> Скачать DOCX
                  </button>
                )}
                <button type="button" onClick={() => setInlinePreview(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 0, background: '#525659', color: '#000000' }}>
              {inlinePreview.type === 'pdf' ? (
                <iframe src={inlinePreview.src} title="PDF Preview" style={{ width: '100%', height: '100%', border: 'none' }} />
              ) : (
                <div ref={docxContainerRef} style={{ width: '100%', minHeight: '500px' }} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

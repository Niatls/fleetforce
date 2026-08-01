import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X, CheckCircle2, ChevronRight, ChevronLeft,
  Plus, Trash2, Upload, FileText, Printer
} from 'lucide-react';
import {
  MARITIME_RANKS, VESSEL_TYPES,
  getRankLabel, getVesselLabel, getEnglishLevelLabel, ENGLISH_LEVELS_TRANSLATIONS,
  MARITAL_STATUS, KIN_RELATIONS, OVERALL_SIZES_EUR, SHOE_SIZES,
  ENGINE_TYPES, FLAG_STATES, CERTIFICATE_TYPES
} from '../../data/initialData';

// ─── helpers ───────────────────────────────────────────────────────────────
const mkId = () => Date.now() + Math.random();

const emptySeaService = (rank = '') => ({
  id: mkId(), dateFrom: '', dateTo: '',
  rankHeld: rank, salary: '',
  vesselName: '', shipowner: '',
  vesselType: VESSEL_TYPES[0], engineType: ENGINE_TYPES[0],
  buildYear: '', dwtGrt: '', engineBhp: '',
  flag: FLAG_STATES[1], manningCompany: ''
});

const emptyRecordBook = () => ({
  id: mkId(), flag: FLAG_STATES[1], number: '',
  issuedDate: '', validUntil: '', place: ''
});

const emptyCertificate = () => ({
  id: mkId(),
  certName: CERTIFICATE_TYPES[0],
  certNo: '', certIssued: '', certValid: '',
  rankCapacity: MARITIME_RANKS[0],
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
  <input className="form-input" value={value} onChange={e => onChange(e.target.value)} {...rest} />
);

const Sel = ({ value, onChange, options, children, ...rest }) => (
  <select className="form-select" value={value} onChange={e => onChange(e.target.value)} {...rest}>
    {options
      ? options.map(o => <option key={o} value={o}>{o}</option>)
      : children}
  </select>
);

const SectionTitle = ({ children }) => (
  <div style={{
    gridColumn: '1 / -1',
    borderBottom: '1px solid var(--color-accent)',
    paddingBottom: '0.3rem',
    marginTop: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--color-accent)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  }}>
    {children}
  </div>
);

const STEP_LABELS = [
  'Personal Details',
  'Position',
  'Documents',
  'Certificates',
  'Sea Service',
  'Employers',
  'Files & Consent',
];

// ═══════════════════════════════════════════════════════════════════════════
export const ApplicationWizard = ({ isOpen, onClose, initialRank = '', initialVesselType = '', onSubmitSuccess }) => {
  const { lang } = useLanguage();
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 7;
  const [submitted, setSubmitted] = useState(false);

  const [fd, setFd] = useState({
    // Step 1 — Personal
    appliedRank: initialRank || MARITIME_RANKS[0],
    readyDate: new Date().toISOString().split('T')[0],
    fullName: '',
    motherName: '',
    nationality: 'Russia',
    maritalStatus: 'Single',
    childrenUnder18: '0',
    phone: '',
    skypeTelegram: '',
    kinName: '',
    kinRelation: KIN_RELATIONS[0],
    kinPhone: '',
    address: '',
    nearestAirport: '',
    overallSize: 'L / 50',
    shoeSize: '42',
    email: '',

    // Step 2 — Position
    alternativeRank: MARITIME_RANKS[1],
    minSalary: '',
    preferredVessels: initialVesselType || VESSEL_TYPES[0],
    englishLevel: 'Good / Upper-Intermediate',
    marlinsScore: '',
    contractDuration: '',

    // Step 3 — Documents
    passportNo: '', passportIssued: '', passportExpiry: '', passportPlace: '',
    seamanBookNo: '', seamanBookIssued: '', seamanBookExpiry: '', seamanBookPlace: '',
    recordBooks: [emptyRecordBook()],

    // Step 4 — Certificates
    certificates: [emptyCertificate()],

    // Step 5 — Sea Service
    seaService: [emptySeaService(initialRank || MARITIME_RANKS[0])],

    // Step 6 — Previous Employers
    employers: [emptyEmployer()],

    // Step 7 — Files & consent
    attachedFiles: [],
    consent: false,
  });

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

  // ── update helpers ───────────────────────────────────────────────────────
  const set = (field, value) => setFd(prev => ({ ...prev, [field]: value }));

  const setArr = (field, index, subfield, value) =>
    setFd(prev => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [subfield]: value };
      return { ...prev, [field]: arr };
    });

  const addRow = (field, empty) =>
    setFd(prev => ({ ...prev, [field]: [...prev[field], empty()] }));

  const removeRow = (field, index) =>
    setFd(prev => ({
      ...prev,
      [field]: prev[field].length > 1 ? prev[field].filter((_, i) => i !== index) : prev[field]
    }));

  // ── file upload ──────────────────────────────────────────────────────────
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

  // ── submit ───────────────────────────────────────────────────────────────
  const handleSubmit = e => {
    e.preventDefault();
    if (!fd.consent) { alert('Please confirm consent to data processing!'); return; }
    onSubmitSuccess({
      id: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: fd.fullName || 'Seafarer',
      surname: fd.fullName.split(' ')[0] || '',
      name: fd.fullName.split(' ').slice(1).join(' ') || '',
      dob: '',
      citizenship: fd.nationality,
      nationality: fd.nationality,
      phone: fd.phone,
      email: fd.email,
      appliedRank: fd.appliedRank,
      alternativeRank: fd.alternativeRank,
      minSalary: fd.minSalary,
      readyDate: fd.readyDate,
      preferredVessels: fd.preferredVessels,
      status: 'New',
      marlinsScore: fd.marlinsScore,
      englishLevel: fd.englishLevel,
      seaService: fd.seaService,
      attachedFiles: fd.attachedFiles,
      submittedAt: new Date().toISOString(),
      motherName: fd.motherName,
      maritalStatus: fd.maritalStatus,
      childrenUnder18: fd.childrenUnder18,
      skypeTelegram: fd.skypeTelegram,
      kinName: fd.kinName,
      kinRelation: fd.kinRelation,
      kinPhone: fd.kinPhone,
      kin: { name: fd.kinName, relation: fd.kinRelation, phone: fd.kinPhone },
      address: fd.address,
      homeAddress: fd.address,
      nearestAirport: fd.nearestAirport,
      overallSize: fd.overallSize,
      shoeSize: fd.shoeSize,
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
      employers: fd.employers,
    });
    setSubmitted(true);
  };

  // ── grid style ───────────────────────────────────────────────────────────
  const grid = (cols = 'repeat(auto-fit, minmax(240px, 1fr))') => ({
    display: 'grid', gridTemplateColumns: cols, gap: '1rem'
  });

  const cardStyle = {
    background: 'rgba(21,39,66,0.6)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '1.2rem',
    marginBottom: '1rem'
  };

  // ── step content ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      // ════════════════════════════════════════════════════════════════
      case 1: return (
        <div style={grid()}>
          <SectionTitle>Applied For & Readiness</SectionTitle>
          <FG label="Applied for (Rank) *">
            <Sel value={fd.appliedRank} onChange={v => set('appliedRank', v)}>
              {MARITIME_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
            </Sel>
          </FG>
          <FG label="Date of Readiness *">
            <Inp type="date" value={fd.readyDate} onChange={v => set('readyDate', v)} required />
          </FG>

          <SectionTitle>Personal Details</SectionTitle>
          <FG label="Full Name *" col="1 / -1">
            <Inp placeholder="Surname Name Patronymic"
              value={fd.fullName} onChange={v => set('fullName', v)} required />
          </FG>
          <FG label="Mother's Name">
            <Inp placeholder="Mother's Name" value={fd.motherName} onChange={v => set('motherName', v)} />
          </FG>
          <FG label="Nationality">
            <Inp placeholder="Country of nationality" value={fd.nationality} onChange={v => set('nationality', v)} />
          </FG>
          <FG label="Marital Status">
            <Sel value={fd.maritalStatus} onChange={v => set('maritalStatus', v)} options={MARITAL_STATUS} />
          </FG>
          <FG label="No. of Children under 18">
            <Inp type="number" min="0" max="20" value={fd.childrenUnder18} onChange={v => set('childrenUnder18', v)} />
          </FG>

          <SectionTitle>Contacts</SectionTitle>
          <FG label="Contact Phone *">
            <Inp type="tel" placeholder="+1 (555) 000-00-00" value={fd.phone} onChange={v => set('phone', v)} required />
          </FG>
          <FG label="Email *">
            <Inp type="email" placeholder="seaman@example.com" value={fd.email} onChange={v => set('email', v)} required />
          </FG>
          <FG label="Skype / Telegram">
            <Inp placeholder="@username or live:skype" value={fd.skypeTelegram} onChange={v => set('skypeTelegram', v)} />
          </FG>
          <FG label="Home Address" col="1 / -1">
            <Inp placeholder="Country, City, Street, Zip" value={fd.address} onChange={v => set('address', v)} />
          </FG>

          <SectionTitle>Next of Kin</SectionTitle>
          <FG label="Next of Kin Name">
            <Inp placeholder="Full Name of Next of Kin" value={fd.kinName} onChange={v => set('kinName', v)} />
          </FG>
          <FG label="Relation">
            <Sel value={fd.kinRelation} onChange={v => set('kinRelation', v)} options={KIN_RELATIONS} />
          </FG>
          <FG label="Next of Kin Phone">
            <Inp type="tel" placeholder="+1 (555) 000-00-00" value={fd.kinPhone} onChange={v => set('kinPhone', v)} />
          </FG>

          <SectionTitle>Equipment & Travel</SectionTitle>
          <FG label="Nearest Airport">
            <Inp placeholder="e.g. London LHR / Istanbul IST" value={fd.nearestAirport} onChange={v => set('nearestAirport', v)} />
          </FG>
          <FG label="Size of Overall (EUR)">
            <Sel value={fd.overallSize} onChange={v => set('overallSize', v)} options={OVERALL_SIZES_EUR} />
          </FG>
          <FG label="Shoe Size (EUR)">
            <Sel value={fd.shoeSize} onChange={v => set('shoeSize', v)} options={SHOE_SIZES} />
          </FG>
        </div>
      );

      // ════════════════════════════════════════════════════════════════
      case 2: return (
        <div style={grid()}>
          <SectionTitle>Position & Terms</SectionTitle>
          <FG label="Applied Rank *">
            <Sel value={fd.appliedRank} onChange={v => set('appliedRank', v)}>
              {MARITIME_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
            </Sel>
          </FG>
          <FG label="Alternative Rank">
            <Sel value={fd.alternativeRank} onChange={v => set('alternativeRank', v)}>
              {MARITIME_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
            </Sel>
          </FG>
          <FG label="Min Desired Salary (USD/month)">
            <Inp type="number" placeholder="e.g. 8000" value={fd.minSalary} onChange={v => set('minSalary', v)} />
          </FG>
          <FG label="Preferred Contract Duration">
            <Inp placeholder="e.g. 4 months / 6 months" value={fd.contractDuration} onChange={v => set('contractDuration', v)} />
          </FG>
          <FG label="Preferred Vessel Type">
            <Sel value={fd.preferredVessels} onChange={v => set('preferredVessels', v)}>
              {VESSEL_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
            </Sel>
          </FG>

          <SectionTitle>English Proficiency</SectionTitle>
          <FG label="English Level">
            <Sel value={fd.englishLevel} onChange={v => set('englishLevel', v)}>
              {Object.keys(ENGLISH_LEVELS_TRANSLATIONS).map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Sel>
          </FG>
          <FG label="Marlins / CES Score (%)">
            <Inp type="text" placeholder="e.g. 88%" value={fd.marlinsScore} onChange={v => set('marlinsScore', v)} />
          </FG>
        </div>
      );

      // ════════════════════════════════════════════════════════════════
      case 3: return (
        <div style={grid()}>
          <SectionTitle>National Travel Passport</SectionTitle>
          <FG label="Passport No"><Inp placeholder="Passport No" value={fd.passportNo} onChange={v => set('passportNo', v)} /></FG>
          <FG label="Issued Date"><Inp type="date" value={fd.passportIssued} onChange={v => set('passportIssued', v)} /></FG>
          <FG label="Valid Until"><Inp type="date" value={fd.passportExpiry} onChange={v => set('passportExpiry', v)} /></FG>
          <FG label="Place of Issue"><Inp placeholder="City / Authority" value={fd.passportPlace} onChange={v => set('passportPlace', v)} /></FG>

          <SectionTitle>Seaman's Book (SID)</SectionTitle>
          <FG label="Seaman's Book No"><Inp placeholder="Book No / ID" value={fd.seamanBookNo} onChange={v => set('seamanBookNo', v)} /></FG>
          <FG label="Issued Date"><Inp type="date" value={fd.seamanBookIssued} onChange={v => set('seamanBookIssued', v)} /></FG>
          <FG label="Valid Until"><Inp type="date" value={fd.seamanBookExpiry} onChange={v => set('seamanBookExpiry', v)} /></FG>
          <FG label="Place of Issue"><Inp placeholder="City / Authority" value={fd.seamanBookPlace} onChange={v => set('seamanBookPlace', v)} /></FG>

          <SectionTitle>Foreign Seaman's ID / Record Books</SectionTitle>
          <div style={{ gridColumn: '1 / -1' }}>
            {fd.recordBooks.map((rb, i) => (
              <div key={rb.id} style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.7rem', alignItems: 'end' }}>
                <FG label="Flag">
                  <Sel value={rb.flag} onChange={v => setArr('recordBooks', i, 'flag', v)} options={FLAG_STATES} />
                </FG>
                <FG label="Number"><Inp value={rb.number} onChange={v => setArr('recordBooks', i, 'number', v)} placeholder="ID / No" /></FG>
                <FG label="Issued Date"><Inp type="date" value={rb.issuedDate} onChange={v => setArr('recordBooks', i, 'issuedDate', v)} /></FG>
                <FG label="Valid Until"><Inp type="date" value={rb.validUntil} onChange={v => setArr('recordBooks', i, 'validUntil', v)} /></FG>
                <FG label="Place"><Inp value={rb.place} onChange={v => setArr('recordBooks', i, 'place', v)} placeholder="City" /></FG>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                  {fd.recordBooks.length > 1 && (
                    <button type="button" onClick={() => removeRow('recordBooks', i)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => addRow('recordBooks', emptyRecordBook)}>
              <Plus size={14} /> Add Record Book
            </button>
          </div>
        </div>
      );

      // ════════════════════════════════════════════════════════════════
      case 4: return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.95rem' }}>
              CERTIFICATE OF COMPETENCY & TRAINING
            </h4>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => addRow('certificates', emptyCertificate)}>
              <Plus size={14} /> Add Certificate
            </button>
          </div>
          {fd.certificates.map((cert, i) => (
            <div key={cert.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>Certificate #{i + 1}</strong>
                {fd.certificates.length > 1 && (
                  <button type="button" onClick={() => removeRow('certificates', i)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div style={grid('repeat(auto-fit, minmax(200px, 1fr))')}>
                <FG label="Certificate of Competency" col="1 / -1">
                  <Sel value={cert.certName} onChange={v => setArr('certificates', i, 'certName', v)} options={CERTIFICATE_TYPES} />
                </FG>
                <FG label="No"><Inp value={cert.certNo} onChange={v => setArr('certificates', i, 'certNo', v)} placeholder="Certificate No" /></FG>
                <FG label="Issued Date"><Inp type="date" value={cert.certIssued} onChange={v => setArr('certificates', i, 'certIssued', v)} /></FG>
                <FG label="Valid Until"><Inp type="date" value={cert.certValid} onChange={v => setArr('certificates', i, 'certValid', v)} /></FG>
                <FG label="Rank / Capacity">
                  <Sel value={cert.rankCapacity} onChange={v => setArr('certificates', i, 'rankCapacity', v)}>
                    {MARITIME_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Sel>
                </FG>

                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color)', paddingTop: '0.7rem', marginTop: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>ENDORSEMENT</span>
                </div>
                <FG label="Endorsement No"><Inp value={cert.endorseNo} onChange={v => setArr('certificates', i, 'endorseNo', v)} placeholder="No" /></FG>
                <FG label="Issued Date"><Inp type="date" value={cert.endorseIssued} onChange={v => setArr('certificates', i, 'endorseIssued', v)} /></FG>
                <FG label="Valid Until"><Inp type="date" value={cert.endorseValid} onChange={v => setArr('certificates', i, 'endorseValid', v)} /></FG>
              </div>
            </div>
          ))}
        </div>
      );

      // ════════════════════════════════════════════════════════════════
      case 5: return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.95rem' }}>PREVIOUS SEA SERVICE MATRIX</h4>
            <button type="button" className="btn btn-secondary btn-sm"
              onClick={() => addRow('seaService', () => emptySeaService(fd.appliedRank))}>
              <Plus size={14} /> Add Vessel
            </button>
          </div>
          {fd.seaService.map((s, i) => (
            <div key={s.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>Vessel #{i + 1}</strong>
                {fd.seaService.length > 1 && (
                  <button type="button" onClick={() => removeRow('seaService', i)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div style={grid('repeat(auto-fit, minmax(190px, 1fr))')}>
                <FG label="From (Sign On)"><Inp type="date" value={s.dateFrom} onChange={v => setArr('seaService', i, 'dateFrom', v)} /></FG>
                <FG label="To (Sign Off)"><Inp type="date" value={s.dateTo} onChange={v => setArr('seaService', i, 'dateTo', v)} /></FG>
                <FG label="Position Held">
                  <Sel value={s.rankHeld} onChange={v => setArr('seaService', i, 'rankHeld', v)}>
                    {MARITIME_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Sel>
                </FG>
                <FG label="Salary (USD/month)"><Inp type="number" placeholder="e.g. 7000" value={s.salary} onChange={v => setArr('seaService', i, 'salary', v)} /></FG>
                <FG label="Name of Vessel"><Inp placeholder="Vessel Name" value={s.vesselName} onChange={v => setArr('seaService', i, 'vesselName', v)} /></FG>
                <FG label="Shipowner"><Inp placeholder="Shipowner Name" value={s.shipowner} onChange={v => setArr('seaService', i, 'shipowner', v)} /></FG>
                <FG label="Type of Vessel">
                  <Sel value={s.vesselType} onChange={v => setArr('seaService', i, 'vesselType', v)}>
                    {VESSEL_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                  </Sel>
                </FG>
                <FG label="Type of Engine">
                  <Sel value={s.engineType} onChange={v => setArr('seaService', i, 'engineType', v)} options={ENGINE_TYPES} />
                </FG>
                <FG label="Build Year"><Inp type="number" placeholder="e.g. 2018" min="1950" max="2030" value={s.buildYear} onChange={v => setArr('seaService', i, 'buildYear', v)} /></FG>
                <FG label="DWT / GRT"><Inp placeholder="e.g. 47,000 DWT" value={s.dwtGrt} onChange={v => setArr('seaService', i, 'dwtGrt', v)} /></FG>
                <FG label="BHP / KW"><Inp placeholder="e.g. 9,800 KW" value={s.engineBhp} onChange={v => setArr('seaService', i, 'engineBhp', v)} /></FG>
                <FG label="Flag">
                  <Sel value={s.flag} onChange={v => setArr('seaService', i, 'flag', v)} options={FLAG_STATES} />
                </FG>
                <FG label="Crewing Agent"><Inp placeholder="Manning Company Name" value={s.manningCompany} onChange={v => setArr('seaService', i, 'manningCompany', v)} /></FG>
              </div>
            </div>
          ))}
        </div>
      );

      // ════════════════════════════════════════════════════════════════
      case 6: return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.95rem' }}>BRIEF INFORMATION ABOUT PREVIOUS EMPLOYERS</h4>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => addRow('employers', emptyEmployer)}>
              <Plus size={14} /> Add Employer
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,139,255,0.12)' }}>
                  {['Company', 'Person in Charge', 'Contact Details (Phone / E-mail)', ''].map(h => (
                    <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', color: 'var(--color-accent)', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fd.employers.map((emp, i) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.4rem 0.5rem' }}>
                      <Inp value={emp.company} onChange={v => setArr('employers', i, 'company', v)} placeholder="Company / Shipowner Name" />
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>
                      <Inp value={emp.personInCharge} onChange={v => setArr('employers', i, 'personInCharge', v)} placeholder="Person in Charge Name" />
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>
                      <Inp value={emp.contactDetails} onChange={v => setArr('employers', i, 'contactDetails', v)} placeholder="+1 555 000 / email@example.com" />
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem', width: '36px' }}>
                      {fd.employers.length > 1 && (
                        <button type="button" onClick={() => removeRow('employers', i)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
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

      // ════════════════════════════════════════════════════════════════
      case 7: return (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Upload zone */}
          <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed var(--color-accent)', borderRadius: 'var(--radius-md)', background: 'rgba(0,139,255,0.03)' }}>
            <Upload size={38} color="var(--color-accent)" style={{ marginBottom: '0.8rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#FFF' }}>Attach Scans & Certificates</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Supported Formats: <strong>.doc, .docx, .pdf, .jpg, .png, .zip</strong> (up to 25 MB each)
            </p>
            <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', gap: '0.5rem' }}>
              <Plus size={17} /> Choose Files
              <input type="file" multiple accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.zip" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {fd.attachedFiles.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h5 style={{ color: 'var(--color-emerald)', marginBottom: '0.7rem', fontSize: '0.9rem' }}>
                ✓ Attached: {fd.attachedFiles.length} file(s)
              </h5>
              {fd.attachedFiles.map(file => (
                <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.8rem', background: 'var(--bg-surface)', borderRadius: '6px', marginBottom: '0.4rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="var(--color-accent)" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFF' }}>{file.name}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{file.size}</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setFd(prev => ({ ...prev, attachedFiles: prev.attachedFiles.filter(f => f.id !== file.id) }))}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Consent */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem', lineHeight: 1.6 }}>
              I hereby confirm that above information is true and correct to the best of my knowledge. I understand that this information will be held in the computer database due to my real or possible employment. Signing it, I willfully give my permission to collect and process my personal information and to use it in all and legal way. I give my permission for my personal information to be provided to the possible employers and any other persons, if such need arises for my employment. Besides, I permit the Company employees to request personal information (data) about me from my former employers.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <input type="checkbox" id="consent" required checked={fd.consent} onChange={e => set('consent', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="consent" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                I confirm and accept the personal data processing terms *
              </label>
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="modal-overlay" style={{ overflowY: 'auto' }}>
      <div className="modal-content" style={{ maxWidth: '1020px', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>IMO & BGI STANDARD APPLICATION</div>
            <h2 style={{ fontSize: '1.7rem', color: '#FFFFFF' }}>Seafarer Application Form</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={26} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-emerald-light)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={42} />
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#FFFFFF' }}>Application Successfully Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Your seafarer application form has been registered in the crewing alliance database. Our manager will contact you shortly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => window.print()} className="btn btn-secondary">
                <Printer size={18} /> Print Application
              </button>
              <button onClick={onClose} className="btn btn-primary">Return to Website</button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step indicators */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', overflowX: 'auto' }}>
              {STEP_LABELS.map((label, idx) => {
                const s = idx + 1;
                const active = step === s;
                const done = step > s;
                return (
                  <div key={s} onClick={() => setStep(s)}
                    style={{
                      flex: 1, minWidth: '90px', padding: '0.6rem 0.4rem', textAlign: 'center',
                      background: active ? 'var(--color-accent-light)' : done ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? 'var(--color-accent)' : done ? 'var(--color-emerald)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition-fast)'
                    }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: active ? 'var(--color-accent)' : done ? 'var(--color-emerald)' : 'var(--text-muted)', letterSpacing: '0.04em' }}>
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
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X, CheckCircle2, ChevronRight, ChevronLeft,
  Plus, Trash2, Upload, FileText, Printer, ArrowLeft, Anchor
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
    {options ? (
      <>
        {placeholder !== false && <option value="">{placeholder}</option>}
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

const STEP_LABELS = [
  'Personal Details',
  'Position & Education',
  'Passports & Documents',
  'CoC & STCW Certs',
  'Sea Service Matrix',
  'Previous Employers',
  'Scans & Submit',
];

// ═══════════════════════════════════════════════════════════════════════════
export const ApplicationWizard = ({ isOpen, onClose, initialRank = '', initialVesselType = '', onSubmitSuccess }) => {
  const { lang } = useLanguage();
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 7;
  const [submitted, setSubmitted] = useState(false);

  const [fd, setFd] = useState({
    appliedRank: initialRank || MARITIME_RANKS[0],
    readyDate: new Date().toISOString().split('T')[0],
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    placeOfBirth: '',
    nationality: 'Russia',
    maritalStatus: 'Single',
    childrenUnder18: '0',
    phone: '',
    email: '',
    skypeTelegram: '',
    address: '',
    kinName: '',
    kinRelation: KIN_RELATIONS[0],
    kinPhone: '',
    kinAddress: '',
    height: '',
    weight: '',
    overallSize: 'L / 50 EUR',
    shoeSize: '42 EUR',
    eyesColour: 'Brown',
    hairColour: 'Dark',

    alternativeRank: MARITIME_RANKS[1],
    minSalary: '',
    preferredVessels: initialVesselType || VESSEL_TYPES[0],
    contractDuration: '4 months',
    englishLevel: 'Good / Upper-Intermediate',
    marlinsScore: '',
    nearestAirport: '',
    collegeName: '',
    collegeFrom: '',
    collegeTill: '',
    collegeDepartment: 'Nautical / Navigation',

    passportNo: '', passportIssued: '', passportExpiry: '', passportPlace: '',
    seamanBookNo: '', seamanBookIssued: '', seamanBookExpiry: '', seamanBookPlace: '',
    recordBooks: [emptyRecordBook()],

    cocName: 'Master Unlimited (STCW II/2)',
    cocNo: '', cocIssued: '', cocExpiry: '', cocCapacity: 'Master',
    certificates: [
      { id: mkId(), certName: 'Basic Safety Training (BST / STCW VI/1)', certNo: '', certIssued: '', certValid: '', rankCapacity: 'STCW VI/1' },
      { id: mkId(), certName: 'Proficiency in Survival Craft (PSCRB / STCW VI/2)', certNo: '', certIssued: '', certValid: '', rankCapacity: 'STCW VI/2' },
      { id: mkId(), certName: 'Advanced Fire Fighting (AFF / STCW VI/3)', certNo: '', certIssued: '', certValid: '', rankCapacity: 'STCW VI/3' },
      { id: mkId(), certName: 'Medical First Aid & Medical Care (STCW VI/4)', certNo: '', certIssued: '', certValid: '', rankCapacity: 'STCW VI/4' },
      { id: mkId(), certName: 'GMDSS General Operator Certificate (GOC)', certNo: '', certIssued: '', certValid: '', rankCapacity: 'GOC' },
      { id: mkId(), certName: 'ECDIS Generic & Type Specific Training', certNo: '', certIssued: '', certValid: '', rankCapacity: 'ECDIS' }
    ],

    seaService: [emptySeaService(initialRank || MARITIME_RANKS[0])],
    employers: [emptyEmployer()],
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
        <div style={grid()}>
          <SectionTitle>Applied Position & Readiness</SectionTitle>
          <FG label="Applied for (Rank) *">
            <Sel value={fd.appliedRank} onChange={v => set('appliedRank', v)}>
              {MARITIME_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
            </Sel>
          </FG>
          <FG label="Date of Readiness *">
            <Inp placeholder="DD.MM.YYYY (e.g. 15.08.2026)" value={fd.readyDate} onChange={v => set('readyDate', v)} required />
          </FG>

          <SectionTitle>Personal Details</SectionTitle>
          <FG label="Full Name (Surname, Name) *" col="1 / -1">
            <Inp placeholder="Surname Name Patronymic"
              value={fd.fullName} onChange={v => set('fullName', v)} required />
          </FG>
          <FG label="Father's Name">
            <Inp placeholder="Father's Name" value={fd.fatherName} onChange={v => set('fatherName', v)} />
          </FG>
          <FG label="Mother's Name">
            <Inp placeholder="Mother's Name" value={fd.motherName} onChange={v => set('motherName', v)} />
          </FG>
          <FG label="Date of Birth *">
            <Inp placeholder="DD.MM.YYYY (e.g. 15.08.1985)" value={fd.dob} onChange={v => set('dob', v)} required />
          </FG>
          <FG label="Place of Birth">
            <Inp placeholder="City, Country of Birth" value={fd.placeOfBirth} onChange={v => set('placeOfBirth', v)} />
          </FG>
          <FG label="Nationality / Citizenship">
            <Inp placeholder="Country of citizenship" value={fd.nationality} onChange={v => set('nationality', v)} />
          </FG>
          <FG label="Marital Status">
            <Sel value={fd.maritalStatus} onChange={v => set('maritalStatus', v)} options={MARITAL_STATUS} />
          </FG>
          <FG label="No. of Children under 18">
            <Inp type="number" min="0" max="20" value={fd.childrenUnder18} onChange={v => set('childrenUnder18', v)} />
          </FG>

          <SectionTitle>Contact Details & Residence</SectionTitle>
          <FG label="Contact Phone *">
            <Inp type="tel" placeholder="+7 (900) 000-00-00" value={fd.phone} onChange={v => set('phone', v)} required />
          </FG>
          <FG label="Email *">
            <Inp type="email" placeholder="seaman@example.com" value={fd.email} onChange={v => set('email', v)} required />
          </FG>
          <FG label="Skype / Telegram">
            <Inp placeholder="@username or Telegram/Skype" value={fd.skypeTelegram} onChange={v => set('skypeTelegram', v)} />
          </FG>
          <FG label="Home Address" col="1 / -1">
            <Inp placeholder="Full Country, City, Street, Zip Code" value={fd.address} onChange={v => set('address', v)} />
          </FG>

          <SectionTitle>Next of Kin (Emergency Contact)</SectionTitle>
          <FG label="Next of Kin Full Name">
            <Inp placeholder="Full Name of Spouse / Parent" value={fd.kinName} onChange={v => set('kinName', v)} />
          </FG>
          <FG label="Relation">
            <Sel value={fd.kinRelation} onChange={v => set('kinRelation', v)} options={KIN_RELATIONS} />
          </FG>
          <FG label="Next of Kin Phone">
            <Inp type="tel" placeholder="+7 (900) 000-00-00" value={fd.kinPhone} onChange={v => set('kinPhone', v)} />
          </FG>
          <FG label="Next of Kin Address">
            <Inp placeholder="Address if different" value={fd.kinAddress} onChange={v => set('kinAddress', v)} />
          </FG>

          <SectionTitle>Physical & Uniform Sizes</SectionTitle>
          <FG label="Height (cm)">
            <Inp type="number" placeholder="e.g. 182" value={fd.height} onChange={v => set('height', v)} />
          </FG>
          <FG label="Weight (kg)">
            <Inp type="number" placeholder="e.g. 80" value={fd.weight} onChange={v => set('weight', v)} />
          </FG>
          <FG label="Overall Coverall Size (EUR)">
            <Sel value={fd.overallSize} onChange={v => set('overallSize', v)} options={OVERALL_SIZES_EUR} />
          </FG>
          <FG label="Safety Shoes Size (EUR)">
            <Sel value={fd.shoeSize} onChange={v => set('shoeSize', v)} options={SHOE_SIZES} />
          </FG>
          <FG label="Color of Eyes">
            <Inp placeholder="e.g. Brown / Blue" value={fd.eyesColour} onChange={v => set('eyesColour', v)} />
          </FG>
          <FG label="Color of Hair">
            <Inp placeholder="e.g. Dark / Fair" value={fd.hairColour} onChange={v => set('hairColour', v)} />
          </FG>
        </div>
      );

      case 2: return (
        <div style={grid()}>
          <SectionTitle>Position Preferences & Salary</SectionTitle>
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
            <Inp type="number" placeholder="e.g. 8500" value={fd.minSalary} onChange={v => set('minSalary', v)} />
          </FG>
          <FG label="Preferred Contract Duration">
            <Inp placeholder="e.g. 4 months / 6 months" value={fd.contractDuration} onChange={v => set('contractDuration', v)} />
          </FG>
          <FG label="Preferred Vessel Type">
            <Sel value={fd.preferredVessels} onChange={v => set('preferredVessels', v)}>
              {VESSEL_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
            </Sel>
          </FG>

          <SectionTitle>Language & Travel</SectionTitle>
          <FG label="English Language Level">
            <Sel value={fd.englishLevel} onChange={v => set('englishLevel', v)}>
              {Object.keys(ENGLISH_LEVELS_TRANSLATIONS).map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </Sel>
          </FG>
          <FG label="Marlins Test Score (%)">
            <Inp type="number" min="0" max="100" placeholder="e.g. 88%" value={fd.marlinsScore} onChange={v => set('marlinsScore', v)} />
          </FG>
          <FG label="Nearest International Airport">
            <Inp placeholder="e.g. Saint-Petersburg LED / Moscow SVO" value={fd.nearestAirport} onChange={v => set('nearestAirport', v)} />
          </FG>

          <SectionTitle>Maritime Education & Qualifications</SectionTitle>
          <FG label="Name of Maritime College or Academy" col="1 / -1">
            <Inp placeholder="e.g. Admiral Makarov State University of Maritime and Inland Shipping"
              value={fd.collegeName} onChange={v => set('collegeName', v)} />
          </FG>
          <FG label="Year From">
            <Inp type="number" placeholder="e.g. 2012" value={fd.collegeFrom} onChange={v => set('collegeFrom', v)} />
          </FG>
          <FG label="Year Till">
            <Inp type="number" placeholder="e.g. 2017" value={fd.collegeTill} onChange={v => set('collegeTill', v)} />
          </FG>
          <FG label="Department / Degree">
            <Inp placeholder="e.g. Nautical / Navigation or Marine Engineering"
              value={fd.collegeDepartment} onChange={v => set('collegeDepartment', v)} />
          </FG>
        </div>
      );

      case 3: return (
        <div>
          <SectionTitle>Travel Passport</SectionTitle>
          <div style={grid()}>
            <FG label="Passport Number"><Inp placeholder="e.g. 75 1234567" value={fd.passportNo} onChange={v => set('passportNo', v)} /></FG>
            <FG label="Issued Date"><Inp placeholder="DD.MM.YYYY" value={fd.passportIssued} onChange={v => set('passportIssued', v)} /></FG>
            <FG label="Valid Until"><Inp placeholder="DD.MM.YYYY" value={fd.passportExpiry} onChange={v => set('passportExpiry', v)} /></FG>
            <FG label="Place of Issue"><Inp placeholder="e.g. FMS 78001" value={fd.passportPlace} onChange={v => set('passportPlace', v)} /></FG>
          </div>

          <SectionTitle>Seaman's Book / SID</SectionTitle>
          <div style={grid()}>
            <FG label="Seaman's Book Number"><Inp placeholder="e.g. AB 123456" value={fd.seamanBookNo} onChange={v => set('seamanBookNo', v)} /></FG>
            <FG label="Issued Date"><Inp placeholder="DD.MM.YYYY" value={fd.seamanBookIssued} onChange={v => set('seamanBookIssued', v)} /></FG>
            <FG label="Valid Until"><Inp placeholder="DD.MM.YYYY" value={fd.seamanBookExpiry} onChange={v => set('seamanBookExpiry', v)} /></FG>
            <FG label="Place of Issue"><Inp placeholder="e.g. Port of Saint Petersburg" value={fd.seamanBookPlace} onChange={v => set('seamanBookPlace', v)} /></FG>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '0.8rem' }}>
            <SectionTitle>Additional Flag State Record Books & SIDs</SectionTitle>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => addRow('recordBooks', emptyRecordBook)}>
              <Plus size={14} /> Add Record Book
            </button>
          </div>

          {fd.recordBooks.map((b, i) => (
            <div key={b.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>Flag State Book #{i + 1}</strong>
                {fd.recordBooks.length > 1 && (
                  <button type="button" onClick={() => removeRow('recordBooks', i)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div style={grid()}>
                <FG label="Flag State"><Sel value={b.flag} onChange={v => setArr('recordBooks', i, 'flag', v)} options={FLAG_STATES} /></FG>
                <FG label="Book Number"><Inp value={b.number} onChange={v => setArr('recordBooks', i, 'number', v)} /></FG>
                <FG label="Issued Date"><Inp placeholder="DD.MM.YYYY" value={b.issuedDate} onChange={v => setArr('recordBooks', i, 'issuedDate', v)} /></FG>
                <FG label="Valid Until"><Inp placeholder="DD.MM.YYYY" value={b.validUntil} onChange={v => setArr('recordBooks', i, 'validUntil', v)} /></FG>
                <FG label="Place of Issue"><Inp value={b.place} onChange={v => setArr('recordBooks', i, 'place', v)} /></FG>
              </div>
            </div>
          ))}
        </div>
      );

      case 4: return (
        <div>
          <SectionTitle>Certificate of Competency (CoC #1)</SectionTitle>
          <div style={cardStyle}>
            <div style={grid()}>
              <FG label="CoC Name / Grade" col="1 / -1">
                <Inp placeholder="e.g. Master Unlimited (STCW II/2) or Chief Engineer (STCW III/2)"
                  value={fd.cocName} onChange={v => set('cocName', v)} />
              </FG>
              <FG label="CoC Number"><Inp placeholder="e.g. COC-987654" value={fd.cocNo} onChange={v => set('cocNo', v)} /></FG>
              <FG label="Issued Date"><Inp placeholder="DD.MM.YYYY" value={fd.cocIssued} onChange={v => set('cocIssued', v)} /></FG>
              <FG label="Valid Until"><Inp placeholder="DD.MM.YYYY" value={fd.cocExpiry} onChange={v => set('cocExpiry', v)} /></FG>
              <FG label="Capacity / Rank"><Inp placeholder="e.g. Master / Chief Mate" value={fd.cocCapacity} onChange={v => set('cocCapacity', v)} /></FG>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '0.8rem' }}>
            <SectionTitle>STCW Certificates & Endorsements</SectionTitle>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => addRow('certificates', emptyCertificate)}>
              <Plus size={14} /> Add Certificate
            </button>
          </div>

          {fd.certificates.map((c, i) => (
            <div key={c.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>Certificate #{i + 1}</strong>
                {fd.certificates.length > 1 && (
                  <button type="button" onClick={() => removeRow('certificates', i)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div style={grid()}>
                <FG label="Certificate Name / Regulation" col="1 / -1">
                  <Inp placeholder="e.g. Basic Safety Training (STCW VI/1)" value={c.certName} onChange={v => setArr('certificates', i, 'certName', v)} />
                </FG>
                <FG label="Certificate No"><Inp value={c.certNo} onChange={v => setArr('certificates', i, 'certNo', v)} /></FG>
                <FG label="Issued Date"><Inp placeholder="DD.MM.YYYY" value={c.certIssued} onChange={v => setArr('certificates', i, 'certIssued', v)} /></FG>
                <FG label="Valid Until"><Inp placeholder="DD.MM.YYYY" value={c.certValid} onChange={v => setArr('certificates', i, 'certValid', v)} /></FG>
                <FG label="Capacity / Limitation"><Inp value={c.rankCapacity} onChange={v => setArr('certificates', i, 'rankCapacity', v)} /></FG>
              </div>
            </div>
          ))}
        </div>
      );

      case 5: return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.95rem', fontWeight: 700 }}>PREVIOUS SEA SERVICE MATRIX</h4>
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
                <FG label="From (Sign On)"><Inp placeholder="DD.MM.YYYY" value={s.dateFrom} onChange={v => setArr('seaService', i, 'dateFrom', v)} /></FG>
                <FG label="To (Sign Off)"><Inp placeholder="DD.MM.YYYY" value={s.dateTo} onChange={v => setArr('seaService', i, 'dateTo', v)} /></FG>
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

      case 6: return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '0.95rem', fontWeight: 700 }}>BRIEF INFORMATION ABOUT PREVIOUS EMPLOYERS</h4>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => addRow('employers', emptyEmployer)}>
              <Plus size={14} /> Add Employer
            </button>
          </div>
          {fd.employers.map((emp, i) => (
            <div key={emp.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>Employer #{i + 1}</strong>
                {fd.employers.length > 1 && (
                  <button type="button" onClick={() => removeRow('employers', i)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div style={grid()}>
                <FG label="Company Name"><Inp placeholder="e.g. Stena Bulk" value={emp.company} onChange={v => setArr('employers', i, 'company', v)} /></FG>
                <FG label="Person in Charge"><Inp placeholder="Superintendent / Manager Name" value={emp.personInCharge} onChange={v => setArr('employers', i, 'personInCharge', v)} /></FG>
                <FG label="Contact Details"><Inp placeholder="Phone or Email" value={emp.contactDetails} onChange={v => setArr('employers', i, 'contactDetails', v)} /></FG>
              </div>
            </div>
          ))}
        </div>
      );

      case 7: return (
        <div>
          <SectionTitle>Attach Documents & CV</SectionTitle>
          <div style={{ ...cardStyle, borderStyle: 'dashed', textAlign: 'center', padding: '2rem' }}>
            <Upload size={36} color="var(--color-accent)" style={{ marginBottom: '0.8rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#FFFFFF' }}>Upload Scans or CV Document</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
              Supported Formats: <strong>.doc, .docx, .pdf, .jpg, .png, .zip</strong> (up to 25 MB each)
            </p>
            <label className="btn btn-primary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
              Select Files
              <input type="file" multiple accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.zip" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {fd.attachedFiles.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '0.6rem' }}>
                Attached Files ({fd.attachedFiles.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {fd.attachedFiles.map((file, idx) => (
                  <div key={file.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '0.6rem 1rem', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <FileText size={18} color="var(--color-accent)" />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{file.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({file.size})</span>
                    </div>
                    <button type="button" onClick={() => set('attachedFiles', fd.attachedFiles.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SectionTitle>Data Processing Consent (MLC 2006)</SectionTitle>
          <div style={cardStyle}>
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

        <button
          type="button"
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
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
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => window.print()} className="btn btn-secondary btn-lg">
                <Printer size={18} /> Print Application
              </button>
              <button onClick={onClose} className="btn btn-primary btn-lg">Return to Website</button>
            </div>
          </div>
        ) : (
          <div>
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
    </div>
  );
};

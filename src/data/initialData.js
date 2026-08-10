export const MARITIME_RANKS = [
  "Master / Captain",
  "Chief Officer / 1st Mate",
  "2nd Officer",
  "3rd Officer",
  "Chief Engineer",
  "2nd Engineer",
  "3rd Engineer",
  "4th Engineer",
  "Electro-Technical Officer (ETO)",
  "Bosun",
  "Able Seaman (AB)",
  "Ordinary Seaman (OS)",
  "Oiler / Motorman",
  "Fitter / Welder",
  "Chief Cook",
  "Messman"
];

export const VESSEL_TYPES = [
  "Oil Tanker (Aframax/VLCC)",
  "Chemical / Product Tanker",
  "LNG / LPG Carrier",
  "Container Ship (5000+ TEU)",
  "Bulk Carrier (Capesize/Panamax)",
  "General Cargo / Heavy Lift",
  "Offshore Support / AHTS / PSV",
  "Tugboat / Dredger"
];

export const RANKS_TRANSLATIONS = {
  "Master / Captain": {
    ru: "Капитан (Master / Captain)",
    en: "Master / Captain"
  },
  "Chief Officer / 1st Mate": {
    ru: "Старший помощник (Chief Officer)",
    en: "Chief Officer / 1st Mate"
  },
  "2nd Officer": {
    ru: "2-й помощник (2nd Officer)",
    en: "2nd Officer"
  },
  "3rd Officer": {
    ru: "3-й помощник (3rd Officer)",
    en: "3rd Officer"
  },
  "Chief Engineer": {
    ru: "Старший механик (Chief Engineer)",
    en: "Chief Engineer"
  },
  "2nd Engineer": {
    ru: "2-й механик (2nd Engineer)",
    en: "2nd Engineer"
  },
  "3rd Engineer": {
    ru: "3-й механик (3rd Engineer)",
    en: "3rd Engineer"
  },
  "4th Engineer": {
    ru: "4-й механик (4th Engineer)",
    en: "4th Engineer"
  },
  "Electro-Technical Officer (ETO)": {
    ru: "Электромеханик (ETO)",
    en: "Electro-Technical Officer (ETO)"
  },
  "Bosun": {
    ru: "Боцман (Bosun)",
    en: "Bosun"
  },
  "Able Seaman (AB)": {
    ru: "Матрос 1-го класса (AB)",
    en: "Able Seaman (AB)"
  },
  "Ordinary Seaman (OS)": {
    ru: "Матрос 2-го класса (OS)",
    en: "Ordinary Seaman (OS)"
  },
  "Oiler / Motorman": {
    ru: "Моторист 1-го класса (Oiler)",
    en: "Oiler / Motorman"
  },
  "Fitter / Welder": {
    ru: "Токарь / Сварщик (Fitter)",
    en: "Fitter / Welder"
  },
  "Chief Cook": {
    ru: "Судовой повар (Chief Cook)",
    en: "Chief Cook"
  },
  "Messman": {
    ru: "Буфетчик / Дневальный (Messman)",
    en: "Messman"
  }
};

export const VESSEL_TYPES_TRANSLATIONS = {
  "Oil Tanker (Aframax/VLCC)": {
    ru: "Нефтяной танкер (Oil Tanker)",
    en: "Oil Tanker (Aframax/VLCC)"
  },
  "Chemical / Product Tanker": {
    ru: "Химовоз / Продуктовоз (Chemical Tanker)",
    en: "Chemical / Product Tanker"
  },
  "LNG / LPG Carrier": {
    ru: "Газовоз (LNG / LPG Carrier)",
    en: "LNG / LPG Carrier"
  },
  "Container Ship (5000+ TEU)": {
    ru: "Контейнеровоз (Container Ship)",
    en: "Container Ship (5000+ TEU)"
  },
  "Bulk Carrier (Capesize/Panamax)": {
    ru: "Балкер (Bulk Carrier)",
    en: "Bulk Carrier (Capesize/Panamax)"
  },
  "General Cargo / Heavy Lift": {
    ru: "Сухогруз / Тяжеловес (General Cargo)",
    en: "General Cargo / Heavy Lift"
  },
  "Offshore Support / AHTS / PSV": {
    ru: "Офшорный флот / AHTS / PSV",
    en: "Offshore Support / AHTS / PSV"
  },
  "Tugboat / Dredger": {
    ru: "Буксир / Дреджер (Tugboat)",
    en: "Tugboat / Dredger"
  }
};

export const ENGLISH_LEVELS_TRANSLATIONS = {
  "Fluent / Advanced": {
    ru: "Свободный / Advanced",
    en: "Fluent / Advanced"
  },
  "Good / Upper-Intermediate": {
    ru: "Хороший / Upper-Intermediate",
    en: "Good / Upper-Intermediate"
  },
  "Intermediate / Marlins 75%+": {
    ru: "Средний / Marlins 75%+",
    en: "Intermediate / Marlins 75%+"
  },
  "Basic": {
    ru: "Базовый / Basic",
    en: "Basic"
  }
};

export const getRankLabel = (rank, lang = 'ru') => {
  if (RANKS_TRANSLATIONS[rank]) {
    return RANKS_TRANSLATIONS[rank][lang] || rank;
  }
  return rank;
};

export const getVesselLabel = (vessel, lang = 'ru') => {
  if (VESSEL_TYPES_TRANSLATIONS[vessel]) {
    return VESSEL_TYPES_TRANSLATIONS[vessel][lang] || vessel;
  }
  return vessel;
};

export const getEnglishLevelLabel = (level, lang = 'ru') => {
  if (ENGLISH_LEVELS_TRANSLATIONS[level]) {
    return ENGLISH_LEVELS_TRANSLATIONS[level][lang] || level;
  }
  return level;
};

export const MARITAL_STATUS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
];

export const KIN_RELATIONS = [
  'Wife',
  'Husband',
  'Mother',
  'Father',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Other',
];

export const OVERALL_SIZES_EUR = [
  'XS / 44',
  'S / 46',
  'M / 48',
  'L / 50',
  'XL / 52',
  'XXL / 54',
  'XXXL / 56',
  'XXXXL / 58',
];

export const SHOE_SIZES = [
  '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48',
];

export const ENGINE_TYPES = [
  'MAN B&W',
  'MAN B&W ME-C',
  'MAN B&W ME-GI (Dual Fuel)',
  'Wärtsilä',
  'Wärtsilä Dual Fuel',
  'Wärtsilä RT-flex',
  'Sulzer RTA',
  'MaK / Caterpillar',
  'Rolls-Royce Bergen',
  'WinGD (X-DF)',
  'Diesel-Electric',
  'Steam Turbine',
  'Other',
];

export const FLAG_STATES = [
  '- SELECT -',
  'Panama',
  'Marshall Islands',
  'Liberia',
  'Bahamas',
  'Malta',
  'Cyprus',
  'Cayman Islands',
  'Antigua & Barbuda',
  'Isle of Man',
  'Gibraltar',
  'Bermuda',
  'Russia',
  'Ukraine',
  'Georgia',
  'Azerbaijan',
  'Greece',
  'Norway',
  'Singapore',
  'Hong Kong',
  'Japan',
  'China',
  'USA',
  'UK',
  'Netherlands',
  'Germany',
  'Italy',
  'Denmark',
  'Other',
];

export const CERTIFICATE_TYPES = [
  'Master Unlimited (STCW II/2)',
  'Chief Mate Unlimited (STCW II/2)',
  'Officer in Charge of Navigational Watch (STCW II/1)',
  'Chief Engineer Unlimited (STCW III/2)',
  '2nd Engineer Unlimited (STCW III/2)',
  'Officer in Charge of Engineering Watch (STCW III/1)',
  'Electro-Technical Officer (STCW III/6)',
  'Basic Safety Training (STCW VI/1)',
  'Advanced Firefighting (STCW VI/3)',
  'Medical First Aid (STCW VI/4)',
  'GMDSS GOC / ROC',
  'ARPA / RADAR',
  'ECDIS Type-Specific',
  'Tanker Familiarization (STCW V/1-1)',
  'Advanced Oil Tanker (STCW V/1-1)',
  'Advanced Chemical Tanker (STCW V/1-1)',
  'Advanced Liquefied Gas Tanker (STCW V/1-2)',
  'High Voltage Safety',
  'Survival Craft & Rescue Boats (STCW VI/2)',
  'Fast Rescue Boat (STCW VI/2)',
  'Other',
];

export const INITIAL_VACANCIES = [
  {
    id: 1,
    title: "Master / Captain",
    rank: "Master / Captain",
    vesselType: "Chemical / Product Tanker",
    dwt: "47,000 DWT (MAN B&W)",
    salary: "$14,500",
    salaryVal: 14500,
    contract: "4 months",
    joiningPort: "Rotterdam, Netherlands",
    joiningDate: "15.08.2026",
    urgent: true,
    active: true,
    requirements: [
      "Minimum 2 contracts in rank on Chemical Tankers with FRAMO pumps",
      "Valid Master Unlimited STCW II/2 Certificate & Flag Endorsements",
      "Marlins English test > 85%",
      "US C1/D & Schengen Visas preferred"
    ],
    responsibilities: "Overall command of vessel navigation, safety, crew operations, cargo handling and SIRE inspection readiness."
  },
  {
    id: 2,
    title: "Chief Engineer",
    rank: "Chief Engineer",
    vesselType: "Container Ship (5000+ TEU)",
    dwt: "65,000 DWT (WinGD Flex)",
    salary: "$13,800",
    salaryVal: 13800,
    contract: "4 months",
    joiningPort: "Singapore",
    joiningDate: "20.08.2026",
    urgent: false,
    active: true,
    requirements: [
      "Experience with WinGD / RT-flex electronic engines",
      "Chief Engineer Unlimited STCW III/2",
      "Good performance references from previous European shipowners"
    ],
    responsibilities: "Management of technical department, main engine, auxiliary equipment, bunkering and dry-dock preparation."
  },
  {
    id: 3,
    title: "2nd Officer",
    rank: "2nd Officer",
    vesselType: "Oil Tanker (Aframax/VLCC)",
    dwt: "115,000 DWT",
    salary: "$5,600",
    salaryVal: 5600,
    contract: "4 ± 1 months",
    joiningPort: "Fujairah, UAE",
    joiningDate: "05.08.2026",
    urgent: true,
    active: true,
    requirements: [
      "Navigational officer with ECDIS TRANSAS 4000 type specific certification",
      "Advanced Oil Tanker endorsement",
      "Good English communication skills"
    ],
    responsibilities: "Passage planning, navigation watchkeeping, safety equipment maintenance (LSA/FFA)."
  },
  {
    id: 4,
    title: "Electro-Technical Officer (ETO)",
    rank: "Electro-Technical Officer (ETO)",
    vesselType: "LNG / LPG Carrier",
    dwt: "95,000 CBM",
    salary: "$7,200",
    salaryVal: 7200,
    contract: "3 months",
    joiningPort: "Busan, South Korea",
    joiningDate: "25.08.2026",
    urgent: false,
    active: true,
    requirements: [
      "ETO Certificate of Competency (STCW III/6)",
      "High Voltage (HV) certification",
      "Experience on dual-fuel engines / gas handling automation"
    ],
    responsibilities: "Maintenance and repair of all electrical, electronic, automation systems and IAS cargo controls."
  },
  {
    id: 5,
    title: "Bosun / Deck Foreman",
    rank: "Bosun",
    vesselType: "Bulk Carrier (Capesize/Panamax)",
    dwt: "82,000 DWT",
    salary: "$2,400",
    salaryVal: 2400,
    contract: "6 months",
    joiningPort: "Istanbul, Turkey",
    joiningDate: "10.08.2026",
    urgent: false,
    active: true,
    requirements: [
      "Minimum 3 contracts as Bosun on Bulk Carriers",
      "AB STCW II/5 qualification",
      "Experience with cargo hold cleaning for grain standards"
    ],
    responsibilities: "Supervision of deck ratings, mooring operations, maintenance, painting, and hatch cover sealing."
  }
];

export const INITIAL_CANDIDATES = [
  {
    id: "APP-2026-001",
    fullName: "Воронов Александр Сергеевич (Voronov Aleksandr)",
    surname: "VORONOV",
    name: "ALEKSANDR",
    fatherName: "Sergeevich",
    motherName: "Voronova Elena Viktorovna",
    dob: "12.04.1984",
    placeOfBirth: "Novorossiysk, Russia",
    nationality: "Russian",
    citizenship: "Russia",
    maritalStatus: "Married",
    childrenUnder18: "2 (Dmitriy 2012, Anna 2016)",
    address: "Naberezhnaya Admiral Serebryakov Str. 15, Apt. 42, Novorossiysk, Russia",
    homeZip: "353900",
    phone: "+7 (918) 456-78-90",
    email: "voronov.capt@gmail.com",
    skypeTelegram: "@capt_voronov_novoross",
    appliedRank: "Master / Captain",
    readyDate: "15.08.2026",
    kinName: "Voronova Olga Dmitrievna",
    kinRelation: "Wife",
    kinAddress: "Naberezhnaya Admiral Serebryakov Str. 15, Apt. 42, Novorossiysk, Russia",
    kinPhone: "+7 (918) 987-65-43",
    height: "182",
    weight: "84",
    overallSize: "L / 50",
    shoeSize: "43",
    eyesColour: "Blue",
    hairColour: "Brown",
    photoDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%230b1329"/><rect x="10" y="10" width="280" height="380" rx="8" fill="%231e293b" stroke="%2338bdf8" stroke-width="3"/><circle cx="150" cy="140" r="65" fill="%2338bdf8"/><path d="M50,340 C50,230 250,230 250,340 Z" fill="%230284c7"/><circle cx="150" cy="130" r="45" fill="%23fed7aa"/><path d="M120,110 Q150,90 180,110 Q180,95 150,90 Q120,95 120,110 Z" fill="%2378350f"/><text x="150" y="370" font-family="Arial, sans-serif" font-weight="bold" font-size="18" fill="%23ffffff" text-anchor="middle">FLEETFORCE SEAFARER</text></svg>',

    // Education
    collegeName: "ADMIRAL USHAKOV MARITIME STATE UNIVERSITY",
    collegeDepartment: "NAVIGATION & MARITIME TRANSPORTATION",
    collegeFrom: "01.09.2001",
    collegeTill: "30.06.2007",

    // Documents
    passNo: "75 1234567",
    passIssued: "14.05.2021",
    passValid: "14.05.2031",
    passPlace: "FMS 23001 NOVOROSSIYSK",

    seamanNo: "M 0987654",
    seamanIssued: "10.02.2022",
    seamanValid: "10.02.2027",
    seamanPlace: "PORT NOVOROSSIYSK",

    cocNo: "COC-RU-2022-8841",
    cocIssued: "15.03.2022",
    cocValid: "15.03.2027",
    cocPlace: "MAP NOVOROSSIYSK",

    endorseNo: "END-RU-2022-8841",
    endorseIssued: "15.03.2022",
    endorseValid: "15.03.2027",
    endorsePlace: "MAP NOVOROSSIYSK",

    usVisaNo: "R88491204",
    usVisaIssued: "20.10.2023",
    usVisaValid: "19.10.2033",
    usVisaPlace: "EMBASSY YEREVAN",

    c1dNo: "C1D-US-99410",
    c1dIssued: "20.10.2023",
    c1dValid: "19.10.2033",
    c1dPlace: "EMBASSY YEREVAN",

    schengenNo: "EST-SCH-88412",
    schengenIssued: "05.01.2024",
    schengenValid: "04.01.2026",
    schengenPlace: "CONSULATE TALLINN",

    yellowFeverNo: "YF-RU-2021-00412",
    yellowFeverIssued: "12.06.2021",
    yellowFeverValid: "LIFETIME",
    yellowFeverPlace: "SANATORIUM NOVOROSS",

    medCertNo: "MED-2026-9941",
    medCertIssued: "10.01.2026",
    medCertValid: "10.01.2028",
    medCertPlace: "CLINIC SEAMAN NOVOROSS",

    primaryDocs: {
      "TRAVEL PASSPORT:": { number: "75 1234567", issued: "14.05.2021", expiry: "14.05.2031", place: "FMS 23001 NOVOROSSIYSK" },
      "SEAMAN'S BOOK (SID):": { number: "M 0987654", issued: "10.02.2022", expiry: "10.02.2027", place: "PORT NOVOROSSIYSK" },
      "SEAFARERS'S IDENTITY DOCUMENT(SID):": { number: "SID-RU-884912", issued: "10.02.2022", expiry: "10.02.2027", place: "MAP NOVOROSSIYSK" },
      "CIVIL PASSPORT:": { number: "03 14 987654", issued: "20.04.2004", expiry: "PERMANENT", place: "MVD NOVOROSSIYSK" },
      "U.S. VISA:": { number: "R88491204", issued: "20.10.2023", expiry: "19.10.2033", place: "EMBASSY YEREVAN" },
      "OTHER VALID VISA:": { number: "EST-SCH-88412", issued: "05.01.2024", expiry: "04.01.2026", place: "CONSULATE TALLINN" },
      "CERTIFICATE OF COMPETENCY # 1": { number: "COC-RU-2022-8841", issued: "15.03.2022", expiry: "15.03.2027", place: "MAP NOVOROSSIYSK" },
      "RANK_CAPACITY_1": { number: "Master Unlimited (STCW II/2)", issued: "", expiry: "", place: "" },
      "ENDORSEMENT OF CERTIFICATE #1": { number: "END-RU-2022-8841", issued: "15.03.2022", expiry: "15.03.2027", place: "MAP NOVOROSSIYSK" },
      "CERTIFICATE OF COMPETENCY # 2": { number: "N/A", issued: "-", expiry: "-", place: "-" },
      "RANK_CAPACITY_2": { number: "N/A", issued: "", expiry: "", place: "" },
      "ENDORSEMENT OF CERTIFICATE #2": { number: "N/A", issued: "-", expiry: "-", place: "-" }
    },

    // STCW Certificates (all 30 filled)
    stcwCertificates: {
      "GMDSS CERTIFICATE/ENDORSEMENT": { number: "GMDSS-RU-8841", issued: "10.03.2022", expiry: "10.03.2027", place: "NOVOROSSIYSK" },
      "BASIC SAFETY TRAINING": { number: "BST-2022-4910", issued: "12.03.2022", expiry: "12.03.2027", place: "NOVOROSSIYSK" },
      "PROFICIENCY IN SURVIVAL CRAFT": { number: "PSC-2022-9912", issued: "14.03.2022", expiry: "14.03.2027", place: "NOVOROSSIYSK" },
      "ADVANCED FIRE FIGHTING": { number: "AFF-2022-3341", issued: "15.03.2022", expiry: "15.03.2027", place: "NOVOROSSIYSK" },
      "MEDICAL FIRST AID": { number: "MFA-2022-1102", issued: "16.03.2022", expiry: "16.03.2027", place: "NOVOROSSIYSK" },
      "MEDICAL CARE": { number: "MC-2022-5541", issued: "17.03.2022", expiry: "17.03.2027", place: "NOVOROSSIYSK" },
      "SHIPS SECURITY OFFICER": { number: "SSO-2022-7741", issued: "18.03.2022", expiry: "18.03.2027", place: "NOVOROSSIYSK" },
      "DESIGNATED SECURITY DUTIES": { number: "DSD-2022-8812", issued: "19.03.2022", expiry: "19.03.2027", place: "NOVOROSSIYSK" },
      "SECURITY AWARENESS": { number: "SA-2022-9914", issued: "20.03.2022", expiry: "20.03.2027", place: "NOVOROSSIYSK" },
      "SHIPS SAFETY OFFICER / ISM": { number: "SSOF-2022-4412", issued: "21.03.2022", expiry: "21.03.2027", place: "NOVOROSSIYSK" },
      "RADAR NAVIGATION, RADAR PLOTTING AND USE OF ARPA": { number: "ARPA-2022-1104", issued: "22.03.2022", expiry: "22.03.2027", place: "NOVOROSSIYSK" },
      "ADVANCED TRAINING FOR SHIPS OPERATING IN POLAR WATERS CERTIFICATE": { number: "POLAR-2023-881", issued: "05.04.2023", expiry: "05.04.2028", place: "ST PETERSBURG" },
      "BASIC TRAINING FOR SHIPS OPERATING IN POLAR WATERS CERTIFICATE": { number: "POLAR-B-2023-88", issued: "01.04.2023", expiry: "01.04.2028", place: "ST PETERSBURG" },
      "DANGEROUS & HAZARDOUS CARGOES": { number: "HAZ-2022-7714", issued: "24.03.2022", expiry: "24.03.2027", place: "NOVOROSSIYSK" },
      "BRIDGE TEAM MNGT": { number: "BTM-2022-3301", issued: "25.03.2022", expiry: "25.03.2027", place: "NOVOROSSIYSK" },
      "ENGINE ROOM RESOURCE MNGT": { number: "N/A", issued: "-", expiry: "-", place: "-" },
      "ECDIS GENERIC": { number: "ECDIS-GEN-881", issued: "26.03.2022", expiry: "UNLIMITED", place: "NOVOROSSIYSK" },
      "ECDIS SPECIFIC": { number: "ECDIS-FURUNO-12", issued: "27.03.2022", expiry: "UNLIMITED", place: "COPENHAGEN" },
      "BASIC TRAINING FOR OIL & CHEMICAL TANKER CERTIFICATE": { number: "BTOCT-2022-991", issued: "28.03.2022", expiry: "28.03.2027", place: "NOVOROSSIYSK" },
      "ADV. TRAINING FOR CHEMICAL TANKER CERTIFICATE": { number: "ATCT-2022-4410", issued: "29.03.2022", expiry: "29.03.2027", place: "NOVOROSSIYSK" },
      "BASIC TRAINING FOR OIL AND CHEMICAL TANKER - ENDORSEMENT": { number: "BTOCT-END-8841", issued: "30.03.2022", expiry: "30.03.2027", place: "MAP NOVOROSS" },
      "ADV. TRAINING FOR OIL TANKER -ENDORSEMENT": { number: "ATOT-END-4412", issued: "31.03.2022", expiry: "31.03.2027", place: "MAP NOVOROSS" },
      "ADV. TRAINING FOR CHEMICAL TANKER -ENDORSEMENT": { number: "ATCT-END-5514", issued: "01.04.2022", expiry: "01.04.2027", place: "MAP NOVOROSS" },
      "BASIC/ADV. TRAINING FOR GAS TANKER ENDO": { number: "GAS-END-8812", issued: "02.04.2022", expiry: "02.04.2027", place: "MAP NOVOROSS" },
      "HIGH VOLTAGE EL. EQUIPMENT": { number: "HV-2022-9901", issued: "03.04.2022", expiry: "UNLIMITED", place: "NOVOROSSIYSK" },
      "COOK CERTIFICATE": { number: "N/A", issued: "-", expiry: "-", place: "-" },
      "MESSMAN (MLC-2006)": { number: "N/A", issued: "-", expiry: "-", place: "-" },
      "YELLOW FEVER CERTIFICATE": { number: "YF-RU-2021-00412", issued: "12.06.2021", expiry: "LIFETIME", place: "SANATORIUM NOVOROSS" },
      "COVID-19 VACCINATION CERTIFICATE": { number: "SPUTNIK-V-2021-88", issued: "15.08.2021", expiry: "LIFETIME", place: "NOVOROSSIYSK" }
    },

    // Foreign Seaman's Record Books (4 rows filled)
    recordBooks: [
      { flag: "Panama", number: "PAN-SB-884912", issuedDate: "12.04.2022", validUntil: "12.04.2027", place: "PANAMA CITY" },
      { flag: "Marshall Islands", number: "MI-SB-004912", issuedDate: "15.05.2022", validUntil: "15.05.2027", place: "MAJURO" },
      { flag: "Liberia", number: "LIB-SB-559124", issuedDate: "20.06.2022", validUntil: "20.06.2027", place: "MONROVIA" },
      { flag: "Bahamas", number: "BAH-SB-119402", issuedDate: "10.08.2022", validUntil: "10.08.2027", place: "NASSAU" }
    ],

    // Sea Service (10 rows filled)
    seaService: [
      { id: 1, dateFrom: "15.02.2025", dateTo: "20.06.2025", rankHeld: "Master", salary: "14500", vesselName: "SCF SAMOTLOR", shipowner: "Sovcomflot / SCF Group", vesselType: "Oil / Product Tanker", engineType: "MAN B&W 6S60MC-C", buildYear: "2018", dwtGrt: "47,400 DWT", engineBhp: "12,240 BHP", flag: "Liberia", manningCompany: "SCF Crewing Novorossiysk" },
      { id: 2, dateFrom: "10.03.2024", dateTo: "15.07.2024", rankHeld: "Master", salary: "14000", vesselName: "STENA POLARIS", shipowner: "Stena Bulk AB", vesselType: "Chemical / Product Tanker", engineType: "MAN B&W 7S50ME-B9", buildYear: "2016", dwtGrt: "65,000 DWT", engineBhp: "13,500 BHP", flag: "Panama", manningCompany: "Legacy Marine Agency" },
      { id: 3, dateFrom: "05.04.2023", dateTo: "10.08.2023", rankHeld: "Master", salary: "13800", vesselName: "MARLIN AMETHYST", shipowner: "Marlin Tankers Ltd", vesselType: "Chemical Tanker", engineType: "Wärtsilä 6L46F", buildYear: "2015", dwtGrt: "50,000 DWT", engineBhp: "11,800 BHP", flag: "Marshall Islands", manningCompany: "Columbia Shipmanagement" },
      { id: 4, dateFrom: "12.05.2022", dateTo: "18.09.2022", rankHeld: "Chief Officer", salary: "10200", vesselName: "SCF BALTICA", shipowner: "Sovcomflot / SCF Group", vesselType: "Aframax Oil Tanker", engineType: "MAN B&W 7S60MC", buildYear: "2014", dwtGrt: "115,000 DWT", engineBhp: "19,400 BHP", flag: "Liberia", manningCompany: "SCF Crewing Novorossiysk" },
      { id: 5, dateFrom: "01.06.2021", dateTo: "05.10.2021", rankHeld: "Chief Officer", salary: "9800", vesselName: "NAVIGATOR GAS", shipowner: "Navigator Gas Shipping", vesselType: "LPG / Ethylene Carrier", engineType: "MAN B&W ME-GI Dual Fuel", buildYear: "2013", dwtGrt: "22,500 CBM", engineBhp: "9,600 BHP", flag: "Bahamas", manningCompany: "BGI St. Petersburg" },
      { id: 6, dateFrom: "15.01.2020", dateTo: "20.05.2020", rankHeld: "Chief Officer", salary: "9500", vesselName: "ATLANTIC GEMINI", shipowner: "V.Group / V.Ships", vesselType: "Product Tanker", engineType: "MAN B&W 6S50MC", buildYear: "2012", dwtGrt: "46,000 DWT", engineBhp: "10,800 BHP", flag: "Malta", manningCompany: "V.Ships Novorossiysk" },
      { id: 7, dateFrom: "10.02.2019", dateTo: "15.06.2019", rankHeld: "2nd Officer", salary: "5200", vesselName: "SCF NEVA", shipowner: "Sovcomflot", vesselType: "Oil Tanker", engineType: "MAN B&W 6S60MC", buildYear: "2010", dwtGrt: "106,000 DWT", engineBhp: "18,200 BHP", flag: "Liberia", manningCompany: "SCF Crewing Novorossiysk" },
      { id: 8, dateFrom: "05.03.2018", dateTo: "10.07.2018", rankHeld: "2nd Officer", salary: "4800", vesselName: "CAPESIZE LEADER", shipowner: "Zodiac Maritime", vesselType: "Bulk Carrier Capesize", engineType: "Sulzer 6RTA84T", buildYear: "2009", dwtGrt: "180,000 DWT", engineBhp: "22,000 BHP", flag: "UK", manningCompany: "Zodiac Maritime Agencies" },
      { id: 9, dateFrom: "20.04.2017", dateTo: "25.08.2017", rankHeld: "3rd Officer", salary: "3600", vesselName: "PACIFIC VOYAGER", shipowner: "Eastern Pacific Shipping", vesselType: "Container Ship (4500 TEU)", engineType: "MAN B&W 9K90MC-C", buildYear: "2008", dwtGrt: "55,000 DWT", engineBhp: "41,000 BHP", flag: "Singapore", manningCompany: "EPS Crewing Center" },
      { id: 10, dateFrom: "01.05.2016", dateTo: "01.09.2016", rankHeld: "Deck Cadet", salary: "850", vesselName: "PROFESSOR KHLYUSTIN", shipowner: "Far Eastern Shipping (FESCO)", vesselType: "Training / General Cargo", engineType: "MAN B&W 6S50MC", buildYear: "2005", dwtGrt: "12,500 DWT", engineBhp: "7,800 BHP", flag: "Russia", manningCompany: "Admiral Ushakov University" }
    ],

    // Brief Information About Previous Employers (5 rows filled)
    employers: [
      { id: 1, company: "Sovcomflot / SCF Group Novorossiysk", personInCharge: "Captain Petrov Igor Anatolyevich (Crew Superintendent)", contactDetails: "+7 (8617) 60-12-34 / petrov.i@scf-group.ru" },
      { id: 2, company: "Stena Bulk Shipping Gothenburg", personInCharge: "Mr. Lars Lindqvist (Fleet Marine Personnel Manager)", contactDetails: "+46 (31) 855-000 / lars.lindqvist@stenabulk.com" },
      { id: 3, company: "Columbia Shipmanagement Limassol Cyprus", personInCharge: "Capt. Andreas Georgiou (Senior Manning Director)", contactDetails: "+357 (25) 843-100 / a.georgiou@columbia-shipmanagement.com" },
      { id: 4, company: "V.Group / V.Ships Novorossiysk Branch", personInCharge: "Mrs. Elena Smirnova (Crewing Operations Lead)", contactDetails: "+7 (8617) 30-05-55 / elena.smirnova@vgroup.com" },
      { id: 5, company: "Zodiac Maritime Agencies London UK", personInCharge: "Mr. David Miller (Fleet Personnel Director)", contactDetails: "+44 (20) 7262-8000 / crew@zodiac-maritime.com" }
    ],

    signDate: "10.08.2026",
    signature: "Voronov A.S.",
    status: "Approved",
    marlinsScore: "94%",
    englishLevel: "Fluent / Advanced",
    notes: "Полностью заполненная эталонная анкета капитана. Все 100+ ячеек заполнены.",
    submittedAt: "2026-08-10T02:35:00Z"
  }
];

export const INITIAL_OFFICES = [
  {
    id: 1,
    city: 'Санкт-Петербург',
    cityEn: 'Saint Petersburg',
    address: 'г. Санкт-Петербург, вн. тер. г. муниципальный округ Нарвский Округ, пр-кт Стачек, д. 47, литера А, помещ. 2НС, офис 340-342',
    addressEn: '47 Litera A Stachek Ave, Room 2NS, Office 340-342, Saint Petersburg',
    phone: '',
    phones: [],
    email: 'FleetForceLLC@yandex.ru',
    emails: ['FleetForceLLC@yandex.ru'],
    flag: '⚓ Главный Офис',
    flagEn: '⚓ Headquarters'
  }
];

export const INITIAL_HUB_BLOCKS = [
  {
    id: 1,
    title: 'FleetForce Standard Application (PDF)',
    description: 'Официальный 5-страничный бланк морской анкеты FleetForce Crewing Alliance в формате PDF.',
    buttonText: 'Скачать бланки анкеты Fleet Force (.PDF)',
    actionType: 'download',
    filename: 'Crew_Application_Form.pdf',
    iconType: 'FileText',
    color: 'blue'
  },
  {
    id: 2,
    title: 'FleetForce CV Form (DOC)',
    description: 'Редактируемый Word (.DOC) бланк морской анкеты с полной матрицей плавательского ценза Fleet Force.',
    buttonText: 'Скачать анкету Fleet Force (.DOC)',
    actionType: 'download',
    filename: 'Crew_Application_Form.doc',
    iconType: 'Download',
    color: 'gold'
  },
  {
    id: 3,
    title: 'Заполнить анкету онлайн',
    titleEn: 'Online application',
    description: 'Полный перечень рабочих дипломов, подтверждений, НБЖС и медицинских комиссий (Подплав / ОУК) для рейса.',
    buttonText: 'Заполнить онлайн',
    actionType: 'wizard',
    iconType: 'FileCheck',
    color: 'emerald'
  }
];

export const INITIAL_STATS = [
  { id: 1, number: '140+', labelRu: 'Активных вакансий', labelEn: 'Active Vacancies', color: 'blue' },
  { id: 2, number: '38,000+', labelRu: 'Моряков в базе', labelEn: 'Seafarers in Database', color: 'emerald' },
  { id: 3, number: '65+', labelRu: 'Судовладельцев', labelEn: 'Partner Shipowners', color: 'gold' },
  { id: 4, number: '6', labelRu: 'Офисов в РФ и СНГ', labelEn: 'Branch Offices', color: 'white' }
];

export const INITIAL_SHIPOWNER_REQUESTS = [
  // No demo requests — data comes from server db.json
];


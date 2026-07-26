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
    id: "APP-2026-089",
    fullName: "Воронов Александр Сергеевич (Voronov Aleksandr)",
    dob: "1984-04-12",
    citizenship: "Россия",
    phone: "+7 (918) 456-78-90",
    email: "voronov.capt@gmail.com",
    appliedRank: "Master / Captain",
    alternativeRank: "Chief Officer / 1st Mate",
    minSalary: "14000",
    readyDate: "2026-08-10",
    preferredVessels: "Chemical / Product Tanker",
    status: "Approved",
    marlinsScore: "92%",
    englishLevel: "Fluent / Advanced",
    notes: "Отличные рекомендации от Stena Bulk. Готов к отправке в Нидерланды.",
    submittedAt: "2026-07-24T14:30:00Z",
    seaService: [
      {
        id: 1,
        vesselName: "Stena Polaris",
        vesselType: "Chemical Tanker",
        dwtGrt: "65,000 DWT",
        engineBhp: "MAN B&W 12,500 KW",
        rankHeld: "Master",
        manningCompany: "Legacy Marine",
        dateFrom: "2025-02-10",
        dateTo: "2025-06-15"
      },
      {
        id: 2,
        vesselName: "SCF Samotlor",
        vesselType: "Product Tanker",
        dwtGrt: "47,000 DWT",
        engineBhp: "MAN 9,800 KW",
        rankHeld: "Chief Officer",
        manningCompany: "BGI St.Petersburg",
        dateFrom: "2024-03-01",
        dateTo: "2024-07-20"
      }
    ]
  },
  {
    id: "APP-2026-092",
    fullName: "Ковалев Дмитрий Игоревич (Kovalev Dmitriy)",
    dob: "1990-11-25",
    citizenship: "Россия",
    phone: "+7 (911) 234-56-78",
    email: "kovalev.eto@yandex.ru",
    appliedRank: "Electro-Technical Officer (ETO)",
    alternativeRank: "4th Engineer",
    minSalary: "6800",
    readyDate: "2026-08-15",
    preferredVessels: "LNG / LPG Carrier",
    status: "New",
    marlinsScore: "88%",
    englishLevel: "Good / Upper-Intermediate",
    notes: "Новая анкета через онлайн мастер. Требуется проверка High Voltage диплома.",
    submittedAt: "2026-07-25T09:15:00Z",
    seaService: [
      {
        id: 1,
        vesselName: "Arctic Princess",
        vesselType: "LNG Carrier",
        dwtGrt: "95,000 CBM",
        engineBhp: "Wärtsilä Dual Fuel",
        rankHeld: "ETO",
        manningCompany: "Top Crew",
        dateFrom: "2025-05-01",
        dateTo: "2025-09-01"
      }
    ]
  }
];

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
    ],
    attachedFiles: [
      {
        id: "f-101",
        name: "CV_Master_Voronov_2026.pdf",
        size: "1.2 MB",
        type: "application/pdf",
        dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJSVFT0Y="
      },
      {
        id: "f-102",
        name: "STCW_Master_Unlimited_License.jpg",
        size: "840 KB",
        type: "image/jpeg",
        dataUrl: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%230b1329'/%3E%3Crect x='20' y='20' width='760' height='560' fill='none' stroke='%230088ff' stroke-width='4' rx='10'/%3E%3Ctext x='50%25' y='35%25' font-family='sans-serif' font-size='28' font-weight='bold' fill='%23ffffff' text-anchor='middle'%3EINTERNATIONAL STCW ENDORSEMENT%3C/text%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%2338bdf8' text-anchor='middle'%3EMASTER UNLIMITED (STCW II/2)%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='sans-serif' font-size='18' fill='%2394a3b8' text-anchor='middle'%3EHolder: Voronov Aleksandr Sergeevich%3C/text%3E%3Ctext x='50%25' y='80%25' font-family='sans-serif' font-size='14' fill='%2310b981' text-anchor='middle'%3EStatus: VERIFIED & ACTIVE (Exp: 2030)%3C/text%3E%3C/svg%3E"
      },
      {
        id: "f-103",
        name: "Marlins_English_Cert_92pct.pdf",
        size: "350 KB",
        type: "application/pdf",
        dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJSVFT0Y="
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
    ],
    attachedFiles: [
      {
        id: "f-104",
        name: "ETO_Kovalev_Maritime_CV.docx",
        size: "620 KB",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        dataUrl: "data:text/plain;charset=utf-8,FleetForce%20Maritime%20CV%20-%20Kovalev%20Dmitriy%20(ETO)"
      },
      {
        id: "f-105",
        name: "High_Voltage_Certificate_STCW.jpg",
        size: "1.1 MB",
        type: "image/jpeg",
        dataUrl: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%2309101d'/%3E%3Crect x='20' y='20' width='760' height='560' fill='none' stroke='%23eab308' stroke-width='4' rx='10'/%3E%3Ctext x='50%25' y='35%25' font-family='sans-serif' font-size='28' font-weight='bold' fill='%23eab308' text-anchor='middle'%3EHIGH VOLTAGE SAFETY CERTIFICATE%3C/text%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%23ffffff' text-anchor='middle'%3ESTCW III/6 HIGH VOLTAGE OPERATIONAL%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='sans-serif' font-size='18' fill='%2394a3b8' text-anchor='middle'%3EHolder: Kovalev Dmitriy Igorevich%3C/text%3E%3C/svg%3E"
      }
    ]
  }
];

export const INITIAL_OFFICES = [
  {
    id: 1,
    city: 'Санкт-Петербург',
    cityEn: 'Saint Petersburg',
    address: 'г. Санкт-Петербург, пр. Стачек, д. 47А, офис 340-342',
    addressEn: '47A Stachek Ave, Office 340-342, Saint Petersburg',
    phone: '',
    phones: [],
    email: 'FleetForceLLC@yandex.ru',
    emails: ['FleetForceLLC@yandex.ru'],
    flag: '⚓ Главный Офис',
    flagEn: '⚓ Headquarters'
  },
  {
    id: 2,
    city: 'Новороссийск',
    cityEn: 'Novorossiysk',
    address: 'г. Новороссийск, ул. Энгельса/Свободы/Конституции, д. 7, офис 37',
    addressEn: '7 Engelsa/Svobody/Konstitutsii St, Office 37, Novorossiysk',
    phone: '',
    phones: [],
    email: 'FleetForceLLC@yandex.ru',
    emails: ['FleetForceLLC@yandex.ru'],
    flag: '🌊 Черноморский Филиал',
    flagEn: '🌊 Black Sea Branch'
  },
  {
    id: 3,
    city: 'Калининград',
    cityEn: 'Kaliningrad',
    address: 'г. Калининград, Ленинский проспект 81, Офис 205',
    addressEn: '81 Leninskiy Ave, Office 205, Kaliningrad',
    phone: '',
    phones: [],
    email: 'FleetForceLLC@yandex.ru',
    emails: ['FleetForceLLC@yandex.ru'],
    flag: '🇪🇺 Балтийский Офис',
    flagEn: '🇪🇺 Baltic Office'
  },
  {
    id: 4,
    city: 'Владивосток',
    cityEn: 'Vladivostok',
    address: 'г. Владивосток, ул. Светланская 45',
    addressEn: '45 Svetlanskaya St, Vladivostok',
    phone: '',
    phones: [],
    email: 'FleetForceLLC@yandex.ru',
    emails: ['FleetForceLLC@yandex.ru'],
    flag: '🌏 Дальневосточный Офис',
    flagEn: '🌏 Far East Office'
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
    title: 'Чек-лист документов для посадки',
    description: 'Полный перечень рабочих дипломов, подтверждений, НБЖС и медицинских комиссий (Подплав / ОУК) для рейса.',
    buttonText: 'Заполнить онлайн',
    actionType: 'wizard',
    iconType: 'FileCheck',
    color: 'emerald'
  },
  {
    id: 4,
    title: 'Подготовка к Marlins & CES тестам',
    description: 'Официальное тестирование Marlins English Test и CES 6.0 в сертифицированных центрах СПб и Новороссийска.',
    buttonText: 'Записаться на тест',
    actionType: 'link',
    linkUrl: 'tel:+78005553535',
    iconType: 'Award',
    color: 'danger'
  }
];

export const INITIAL_STATS = [
  { id: 1, number: '140+', labelRu: 'Активных вакансий', labelEn: 'Active Vacancies', color: 'blue' },
  { id: 2, number: '38,000+', labelRu: 'Моряков в базе', labelEn: 'Seafarers in Database', color: 'emerald' },
  { id: 3, number: '65+', labelRu: 'Судовладельцев', labelEn: 'Partner Shipowners', color: 'gold' },
  { id: 4, number: '6', labelRu: 'Офисов в РФ и СНГ', labelEn: 'Branch Offices', color: 'white' }
];

export const INITIAL_SHIPOWNER_REQUESTS = [
  {
    id: "REQ-2026-001",
    companyName: "Stena Bulk Tanker Management",
    contactName: "Captain Hans Nielsen (Crew Director)",
    email: "h.nielsen@stenabulk.com",
    phone: "+46 31 855 000",
    details: "Требуется полное комплектование экипажа для 2 продуктовозов (Chemical/Product Tankers 47,000 DWT). Необходимы Master, Chief Officer, Chief Engineer и 2 ETO. Посадка в Роттердаме в августе 2026.",
    status: "New",
    createdAt: "2026-07-26T11:20:00Z"
  },
  {
    id: "REQ-2026-002",
    companyName: "Columbia Shipmanagement Ltd",
    contactName: "Мария Соколова (Senior Manning Officer)",
    email: "m.sokolova@csm-agency.com",
    phone: "+357 25 843 100",
    details: "Запрос расценки на подбор командного состава (Chief Engineer, 2nd Officer) для балкеров Capesize 180,000 DWT. Ставки окладов по соглашению ITF.",
    status: "In Progress",
    createdAt: "2026-07-25T16:45:00Z"
  }
];

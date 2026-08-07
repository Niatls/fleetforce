import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles } from 'lucide-react';
import { VacancyFormModal } from './VacancyFormModal';
import { OfficeFormModal } from './OfficeFormModal';
import { HubBlockFormModal } from './HubBlockFormModal';

// Import Modular Editor Sections
import { EditorToolbar } from './EditorSections/EditorToolbar';
import { EditorHeroSection } from './EditorSections/EditorHeroSection';
import { EditorVacanciesSection } from './EditorSections/EditorVacanciesSection';
import { EditorHubSection } from './EditorSections/EditorHubSection';
import { EditorShipownerSection } from './EditorSections/EditorShipownerSection';
import { EditorOfficesSection } from './EditorSections/EditorOfficesSection';
import { EditorFooterSection } from './EditorSections/EditorFooterSection';

export const SiteEditor = ({
  isOpen,
  onClose,
  onPublish,
  liveVacancies = [],
  liveOffices = [],
  liveHubBlocks = [],
  liveStats = [],
  liveSectionVisibility = {},
  liveShipownerRequests = [],
  liveHeroBadge = '',
  liveHeroTitle = '',
  liveHeroSubtitle = '',
  liveVacanciesTitle = '',
  liveVacanciesSubtitle = '',
  liveHubTitle = '',
  liveHubSubtitle = '',
  liveOfficesTitle = '',
  liveOfficesSubtitle = '',
  liveShipownerTitle = '',
  liveShipownerSubtitle = '',
  currentTheme,
  onThemeChange
}) => {
  const { lang, t } = useLanguage();

  // Draft State (initialized with current live data)
  const [draftVacancies, setDraftVacancies] = useState([]);
  const [draftOffices, setDraftOffices] = useState([]);
  const [draftHubBlocks, setDraftHubBlocks] = useState([]);
  const [draftStats, setDraftStats] = useState([]);
  const [draftSectionVisibility, setDraftSectionVisibility] = useState({});

  // Hero custom text state (persisted in draft/local)
  const [draftHeroBadge, setDraftHeroBadge] = useState(() => localStorage.getItem('fleetforce_hero_badge') || 'Международный крюинговый альянс FLEET FORCE');
  const [draftHeroTitle, setDraftHeroTitle] = useState(liveHeroTitle || 'Трудоустройство моряков на мировой торговый флот');
  const [draftHeroSubtitle, setDraftHeroSubtitle] = useState(liveHeroSubtitle || 'Официальное трудоустройство, высокие ставки, стабильные контракты на танкерном, контейнерном, балкерном и офшорном флоте.');

  // Vacancies section custom text draft state
  const [draftVacanciesTitle, setDraftVacanciesTitle] = useState(() => localStorage.getItem('fleetforce_vacancies_title') || 'Актуальные Вакансии в Море');
  const [draftVacanciesSubtitle, setDraftVacanciesSubtitle] = useState(() => localStorage.getItem('fleetforce_vacancies_subtitle') || 'Прямые контракты от ведущих мировых судовладельцев и операторов флота');

  // Hub section custom text draft state
  const [draftHubTitle, setDraftHubTitle] = useState(() => localStorage.getItem('fleetforce_hub_title') || 'Центр Загрузок и Информация для Моряков');
  const [draftHubSubtitle, setDraftHubSubtitle] = useState(() => localStorage.getItem('fleetforce_hub_subtitle') || 'Скачайте бланки анкет или пройдите подготовку к тестированию');

  // Offices section custom text draft state
  const [draftOfficesTitle, setDraftOfficesTitle] = useState(() => localStorage.getItem('fleetforce_offices_title') || 'Наши Офисы и Представительства');
  const [draftOfficesSubtitle, setDraftOfficesSubtitle] = useState(() => localStorage.getItem('fleetforce_offices_subtitle') || 'Сеть крюинговых центров в ключевых портовых городах');
  const [draftOfficesHours, setDraftOfficesHours] = useState(() => localStorage.getItem('fleetforce_offices_hours') || 'Часы работы: Пн-Пт 09:00 - 18:00 (МСК)');

  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Modals state inside editor
  const [vacancyModalOpen, setVacancyModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);

  const [officeModalOpen, setOfficeModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);

  const [hubModalOpen, setHubModalOpen] = useState(false);
  const [editingHubBlock, setEditingHubBlock] = useState(null);

  const DEFAULT_SHIPOWNER_TITLE = 'Услуги для Судовладельцев и Операторов';
  const DEFAULT_SHIPOWNER_SUBTITLE = 'Качественный подбор дипломированного командного и рядового состава';
  const DEFAULT_SERVICE1_TITLE = 'Подбор и комплектование экипажей';
  const DEFAULT_SERVICE1_DESC = 'Полная проверка рабочих дипломов, сертификатов, отзывов с предыдущих мест работы и проверка знания морского английского.';
  const DEFAULT_SERVICE2_TITLE = 'Технический и Кадровый аудит';
  const DEFAULT_SERVICE2_DESC = 'Содействие в оформлении флажных документов, визовой поддержке и логистике смены экипажей в любых портах мира.';
  const DEFAULT_SERVICE3_TITLE = 'Управление бюджетом crew-management';
  const DEFAULT_SERVICE3_DESC = 'Оптимизация расходов на смену команд, медицинское страхование и выплату заработной платы.';

  const DEFAULT_FOOTER_BRAND = 'Объединенный портал морских крюинговых агентств (FleetForce Alliance).';
  const DEFAULT_FOOTER_CERT = 'Соответствует стандартам Конвенции КТМС 2006 (MLC 2006) и ISO 9001:2015.';
  const DEFAULT_FOOTER_COPYRIGHT = '© 2026 FleetForce Alliance. Все права защищены. Объединенный портал крюинговых услуг FleetForce.';

  // Shipowner Services custom text draft state
  const [draftShipownerTitle, setDraftShipownerTitle] = useState(() => localStorage.getItem('fleetforce_shipowner_title') || DEFAULT_SHIPOWNER_TITLE);
  const [draftShipownerSubtitle, setDraftShipownerSubtitle] = useState(() => localStorage.getItem('fleetforce_shipowner_subtitle') || DEFAULT_SHIPOWNER_SUBTITLE);
  
  const [draftService1Title, setDraftService1Title] = useState(() => localStorage.getItem('fleetforce_service1_title') || DEFAULT_SERVICE1_TITLE);
  const [draftService1Desc, setDraftService1Desc] = useState(() => localStorage.getItem('fleetforce_service1_desc') || DEFAULT_SERVICE1_DESC);
  
  const [draftService2Title, setDraftService2Title] = useState(() => localStorage.getItem('fleetforce_service2_title') || DEFAULT_SERVICE2_TITLE);
  const [draftService2Desc, setDraftService2Desc] = useState(() => localStorage.getItem('fleetforce_service2_desc') || DEFAULT_SERVICE2_DESC);

  const [draftService3Title, setDraftService3Title] = useState(() => localStorage.getItem('fleetforce_service3_title') || DEFAULT_SERVICE3_TITLE);
  const [draftService3Desc, setDraftService3Desc] = useState(() => localStorage.getItem('fleetforce_service3_desc') || DEFAULT_SERVICE3_DESC);

  // Footer custom text state
  const [draftFooterBrandDesc, setDraftFooterBrandDesc] = useState(() => localStorage.getItem('fleetforce_footer_brand_desc') || DEFAULT_FOOTER_BRAND);
  const [draftFooterCertText, setDraftFooterCertText] = useState(() => localStorage.getItem('fleetforce_footer_cert_text') || DEFAULT_FOOTER_CERT);
  const [draftFooterCopyright, setDraftFooterCopyright] = useState(() => localStorage.getItem('fleetforce_footer_copyright') || DEFAULT_FOOTER_COPYRIGHT);

  // Initialize draft when editor opens
  useEffect(() => {
    if (isOpen) {
      setDraftVacancies(JSON.parse(JSON.stringify(liveVacancies)));
      setDraftOffices(JSON.parse(JSON.stringify(liveOffices)));
      setDraftHubBlocks(JSON.parse(JSON.stringify(liveHubBlocks)));
      setDraftStats(JSON.parse(JSON.stringify(liveStats)));
      setDraftSectionVisibility(JSON.parse(JSON.stringify(liveSectionVisibility)));
      setDraftHeroBadge(liveHeroBadge || 'Международный крюинговый альянс FLEET FORCE');
      setDraftHeroTitle(liveHeroTitle || 'Трудоустройство моряков на мировой торговый флот');
      setDraftHeroSubtitle(liveHeroSubtitle || 'Официальное трудоустройство, высокие ставки, стабильные контракты на танкерном, контейнерном, балкерном и офшорном флоте.');
      
      setDraftVacanciesTitle(liveVacanciesTitle || 'Актуальные Вакансии в Море');
      setDraftVacanciesSubtitle(liveVacanciesSubtitle || 'Прямые контракты от ведущих мировых судовладельцев и операторов флота');
      
      setDraftHubTitle(liveHubTitle || 'Центр Загрузок и Информация для Моряков');
      setDraftHubSubtitle(liveHubSubtitle || 'Скачайте бланки анкет или пройдите подготовку к тестированию');
      
      setDraftOfficesTitle(liveOfficesTitle || 'Наши Офисы и Представительства');
      setDraftOfficesSubtitle(liveOfficesSubtitle || 'Сеть крюинговых центров в ключевых портовых городах');

      setDraftShipownerTitle(liveShipownerTitle || DEFAULT_SHIPOWNER_TITLE);
      setDraftShipownerSubtitle(liveShipownerSubtitle || DEFAULT_SHIPOWNER_SUBTITLE);
      setDraftService1Title(localStorage.getItem('fleetforce_service1_title') || DEFAULT_SERVICE1_TITLE);
      setDraftService1Desc(localStorage.getItem('fleetforce_service1_desc') || DEFAULT_SERVICE1_DESC);
      setDraftService2Title(localStorage.getItem('fleetforce_service2_title') || DEFAULT_SERVICE2_TITLE);
      setDraftService2Desc(localStorage.getItem('fleetforce_service2_desc') || DEFAULT_SERVICE2_DESC);
      setDraftService3Title(localStorage.getItem('fleetforce_service3_title') || DEFAULT_SERVICE3_TITLE);
      setDraftService3Desc(localStorage.getItem('fleetforce_service3_desc') || DEFAULT_SERVICE3_DESC);

      setDraftFooterBrandDesc(localStorage.getItem('fleetforce_footer_brand_desc') || DEFAULT_FOOTER_BRAND);
      setDraftFooterCertText(localStorage.getItem('fleetforce_footer_cert_text') || DEFAULT_FOOTER_CERT);
      setDraftFooterCopyright(localStorage.getItem('fleetforce_footer_copyright') || DEFAULT_FOOTER_COPYRIGHT);
      setHasChanges(false);
    }
  }, [isOpen, liveVacancies, liveOffices, liveHubBlocks, liveStats, liveSectionVisibility, liveHeroBadge, liveHeroTitle, liveHeroSubtitle, liveVacanciesTitle, liveVacanciesSubtitle, liveHubTitle, liveHubSubtitle, liveOfficesTitle, liveOfficesSubtitle, liveShipownerTitle, liveShipownerSubtitle]);

  const markChanged = () => setHasChanges(true);

  if (!isOpen) return null;

  // Publish Draft -> Live
  const handlePublishAll = () => {
    localStorage.setItem('fleetforce_hero_badge', draftHeroBadge);
    localStorage.setItem('fleetforce_hero_title', draftHeroTitle);
    localStorage.setItem('fleetforce_hero_subtitle', draftHeroSubtitle);
    localStorage.setItem('fleetforce_vacancies_title', draftVacanciesTitle);
    localStorage.setItem('fleetforce_vacancies_subtitle', draftVacanciesSubtitle);
    localStorage.setItem('fleetforce_hub_title', draftHubTitle);
    localStorage.setItem('fleetforce_hub_subtitle', draftHubSubtitle);
    localStorage.setItem('fleetforce_offices_title', draftOfficesTitle);
    localStorage.setItem('fleetforce_offices_subtitle', draftOfficesSubtitle);
    localStorage.setItem('fleetforce_offices_hours', draftOfficesHours);

    localStorage.setItem('fleetforce_shipowner_title', draftShipownerTitle);
    localStorage.setItem('fleetforce_shipowner_subtitle', draftShipownerSubtitle);
    localStorage.setItem('fleetforce_service1_title', draftService1Title);
    localStorage.setItem('fleetforce_service1_desc', draftService1Desc);
    localStorage.setItem('fleetforce_service2_title', draftService2Title);
    localStorage.setItem('fleetforce_service2_desc', draftService2Desc);
    localStorage.setItem('fleetforce_service3_title', draftService3Title);
    localStorage.setItem('fleetforce_service3_desc', draftService3Desc);
    localStorage.setItem('fleetforce_footer_brand_desc', draftFooterBrandDesc);
    localStorage.setItem('fleetforce_footer_cert_text', draftFooterCertText);
    localStorage.setItem('fleetforce_footer_copyright', draftFooterCopyright);

    onPublish({
      vacancies: draftVacancies,
      offices: draftOffices,
      hubBlocks: draftHubBlocks,
      stats: draftStats,
      sectionVisibility: draftSectionVisibility,
      heroBadge: draftHeroBadge,
      heroTitle: draftHeroTitle,
      heroSubtitle: draftHeroSubtitle,
      vacanciesTitle: draftVacanciesTitle,
      vacanciesSubtitle: draftVacanciesSubtitle,
      hubTitle: draftHubTitle,
      hubSubtitle: draftHubSubtitle,
      officesTitle: draftOfficesTitle,
      officesSubtitle: draftOfficesSubtitle,
      shipownerTitle: draftShipownerTitle,
      shipownerSubtitle: draftShipownerSubtitle,
      service1Title: draftService1Title,
      service1Desc: draftService1Desc,
      service2Title: draftService2Title,
      service2Desc: draftService2Desc,
      service3Title: draftService3Title,
      service3Desc: draftService3Desc,
      footerBrandDesc: draftFooterBrandDesc,
      footerCertText: draftFooterCertText,
      footerCopyright: draftFooterCopyright
    });

    setHasChanges(false);
    alert('🚀 Поздравляем! Все изменения из черновика успешно опубликованы на главном сайте!');
  };

  // Auto-Save helper to immediately persist changes to SQLite DB
  const autoSave = (updatedData = {}) => {
    onPublish({
      vacancies: updatedData.vacancies || draftVacancies,
      offices: updatedData.offices || draftOffices,
      hubBlocks: updatedData.hubBlocks || draftHubBlocks,
      stats: updatedData.stats || draftStats,
      sectionVisibility: updatedData.sectionVisibility || draftSectionVisibility,
      heroBadge: updatedData.heroBadge ?? draftHeroBadge,
      heroTitle: updatedData.heroTitle ?? draftHeroTitle,
      heroSubtitle: updatedData.heroSubtitle ?? draftHeroSubtitle,
      vacanciesTitle: updatedData.vacanciesTitle ?? draftVacanciesTitle,
      vacanciesSubtitle: updatedData.vacanciesSubtitle ?? draftVacanciesSubtitle,
      hubTitle: updatedData.hubTitle ?? draftHubTitle,
      hubSubtitle: updatedData.hubSubtitle ?? draftHubSubtitle,
      officesTitle: updatedData.officesTitle ?? draftOfficesTitle,
      officesSubtitle: updatedData.officesSubtitle ?? draftOfficesSubtitle,
      shipownerTitle: updatedData.shipownerTitle ?? draftShipownerTitle,
      shipownerSubtitle: updatedData.shipownerSubtitle ?? draftShipownerSubtitle,
      service1Title: updatedData.service1Title ?? draftService1Title,
      service1Desc: updatedData.service1Desc ?? draftService1Desc,
      service2Title: updatedData.service2Title ?? draftService2Title,
      service2Desc: updatedData.service2Desc ?? draftService2Desc,
      service3Title: updatedData.service3Title ?? draftService3Title,
      service3Desc: updatedData.service3Desc ?? draftService3Desc,
      footerBrandDesc: updatedData.footerBrandDesc ?? draftFooterBrandDesc,
      footerCertText: updatedData.footerCertText ?? draftFooterCertText,
      footerCopyright: updatedData.footerCopyright ?? draftFooterCopyright
    });
    setHasChanges(false);
  };

  // --- Handlers for Vacancies ---
  const handleOpenAddVacancy = () => {
    setEditingVacancy(null);
    setVacancyModalOpen(true);
  };
  const handleOpenEditVacancy = (vac) => {
    setEditingVacancy(vac);
    setVacancyModalOpen(true);
  };
  const handleSaveVacancyModal = (vacData) => {
    const vacWithId = { ...vacData, id: vacData.id || Date.now() };
    setDraftVacancies(prev => {
      const isEdit = prev.some(v => v.id === vacWithId.id);
      const updated = isEdit ? prev.map(v => v.id === vacWithId.id ? vacWithId : v) : [vacWithId, ...prev];
      autoSave({ vacancies: updated });
      return updated;
    });
    setVacancyModalOpen(false);
  };
  const handleDeleteVacancy = (id) => {
    setDraftVacancies(prev => {
      const updated = prev.filter(v => v.id !== id);
      autoSave({ vacancies: updated });
      return updated;
    });
  };
  const handleToggleVacancyActive = (id) => {
    setDraftVacancies(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, active: v.active === false ? true : false } : v);
      autoSave({ vacancies: updated });
      return updated;
    });
  };

  // --- Handlers for Offices ---
  const handleOpenAddOffice = () => {
    setEditingOffice(null);
    setOfficeModalOpen(true);
  };
  const handleOpenEditOffice = (off) => {
    setEditingOffice(off);
    setOfficeModalOpen(true);
  };
  const handleSaveOfficeModal = (offData) => {
    const offWithId = { ...offData, id: offData.id || Date.now() };
    setDraftOffices(prev => {
      const isEdit = prev.some(o => o.id === offWithId.id);
      const updated = isEdit ? prev.map(o => o.id === offWithId.id ? offWithId : o) : [...prev, offWithId];
      autoSave({ offices: updated });
      return updated;
    });
    setOfficeModalOpen(false);
  };
  const handleDeleteOffice = (id) => {
    setDraftOffices(prev => {
      const updated = prev.filter(o => o.id !== id);
      autoSave({ offices: updated });
      return updated;
    });
  };
  const handleToggleOfficeActive = (id) => {
    setDraftOffices(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, active: o.active === false ? true : false } : o);
      autoSave({ offices: updated });
      return updated;
    });
  };

  // --- Handlers for Hub Blocks ---
  const handleOpenAddHub = () => {
    setEditingHubBlock(null);
    setHubModalOpen(true);
  };
  const handleOpenEditHub = (block) => {
    setEditingHubBlock(block);
    setHubModalOpen(true);
  };
  const handleSaveHubModal = (hubData) => {
    const hubWithId = { ...hubData, id: hubData.id || Date.now() };
    setDraftHubBlocks(prev => {
      const isEdit = prev.some(b => b.id === hubWithId.id);
      const updated = isEdit ? prev.map(b => b.id === hubWithId.id ? hubWithId : b) : [...prev, hubWithId];
      autoSave({ hubBlocks: updated });
      return updated;
    });
    setHubModalOpen(false);
  };
  const handleDeleteHubBlock = (id) => {
    setDraftHubBlocks(prev => {
      const updated = prev.filter(b => b.id !== id);
      autoSave({ hubBlocks: updated });
      return updated;
    });
  };
  const handleToggleHubActive = (id) => {
    setDraftHubBlocks(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, active: b.active === false ? true : false } : b);
      autoSave({ hubBlocks: updated });
      return updated;
    });
  };

  // --- Handlers for Section Visibility ---
  const handleToggleSection = (key) => {
    setDraftSectionVisibility(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      autoSave({ sectionVisibility: updated });
      return updated;
    });
  };

  // --- Handlers for Hero Stats ---
  const handleUpdateStatNum = (index, newNum) => {
    setDraftStats(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], number: newNum };
      autoSave({ stats: updated });
      return updated;
    });
  };

  const handleUpdateStatLabel = (index, newLabelRu, newLabelEn) => {
    setDraftStats(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        labelRu: newLabelRu,
        labelEn: newLabelEn || updated[index]?.labelEn || newLabelRu
      };
      autoSave({ stats: updated });
      return updated;
    });
  };

  const handleToggleStatActive = (id) => {
    setDraftStats(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, active: s.active === false ? true : false } : s);
      autoSave({ stats: updated });
      return updated;
    });
  };

  const handleDeleteStat = (id) => {
    if (!window.confirm('Вы действительно хотите удалить этот счётчик?')) return;
    setDraftStats(prev => {
      const updated = prev.filter(s => s.id !== id);
      autoSave({ stats: updated });
      return updated;
    });
  };

  const handleAddStat = () => {
    const num = prompt('Введите значение счётчика (например: 100+):', '100+');
    if (!num) return;
    const labelRu = prompt('Введите подпись счётчика (Русский):', 'Новый показатель');
    if (!labelRu) return;
    const labelEn = prompt('Введите подпись счётчика (English):', labelRu);

    const newStat = {
      id: String(Date.now()),
      number: num,
      labelRu: labelRu,
      labelEn: labelEn || labelRu,
      color: 'blue',
      active: true
    };

    setDraftStats(prev => {
      const updated = [...prev, newStat];
      autoSave({ stats: updated });
      return updated;
    });
  };

  return (
    <div className="site-editor-root" style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Top Control Toolbar */}
      <EditorToolbar
        onClose={onClose}
        autoSaveStatus="Автосохранение в базу данных активно"
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      />

      {/* Editor Banner Notice */}
      {!previewMode && (
        <div style={{ background: 'var(--color-accent-light)', borderBottom: '1px solid var(--border-glow)', padding: '0.6rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-accent)', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem' }}>
          <Sparkles size={16} />
          <span>Вы находитесь в режиме редактирования. Нажимайте на текст для изменения или используйте кнопки ✏️, 👁️ и 🗑️ на карточках. Все правки сохраняются автоматически!</span>
        </div>
      )}

      <div className={previewMode ? 'preview-active' : 'editor-active'}>
        
        {/* 1. HERO SECTION */}
        <EditorHeroSection
          previewMode={previewMode}
          draftSectionVisibility={draftSectionVisibility}
          handleToggleSection={handleToggleSection}
          draftStats={draftStats}
          handleAddStat={handleAddStat}
          handleToggleStatActive={handleToggleStatActive}
          handleUpdateStatNum={handleUpdateStatNum}
          handleUpdateStatLabel={handleUpdateStatLabel}
          handleDeleteStat={handleDeleteStat}
          draftHeroBadge={draftHeroBadge}
          setDraftHeroBadge={setDraftHeroBadge}
          draftHeroTitle={draftHeroTitle}
          setDraftHeroTitle={setDraftHeroTitle}
          draftHeroSubtitle={draftHeroSubtitle}
          setDraftHeroSubtitle={setDraftHeroSubtitle}
          markChanged={markChanged}
        />

        {/* 2. VACANCIES SECTION */}
        <EditorVacanciesSection
          previewMode={previewMode}
          draftSectionVisibility={draftSectionVisibility}
          handleToggleSection={handleToggleSection}
          draftVacancies={draftVacancies}
          handleOpenAddVacancy={handleOpenAddVacancy}
          draftVacanciesTitle={draftVacanciesTitle}
          setDraftVacanciesTitle={setDraftVacanciesTitle}
          draftVacanciesSubtitle={draftVacanciesSubtitle}
          setDraftVacanciesSubtitle={setDraftVacanciesSubtitle}
          handleOpenEditVacancy={handleOpenEditVacancy}
          handleDeleteVacancy={handleDeleteVacancy}
          handleToggleVacancyActive={handleToggleVacancyActive}
          markChanged={markChanged}
        />

        {/* 3. SEAFARER HUB SECTION */}
        <EditorHubSection
          previewMode={previewMode}
          draftSectionVisibility={draftSectionVisibility}
          handleToggleSection={handleToggleSection}
          draftHubBlocks={draftHubBlocks}
          handleOpenAddHub={handleOpenAddHub}
          draftHubTitle={draftHubTitle}
          setDraftHubTitle={setDraftHubTitle}
          draftHubSubtitle={draftHubSubtitle}
          setDraftHubSubtitle={setDraftHubSubtitle}
          handleOpenEditHub={handleOpenEditHub}
          handleDeleteHubBlock={handleDeleteHubBlock}
          handleToggleHubActive={handleToggleHubActive}
          markChanged={markChanged}
        />

        {/* 4. SHIPOWNER SERVICES SECTION */}
        <EditorShipownerSection
          previewMode={previewMode}
          draftSectionVisibility={draftSectionVisibility}
          handleToggleSection={handleToggleSection}
          draftShipownerTitle={draftShipownerTitle}
          setDraftShipownerTitle={setDraftShipownerTitle}
          draftShipownerSubtitle={draftShipownerSubtitle}
          setDraftShipownerSubtitle={setDraftShipownerSubtitle}
          draftService1Title={draftService1Title}
          setDraftService1Title={setDraftService1Title}
          draftService1Desc={draftService1Desc}
          setDraftService1Desc={setDraftService1Desc}
          draftService2Title={draftService2Title}
          setDraftService2Title={setDraftService2Title}
          draftService2Desc={draftService2Desc}
          setDraftService2Desc={setDraftService2Desc}
          draftService3Title={draftService3Title}
          setDraftService3Title={setDraftService3Title}
          draftService3Desc={draftService3Desc}
          setDraftService3Desc={setDraftService3Desc}
          markChanged={markChanged}
        />

        {/* 5. OFFICES & CONTACTS SECTION */}
        <EditorOfficesSection
          previewMode={previewMode}
          draftSectionVisibility={draftSectionVisibility}
          handleToggleSection={handleToggleSection}
          draftOffices={draftOffices}
          handleOpenAddOffice={handleOpenAddOffice}
          draftOfficesTitle={draftOfficesTitle}
          setDraftOfficesTitle={setDraftOfficesTitle}
          draftOfficesSubtitle={draftOfficesSubtitle}
          setDraftOfficesSubtitle={setDraftOfficesSubtitle}
          draftOfficesHours={draftOfficesHours}
          setDraftOfficesHours={setDraftOfficesHours}
          handleOpenEditOffice={handleOpenEditOffice}
          handleDeleteOffice={handleDeleteOffice}
          handleToggleOfficeActive={handleToggleOfficeActive}
          markChanged={markChanged}
        />

        {/* 6. FOOTER SECTION */}
        <EditorFooterSection
          previewMode={previewMode}
          draftFooterBrandDesc={draftFooterBrandDesc}
          setDraftFooterBrandDesc={setDraftFooterBrandDesc}
          draftFooterCertText={draftFooterCertText}
          setDraftFooterCertText={setDraftFooterCertText}
          draftFooterCopyright={draftFooterCopyright}
          setDraftFooterCopyright={setDraftFooterCopyright}
          markChanged={markChanged}
        />

      </div>

      {/* Editor Modals */}
      <VacancyFormModal
        isOpen={vacancyModalOpen}
        onClose={() => setVacancyModalOpen(false)}
        onSave={handleSaveVacancyModal}
        editingVacancy={editingVacancy}
      />

      <OfficeFormModal
        isOpen={officeModalOpen}
        onClose={() => setOfficeModalOpen(false)}
        onSave={handleSaveOfficeModal}
        editingOffice={editingOffice}
      />

      <HubBlockFormModal
        isOpen={hubModalOpen}
        onClose={() => setHubModalOpen(false)}
        onSave={handleSaveHubModal}
        editingBlock={editingHubBlock}
      />

    </div>
  );
};

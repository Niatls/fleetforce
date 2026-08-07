import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft, Rocket, RefreshCw, Eye, EyeOff, Plus, CheckCircle2,
  AlertCircle, Sparkles, Layout, Settings, Edit3, Layers, Anchor
} from 'lucide-react';

import { Navbar } from '../Navbar';
import { Hero } from '../Hero';
import { VacancyList } from '../VacancyList';
import { SeafarerHub } from '../SeafarerHub';
import { ShipownerServices } from '../ShipownerServices';
import { OfficesAndContacts } from '../OfficesAndContacts';
import { Footer } from '../Footer';

import { EditOverlay } from './EditOverlay';
import { InlineText } from './InlineText';
import { VacancyFormModal } from './VacancyFormModal';
import { OfficeFormModal } from './OfficeFormModal';
import { HubBlockFormModal } from './HubBlockFormModal';

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
  liveShipownerSubtitle = ''
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

  // Track if changes exist compared to live
  const markChanged = () => setHasChanges(true);

  if (!isOpen) return null;

  // Reset draft to current live state
  const handleResetDraft = () => {
    if (window.confirm('Сбросить все несохранённые изменения в черновике и вернуть исходное состояние сайта?')) {
      setDraftVacancies(JSON.parse(JSON.stringify(liveVacancies)));
      setDraftOffices(JSON.parse(JSON.stringify(liveOffices)));
      setDraftHubBlocks(JSON.parse(JSON.stringify(liveHubBlocks)));
      setDraftStats(JSON.parse(JSON.stringify(liveStats)));
      setDraftSectionVisibility(JSON.parse(JSON.stringify(liveSectionVisibility)));
      setDraftHeroTitle(liveHeroTitle || 'Трудоустройство моряков на мировой торговый флот');
      setDraftHeroSubtitle(liveHeroSubtitle || 'Официальное трудоустройство, высокие ставки, стабильные контракты на танкерном, контейнерном, балкерном и офшорном флоте.');

      setDraftShipownerTitle(DEFAULT_SHIPOWNER_TITLE);
      setDraftShipownerSubtitle(DEFAULT_SHIPOWNER_SUBTITLE);
      setDraftService1Title(DEFAULT_SERVICE1_TITLE);
      setDraftService1Desc(DEFAULT_SERVICE1_DESC);
      setDraftService2Title(DEFAULT_SERVICE2_TITLE);
      setDraftService2Desc(DEFAULT_SERVICE2_DESC);
      setDraftService3Title(DEFAULT_SERVICE3_TITLE);
      setDraftService3Desc(DEFAULT_SERVICE3_DESC);

      setDraftFooterBrandDesc(DEFAULT_FOOTER_BRAND);
      setDraftFooterCertText(DEFAULT_FOOTER_CERT);
      setDraftFooterCopyright(DEFAULT_FOOTER_COPYRIGHT);
      setHasChanges(false);
    }
  };

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
    if (editingVacancy) {
      setDraftVacancies(prev => prev.map(v => v.id === vacData.id ? vacData : v));
    } else {
      setDraftVacancies(prev => [vacData, ...prev]);
    }
    markChanged();
    setVacancyModalOpen(false);
  };
  const handleDeleteVacancy = (id) => {
    setDraftVacancies(prev => prev.filter(v => v.id !== id));
    markChanged();
  };
  const handleToggleVacancyActive = (id) => {
    setDraftVacancies(prev => prev.map(v => v.id === id ? { ...v, active: v.active === false } : v));
    markChanged();
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
    if (editingOffice) {
      setDraftOffices(prev => prev.map(o => o.id === offData.id ? offData : o));
    } else {
      setDraftOffices(prev => [...prev, offData]);
    }
    markChanged();
    setOfficeModalOpen(false);
  };
  const handleDeleteOffice = (id) => {
    setDraftOffices(prev => prev.filter(o => o.id !== id));
    markChanged();
  };
  const handleToggleOfficeActive = (id) => {
    setDraftOffices(prev => prev.map(o => o.id === id ? { ...o, active: o.active === false } : o));
    markChanged();
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
    if (editingHubBlock) {
      setDraftHubBlocks(prev => prev.map(b => b.id === hubData.id ? hubData : b));
    } else {
      setDraftHubBlocks(prev => [...prev, hubData]);
    }
    markChanged();
    setHubModalOpen(false);
  };
  const handleDeleteHubBlock = (id) => {
    setDraftHubBlocks(prev => prev.filter(b => b.id !== id));
    markChanged();
  };
  const handleToggleHubActive = (id) => {
    setDraftHubBlocks(prev => prev.map(b => b.id === id ? { ...b, active: b.active === false } : b));
    markChanged();
  };

  // --- Handlers for Section Visibility ---
  const handleToggleSection = (key) => {
    setDraftSectionVisibility(prev => ({ ...prev, [key]: !prev[key] }));
    markChanged();
  };

  // --- Handlers for Hero Stats ---
  const handleUpdateStatNum = (index, newNum) => {
    setDraftStats(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], number: newNum };
      return updated;
    });
    markChanged();
  };

  const handleUpdateStatLabel = (index, newLabel) => {
    setDraftStats(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], labelRu: newLabel, labelEn: newLabel };
      return updated;
    });
    markChanged();
  };

  return (
    <div className="site-editor-root" style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* 🚀 Top Control Toolbar (Fixed) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9990,
          background: 'rgba(11, 19, 41, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-accent)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} /> Выйти в Админку
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Edit3 size={14} /> ВИЗУАЛЬНЫЙ РЕДАКТОР СТАЙТА
            </span>
            
            {hasChanges ? (
              <span style={{ fontSize: '0.8rem', color: '#eab308', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <AlertCircle size={14} /> Есть несохранённые правки в черновике
              </span>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Черновик совпадает с сайтом
              </span>
            )}
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`btn btn-sm ${previewMode ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{previewMode ? 'Выйти из Предпросмотра' : '👁️ Предпросмотр (как у гостей)'}</span>
          </button>

          {hasChanges && (
            <button
              type="button"
              onClick={handleResetDraft}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.4)' }}
            >
              <RefreshCw size={14} /> Сбросить черновик
            </button>
          )}

          <button
            type="button"
            onClick={handlePublishAll}
            className="btn btn-accent btn-lg"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(0,139,255,0.4)'
            }}
          >
            <Rocket size={18} />
            <span>🚀 Опубликовать на сайт</span>
          </button>
        </div>
      </header>

      {/* Editor Banner Notice */}
      {!previewMode && (
        <div style={{ background: 'rgba(0, 139, 255, 0.15)', borderBottom: '1px solid rgba(0, 139, 255, 0.3)', padding: '0.6rem 1.5rem', fontSize: '0.85rem', color: '#38bdf8', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem' }}>
          <Sparkles size={16} />
          <span>Вы находитесь в режиме редактирования черновика. Нажимайте на текст для изменения, используйте кнопки ✏️ и 🗑️ на карточках. Готовые правки опубликуйте кнопкой сверху.</span>
        </div>
      )}
      <div className={previewMode ? 'preview-active' : 'editor-active'}>
        
        {/* TOP NAVBAR (Full Page Copy) */}
        <Navbar 
          onOpenWizard={() => {}} 
          onOpenAdmin={() => {}} 
          activeSection="hero" 
          setActiveSection={() => {}} 
        />

        {/* 1. HERO SECTION */}
        {draftSectionVisibility.hero === false ? (
          !previewMode && (
            <div style={{ margin: '1rem 2rem 2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
                <EyeOff size={20} color="var(--color-danger)" />
                <span><strong>Секция «Hero (Главный баннер)» сейчас скрыта</strong> и не отображается на сайте.</span>
              </div>
              <button onClick={() => handleToggleSection('hero')} className="btn btn-primary btn-sm">
                <Eye size={14} /> Включить и показать секцию Hero
              </button>
            </div>
          )
        ) : (
          <section style={{ position: 'relative' }}>
            {!previewMode && (
              <div style={{ position: 'absolute', top: '15px', left: '20px', zIndex: 40 }}>
                <button
                  onClick={() => handleToggleSection('hero')}
                  className="btn btn-secondary btn-sm"
                  style={{ background: 'rgba(11, 19, 41, 0.9)' }}
                >
                  <EyeOff size={14} /> Скрыть секцию Hero
                </button>
              </div>
            )}
            
            <Hero
              stats={draftStats}
              customBadge={
                !previewMode ? (
                  <InlineText
                    value={draftHeroBadge}
                    onChange={(val) => { setDraftHeroBadge(val); markChanged(); }}
                    tag="span"
                  />
                ) : draftHeroBadge
              }
              customTitle={
                !previewMode ? (
                  <InlineText
                    value={draftHeroTitle}
                    onChange={(val) => { setDraftHeroTitle(val); markChanged(); }}
                    tag="span"
                  />
                ) : draftHeroTitle
              }
              customSubtitle={
                !previewMode ? (
                  <InlineText
                    value={draftHeroSubtitle}
                    onChange={(val) => { setDraftHeroSubtitle(val); markChanged(); }}
                    tag="span"
                    multiline
                  />
                ) : draftHeroSubtitle
              }
              renderStatItem={(statItem, idx) => {
                if (previewMode) return null;
                return (
                  <EditOverlay
                    key={statItem.id || idx}
                    title={`Счётчик #${idx + 1}`}
                    onEdit={() => {
                      const newNum = prompt('Введите значение счётчика:', statItem.number);
                      if (newNum !== null) handleUpdateStatNum(idx, newNum);
                      const newLabel = prompt('Введите подпись счётчика:', statItem.labelRu);
                      if (newLabel !== null) handleUpdateStatLabel(idx, newLabel);
                    }}
                    isEditingEnabled={!previewMode}
                  >
                    <div style={{ padding: '0.5rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent)' }}>{statItem.number}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{statItem.labelRu}</div>
                    </div>
                  </EditOverlay>
                );
              }}
            />
          </section>
        )}

        {/* 2. VACANCIES SECTION */}
        {draftSectionVisibility.vacancies === false ? (
          !previewMode && (
            <div style={{ margin: '2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
                <EyeOff size={20} color="var(--color-danger)" />
                <span><strong>Секция «ВАКАНСИИ» сейчас скрыта</strong> и не отображается на сайте.</span>
              </div>
              <button onClick={() => handleToggleSection('vacancies')} className="btn btn-primary btn-sm">
                <Eye size={14} /> Включить и показать вакансии
              </button>
            </div>
          )
        ) : (
          <section style={{ position: 'relative', marginTop: '2rem' }}>
            {!previewMode && (
              <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-gold">СЕКЦИЯ ВАКАНСИЙ</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Всего: {draftVacancies.length}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={handleOpenAddVacancy} className="btn btn-primary btn-sm">
                    <Plus size={16} /> + Добавить Вакансию
                  </button>
                  <button onClick={() => handleToggleSection('vacancies')} className="btn btn-secondary btn-sm">
                    <EyeOff size={14} /> Скрыть вакансии
                  </button>
                </div>
              </div>
            )}

            <VacancyList
              vacancies={draftVacancies}
              customTitle={
                !previewMode ? (
                  <InlineText
                    value={draftVacanciesTitle}
                    onChange={(val) => { setDraftVacanciesTitle(val); markChanged(); }}
                    tag="span"
                  />
                ) : draftVacanciesTitle
              }
              customSubtitle={
                !previewMode ? (
                  <InlineText
                    value={draftVacanciesSubtitle}
                    onChange={(val) => { setDraftVacanciesSubtitle(val); markChanged(); }}
                    tag="span"
                    multiline
                  />
                ) : draftVacanciesSubtitle
              }
              renderVacancyCard={(vac, defaultCardNode) => {
                if (previewMode) return defaultCardNode;
                return (
                  <EditOverlay
                    key={vac.id}
                    isActive={vac.active !== false}
                    onEdit={() => handleOpenEditVacancy(vac)}
                    onDelete={() => handleDeleteVacancy(vac.id)}
                    onToggleActive={() => handleToggleVacancyActive(vac.id)}
                    isEditingEnabled={!previewMode}
                  >
                    {defaultCardNode}
                  </EditOverlay>
                );
              }}
            />
          </section>
        )}

        {/* 3. SEAFARER HUB SECTION */}
        {draftSectionVisibility.hub === false ? (
          !previewMode && (
            <div style={{ margin: '2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
                <EyeOff size={20} color="var(--color-danger)" />
                <span><strong>Секция «МО РЯКАМ / HUB» сейчас скрыта</strong> и не отображается на сайте.</span>
              </div>
              <button onClick={() => handleToggleSection('hub')} className="btn btn-primary btn-sm">
                <Eye size={14} /> Включить и показать Hub
              </button>
            </div>
          )
        ) : (
          <section style={{ position: 'relative', marginTop: '3rem' }}>
            {!previewMode && (
              <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-gold">SEAFARER HUB (БЛАНКИ И МАТЕРИАЛЫ)</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Всего блоков: {draftHubBlocks.length}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={handleOpenAddHub} className="btn btn-primary btn-sm">
                    <Plus size={16} /> + Добавить Блок
                  </button>
                  <button onClick={() => handleToggleSection('hub')} className="btn btn-secondary btn-sm">
                    <EyeOff size={14} /> Скрыть Hub
                  </button>
                </div>
              </div>
            )}

            <SeafarerHub
              hubBlocks={draftHubBlocks}
              customTitle={
                !previewMode ? (
                  <InlineText
                    value={draftHubTitle}
                    onChange={(val) => { setDraftHubTitle(val); markChanged(); }}
                    tag="span"
                  />
                ) : draftHubTitle
              }
              customSubtitle={
                !previewMode ? (
                  <InlineText
                    value={draftHubSubtitle}
                    onChange={(val) => { setDraftHubSubtitle(val); markChanged(); }}
                    tag="span"
                    multiline
                  />
                ) : draftHubSubtitle
              }
              renderBlockItem={(block, defaultBlockNode) => {
                if (previewMode) return defaultBlockNode;
                return (
                  <EditOverlay
                    key={block.id}
                    isActive={block.active !== false}
                    onEdit={() => handleOpenEditHub(block)}
                    onDelete={() => handleDeleteHubBlock(block.id)}
                    onToggleActive={() => handleToggleHubActive(block.id)}
                    isEditingEnabled={!previewMode}
                  >
                    {defaultBlockNode}
                  </EditOverlay>
                );
              }}
            />
          </section>
        )}

        {/* 4. SHIPOWNER SERVICES SECTION */}
        {draftSectionVisibility.shipowners === false ? (
          !previewMode && (
            <div style={{ margin: '2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
                <EyeOff size={20} color="var(--color-danger)" />
                <span><strong>Секция «СУДОВЛАДЕЛЬЦАМ» сейчас скрыта</strong> и не отображается на сайте.</span>
              </div>
              <button onClick={() => handleToggleSection('shipowners')} className="btn btn-primary btn-sm">
                <Eye size={14} /> Включить и показать секцию Судовладельцам
              </button>
            </div>
          )
        ) : (
          <section style={{ position: 'relative', marginTop: '3rem' }}>
            {!previewMode && (
              <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-gold">СУДОВЛАДЕЛЬЦАМ (УСЛУГИ И ЗАЯВКИ)</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>✏️ Кликните по заголовкам и карточкам для редактирования</span>
                </div>
                <button onClick={() => handleToggleSection('shipowners')} className="btn btn-secondary btn-sm">
                  <EyeOff size={14} /> Скрыть форму для судовладельцев
                </button>
              </div>
            )}
            <ShipownerServices 
              customTitle={
                previewMode ? draftShipownerTitle : (
                  <InlineText 
                    text={draftShipownerTitle}
                    onSave={(val) => { setDraftShipownerTitle(val); markChanged(); }}
                    placeholder="Заголовок услуг для судовладельцев..."
                  />
                )
              }
              customSubtitle={
                previewMode ? draftShipownerSubtitle : (
                  <InlineText 
                    text={draftShipownerSubtitle}
                    onSave={(val) => { setDraftShipownerSubtitle(val); markChanged(); }}
                    multiline
                    placeholder="Подзаголовок услуг..."
                  />
                )
              }
              customCard1Title={
                previewMode ? draftService1Title : (
                  <InlineText 
                    text={draftService1Title}
                    onSave={(val) => { setDraftService1Title(val); markChanged(); }}
                    placeholder="Название услуги 1..."
                  />
                )
              }
              customCard1Desc={
                previewMode ? draftService1Desc : (
                  <InlineText 
                    text={draftService1Desc}
                    onSave={(val) => { setDraftService1Desc(val); markChanged(); }}
                    multiline
                    placeholder="Описание услуги 1..."
                  />
                )
              }
              customCard2Title={
                previewMode ? draftService2Title : (
                  <InlineText 
                    text={draftService2Title}
                    onSave={(val) => { setDraftService2Title(val); markChanged(); }}
                    placeholder="Название услуги 2..."
                  />
                )
              }
              customCard2Desc={
                previewMode ? draftService2Desc : (
                  <InlineText 
                    text={draftService2Desc}
                    onSave={(val) => { setDraftService2Desc(val); markChanged(); }}
                    multiline
                    placeholder="Описание услуги 2..."
                  />
                )
              }
              customCard3Title={
                previewMode ? draftService3Title : (
                  <InlineText 
                    text={draftService3Title}
                    onSave={(val) => { setDraftService3Title(val); markChanged(); }}
                    placeholder="Название услуги 3..."
                  />
                )
              }
              customCard3Desc={
                previewMode ? draftService3Desc : (
                  <InlineText 
                    text={draftService3Desc}
                    onSave={(val) => { setDraftService3Desc(val); markChanged(); }}
                    multiline
                    placeholder="Описание услуги 3..."
                  />
                )
              }
            />
          </section>
        )}

        {/* 5. OFFICES & CONTACTS SECTION */}
        {draftSectionVisibility.offices === false ? (
          !previewMode && (
            <div style={{ margin: '2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
                <EyeOff size={20} color="var(--color-danger)" />
                <span><strong>Секция «ФИЛИАЛЫ И КОНТАКТЫ» сейчас скрыта</strong> и не отображается на сайте.</span>
              </div>
              <button onClick={() => handleToggleSection('offices')} className="btn btn-primary btn-sm">
                <Eye size={14} /> Включить и показать филиалы
              </button>
            </div>
          )
        ) : (
          <section style={{ position: 'relative', marginTop: '3rem' }}>
            {!previewMode && (
              <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-gold">ФИЛИАЛЫ И КОНТАКТЫ</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Всего офисов: {draftOffices.length}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={handleOpenAddOffice} className="btn btn-primary btn-sm">
                    <Plus size={16} /> + Добавить Филиал
                  </button>
                  <button onClick={() => handleToggleSection('offices')} className="btn btn-secondary btn-sm">
                    <EyeOff size={14} /> Скрыть филиалы
                  </button>
                </div>
              </div>
            )}

            <OfficesAndContacts
              offices={draftOffices}
              customTitle={
                !previewMode ? (
                  <InlineText
                    value={draftOfficesTitle}
                    onChange={(val) => { setDraftOfficesTitle(val); markChanged(); }}
                    tag="span"
                  />
                ) : draftOfficesTitle
              }
              customSubtitle={
                !previewMode ? (
                  <InlineText
                    value={draftOfficesSubtitle}
                    onChange={(val) => { setDraftOfficesSubtitle(val); markChanged(); }}
                    tag="span"
                    multiline
                  />
                ) : draftOfficesSubtitle
              }
              renderEditableHours={
                !previewMode ? (
                  <InlineText
                    value={draftOfficesHours}
                    onChange={(val) => { setDraftOfficesHours(val); markChanged(); }}
                    tag="span"
                  />
                ) : draftOfficesHours
              }
              renderOfficeCard={(off, defaultOfficeNode) => {
                if (previewMode) return defaultOfficeNode;
                return (
                  <EditOverlay
                    key={off.id}
                    isActive={off.active !== false}
                    onEdit={() => handleOpenEditOffice(off)}
                    onDelete={() => handleDeleteOffice(off.id)}
                    onToggleActive={() => handleToggleOfficeActive(off.id)}
                    isEditingEnabled={!previewMode}
                  >
                    {defaultOfficeNode}
                  </EditOverlay>
                );
              }}
            />
          </section>
        )}

        {/* FOOTER (Full Page Copy with Editable Text) */}
        <section style={{ position: 'relative', marginTop: '2rem' }}>
          {!previewMode && (
            <div style={{ padding: '0.5rem 2rem', background: 'rgba(0,139,255,0.05)', borderTop: '1px dashed var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-gold">ПОДВАЛ САЙТА (FOOTER)</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>✏️ Кликните по текстам описания, сертификатов и копирайта для редактирования</span>
            </div>
          )}
          <Footer 
            onOpenAdmin={() => {}}
            customBrandDesc={
              previewMode ? draftFooterBrandDesc : (
                <InlineText 
                  text={draftFooterBrandDesc}
                  onSave={(val) => { setDraftFooterBrandDesc(val); markChanged(); }}
                  multiline
                  placeholder="Описание компании в подвале..."
                />
              )
            }
            customCertText={
              previewMode ? draftFooterCertText : (
                <InlineText 
                  text={draftFooterCertText}
                  onSave={(val) => { setDraftFooterCertText(val); markChanged(); }}
                  multiline
                  placeholder="Текст сертификации..."
                />
              )
            }
            customCopyright={
              previewMode ? draftFooterCopyright : (
                <InlineText 
                  text={draftFooterCopyright}
                  onSave={(val) => { setDraftFooterCopyright(val); markChanged(); }}
                  multiline
                  placeholder="Текст авторских прав..."
                />
              )
            }
          />
        </section>

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

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Anchor, Phone, Globe, Lock, Menu, X, FileText, Briefcase, Building2, Users } from 'lucide-react';

export const Navbar = ({ onOpenWizard, onOpenAdmin, activeSection, setActiveSection }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-wrapper" style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: 'rgba(6, 13, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('hero')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #008BFF 0%, #004499 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 139, 255, 0.4)'
          }}>
            <Anchor size={24} color="#FFFFFF" />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Fleet<span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'var(--color-accent)' }}>Force</span>
            </span>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Crewing Alliance
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
          <button 
            onClick={() => handleNavClick('vacancies')}
            className={`nav-link ${activeSection === 'vacancies' ? 'active' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              color: activeSection === 'vacancies' ? 'var(--color-accent)' : 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <Briefcase size={16} />
            {t('nav.vacancies')}
          </button>

          <button 
            onClick={() => onOpenWizard()}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gold)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <FileText size={16} />
            {t('nav.application')}
          </button>

          <button 
            onClick={() => handleNavClick('shipowners')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Building2 size={16} />
            {t('nav.shipowners')}
          </button>

          <button 
            onClick={() => handleNavClick('offices')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Users size={16} />
            {t('nav.offices')}
          </button>
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="btn btn-secondary btn-sm"
            title="Switch Language (RU / EN)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Globe size={15} color="var(--color-accent)" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t('nav.langSwitch')}</span>
          </button>

          {/* Hotline Button */}
          <a 
            href="tel:+78005553535" 
            className="btn btn-secondary btn-sm hotline-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Phone size={14} color="var(--color-emerald)" />
            <span style={{ fontSize: '0.82rem' }}>{t('nav.hotline')}</span>
          </a>

          {/* Admin Panel Button */}
          <button 
            onClick={onOpenAdmin}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Lock size={14} />
            <span>{t('nav.adminLogin')}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <button onClick={() => handleNavClick('vacancies')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Briefcase size={16} /> {t('nav.vacancies')}
          </button>
          <button onClick={() => { onOpenWizard(); setMobileMenuOpen(false); }} className="btn btn-accent" style={{ justifyContent: 'flex-start' }}>
            <FileText size={16} /> {t('nav.application')}
          </button>
          <button onClick={() => handleNavClick('shipowners')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Building2 size={16} /> {t('nav.shipowners')}
          </button>
          <button onClick={() => handleNavClick('offices')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Users size={16} /> {t('nav.offices')}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav, .hotline-btn {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

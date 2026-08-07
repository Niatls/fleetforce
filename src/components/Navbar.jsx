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
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '84px',
        maxWidth: '1280px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('hero')} 
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(2, 132, 199, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <img src="/favicon.png" alt="FleetForce Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.55rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Fleet<span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'var(--color-accent)' }}>Force</span>
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>
              Crewing Alliance
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links & Action Controls (Equal Spacing Alignment) */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Vertical Separator between Logo and Navigation */}
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.2rem' }} />

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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            <Briefcase size={16} />
            <span>{t('nav.vacancies')}</span>
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            <FileText size={16} />
            <span>{t('nav.application')}</span>
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Building2 size={16} />
            <span>{t('nav.shipowners')}</span>
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Users size={16} />
            <span>{t('nav.offices')}</span>
          </button>

          {/* Separator line for visual structure */}
          <div style={{ width: '1px', height: '22px', background: 'var(--border-color)', margin: '0 0.2rem' }} />

          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="btn btn-secondary btn-sm"
            title="Switch Language (RU / EN)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              whiteSpace: 'nowrap'
            }}
          >
            <Globe size={15} color="var(--color-accent)" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t('nav.langSwitch')}</span>
          </button>

          {/* Hotline Button */}
          <a 
            href="https://t.me/AtanMartin" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm hotline-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.85rem', whiteSpace: 'nowrap', textDecoration: 'none' }}
          >
            <Phone size={15} color="var(--color-emerald)" />
            <span style={{ fontSize: '0.85rem' }}>{t('nav.hotline')}</span>
          </a>

          {/* Admin Panel Button */}
          <a 
            href="#/admin"
            onClick={(e) => {
              e.preventDefault();
              onOpenAdmin();
            }}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.95rem', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            <Lock size={15} />
            <span>{t('nav.adminLogin')}</span>
          </a>
        </div>

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
          <a href="#/admin" onClick={(e) => { e.preventDefault(); onOpenAdmin(); setMobileMenuOpen(false); }} className="btn btn-primary" style={{ justifyContent: 'flex-start', textDecoration: 'none' }}>
            <Lock size={16} /> {t('nav.adminLogin')}
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 1120px) {
          .desktop-nav {
            gap: 0.8rem !important;
          }
        }
        @media (max-width: 992px) {
          .desktop-nav {
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

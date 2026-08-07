import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Anchor, ShieldCheck, Lock } from 'lucide-react';

export const Footer = ({ 
  onOpenAdmin,
  customBrandDesc,
  customCertText,
  customCopyright
}) => {
  const { lang, t } = useLanguage();

  return (
    <footer style={{
      background: 'var(--bg-main)',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                boxShadow: '0 0 10px rgba(0, 139, 255, 0.3)'
              }}>
                <img src="/favicon.png" alt="FleetForce Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Fleet<span style={{ color: 'var(--color-accent)' }}>Force</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              {(lang === 'ru' && customBrandDesc !== undefined) ? customBrandDesc : t('footer.brandDesc')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>MLC 2006 & ISO 9001 Certified</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1rem' }}>{t('footer.navTitle')}</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem' }}>
              <li><a href="#vacancies">{t('nav.vacancies')}</a></li>
              <li><a href="#seafarers">{t('nav.application')}</a></li>
              <li><a href="#shipowners">{t('nav.shipowners')}</a></li>
              <li><a href="#offices">{t('nav.offices')}</a></li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1rem' }}>{t('footer.certTitle')}</h4>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {(lang === 'ru' && customCertText !== undefined) ? customCertText : t('footer.compliance')}
            </p>
            <a 
              href="#/admin"
              onClick={(e) => {
                e.preventDefault();
                onOpenAdmin();
              }}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none'
              }}
            >
              <Lock size={12} /> {t('admin.portalTitle')}
            </a>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem'
        }}>
          <div>
            {(lang === 'ru' && customCopyright !== undefined) ? customCopyright : `© 2026 FleetForce Alliance. ${t('footer.rights')}`}
          </div>
          <div><a href="#hero">{t('footer.privacy')}</a></div>
        </div>
      </div>
    </footer>
  );
};

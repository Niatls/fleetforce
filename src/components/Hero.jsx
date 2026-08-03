import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, ShieldCheck, FileText, ChevronRight, Anchor, Award, Users, Ship } from 'lucide-react';
import { MARITIME_RANKS, VESSEL_TYPES, getRankLabel, getVesselLabel, INITIAL_STATS } from '../data/initialData';

export const Hero = ({ onSearch, onOpenWizard, stats = INITIAL_STATS, customTitle, customSubtitle, renderStatItem }) => {
  const { lang, t } = useLanguage();
  const [selectedRank, setSelectedRank] = useState('');
  const [selectedVessel, setSelectedVessel] = useState('');

  const statsList = stats && stats.length > 0 ? stats : INITIAL_STATS;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ rank: selectedRank, vesselType: selectedVessel });
    const vacanciesSection = document.getElementById('vacancies');
    if (vacanciesSection) {
      vacanciesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStatColor = (colorStr) => {
    if (colorStr === 'emerald') return 'var(--color-emerald)';
    if (colorStr === 'gold') return 'var(--color-gold)';
    if (colorStr === 'danger') return 'var(--color-danger)';
    if (colorStr === 'white') return '#FFFFFF';
    return 'var(--color-accent)';
  };

  return (
    <section id="hero" style={{
      position: 'relative',
      padding: '5rem 0 4rem',
      background: 'radial-gradient(ellipse at 50% 20%, rgba(0, 139, 255, 0.15) 0%, rgba(6, 13, 25, 1) 70%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Mesh Shapes */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 139, 255, 0.12) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          
          {/* Alliance Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.45rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(0, 139, 255, 0.1)',
            border: '1px solid rgba(0, 139, 255, 0.25)',
            color: 'var(--color-accent)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.8rem',
            boxShadow: '0 4px 15px rgba(0, 139, 255, 0.15)'
          }}>
            <ShieldCheck size={16} />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            lineHeight: 1.15,
            fontWeight: 800,
            marginBottom: '1.2rem',
            letterSpacing: '-0.03em'
          }}>
            {customTitle ? customTitle : (
              <>
                {t('hero.titleLine1')}{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #00D2FF 0%, #008BFF 50%, #0056B3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {t('hero.titleHighlight')}
                </span>
              </>
            )}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}>
            {customSubtitle ? customSubtitle : t('hero.subtitle')}
          </p>

          {/* Quick Apply CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={onOpenWizard}
              className="btn btn-accent btn-lg"
              style={{
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)'
              }}
            >
              <FileText size={20} />
              <span>{t('hero.quickApply')}</span>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Statistics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
            marginTop: '4rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {statsList.map((st, idx) => {
              if (renderStatItem) {
                const rendered = renderStatItem(st, idx);
                if (rendered) return rendered;
              }
              return (
                <div key={st.id || idx} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: getStatColor(st.color), fontFamily: 'var(--font-display)' }}>
                    {st.number}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {lang === 'ru' ? st.labelRu : (st.labelEn || st.labelRu)}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          form.glass-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Flame, DollarSign, Calendar, MapPin, Anchor, ArrowRight, X, CheckCircle, Info } from 'lucide-react';
import { MARITIME_RANKS, VESSEL_TYPES, getRankLabel, getVesselLabel } from '../data/initialData';

export const VacancyList = ({ vacancies, searchFilter, onApplyVacancy }) => {
  const { lang, t } = useLanguage();

  const [selectedRank, setSelectedRank] = useState(searchFilter?.rank || '');
  const [selectedVessel, setSelectedVessel] = useState(searchFilter?.vesselType || '');
  const [query, setQuery] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  // Sync props filter if changed from Hero
  React.useEffect(() => {
    if (searchFilter?.rank) setSelectedRank(searchFilter.rank);
    if (searchFilter?.vesselType) setSelectedVessel(searchFilter.vesselType);
  }, [searchFilter]);

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((vac) => {
      if (!vac.active) return false;
      if (selectedRank && vac.rank !== selectedRank) return false;
      if (selectedVessel && vac.vesselType !== selectedVessel) return false;
      if (urgentOnly && !vac.urgent) return false;
      if (query) {
        const q = query.toLowerCase();
        const matchTitle = vac.title.toLowerCase().includes(q);
        const matchRank = vac.rank.toLowerCase().includes(q);
        const matchVessel = vac.vesselType.toLowerCase().includes(q);
        const matchPort = vac.joiningPort?.toLowerCase().includes(q);
        if (!matchTitle && !matchRank && !matchVessel && !matchPort) return false;
      }
      return true;
    });
  }, [vacancies, selectedRank, selectedVessel, urgentOnly, query]);

  return (
    <section id="vacancies" style={{ padding: '5rem 0', background: 'var(--bg-deep)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>
            {t('vacancies.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {t('vacancies.subtitle')}
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Search query input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('vacancies.searchQuery')}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>

            {/* Rank Select */}
            <div>
              <select 
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                className="form-select"
              >
                <option value="">{t('vacancies.filterAllRanks')}</option>
                {MARITIME_RANKS.map((r) => (
                  <option key={r} value={r}>{getRankLabel(r, lang)}</option>
                ))}
              </select>
            </div>

            {/* Vessel Type Select */}
            <div>
              <select 
                value={selectedVessel}
                onChange={(e) => setSelectedVessel(e.target.value)}
                className="form-select"
              >
                <option value="">{t('vacancies.filterAllVessels')}</option>
                {VESSEL_TYPES.map((v) => (
                  <option key={v} value={v}>{getVesselLabel(v, lang)}</option>
                ))}
              </select>
            </div>

            {/* Urgent Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => setUrgentOnly(!urgentOnly)}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: urgentOnly ? 'var(--color-danger)' : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-fast)'
              }}>
                {urgentOnly && <CheckCircle size={14} color="#FFFFFF" />}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: urgentOnly ? 'var(--color-danger)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Flame size={16} color="var(--color-danger)" />
                {t('vacancies.urgentOnly')}
              </span>
            </div>
          </div>
        </div>

        {/* Vacancies Grid */}
        {filteredVacancies.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Info size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {t('vacancies.noResults')}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '1.25rem',
            alignItems: 'stretch'
          }}>
            {filteredVacancies.map((vac) => (
              <div 
                key={vac.id} 
                className="glass-card"
                style={{
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  height: '100%',
                  borderRadius: '12px',
                  borderTop: vac.urgent ? '3px solid var(--color-danger)' : '1px solid var(--border-color)'
                }}
              >
                <div>
                  {/* Line 1: Vessel Type Badge */}
                  <div style={{ marginBottom: '0.4rem' }}>
                    <span className="badge badge-blue" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem', textTransform: 'none', lineHeight: 1.3, display: 'inline-block' }}>
                      {getVesselLabel(vac.vesselType, lang)}
                    </span>
                  </div>

                  {/* Line 2: Reserved HOT / URGENT Badge Slot */}
                  <div style={{ height: '28px', display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                    {vac.urgent ? (
                      <span className="badge badge-danger" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Flame size={12} /> HOT / URGENT
                      </span>
                    ) : (
                      <div style={{ height: '28px' }} />
                    )}
                  </div>

                  {/* Line 3: Title & Rank */}
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem', color: '#FFFFFF', wordBreak: 'break-word' }}>
                    {vac.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Anchor size={14} /> {vac.dwt}
                  </div>

                  {/* Salary Block */}
                  <div style={{
                    background: 'rgba(0, 139, 255, 0.08)',
                    border: '1px dashed rgba(0, 139, 255, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.8rem 1rem',
                    marginBottom: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('vacancies.salary')}</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-emerald)', fontFamily: 'var(--font-display)' }}>
                      {vac.salary}
                    </span>
                  </div>

                  {/* Specification Table */}
                  <div style={{ fontSize: '0.88rem', display: 'grid', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{t('vacancies.contract')}:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{vac.contract}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{t('vacancies.joiningPort')}:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{vac.joiningPort}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t('vacancies.joiningDate')}:</span>
                      <strong style={{ color: 'var(--color-gold)' }}>{vac.joiningDate}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <button 
                    onClick={() => setSelectedVacancy(vac)}
                    className="btn btn-secondary btn-sm"
                  >
                    {t('vacancies.detailsBtn')}
                  </button>
                  
                  <button 
                    onClick={() => onApplyVacancy(vac)}
                    className="btn btn-primary btn-sm"
                  >
                    {t('vacancies.applyBtn')} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Detailed Vacancy Modal */}
      {selectedVacancy && (
        <div className="modal-overlay" onClick={() => setSelectedVacancy(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>{selectedVacancy.vesselType}</span>
                <h2 style={{ fontSize: '1.8rem' }}>{selectedVacancy.title}</h2>
              </div>
              <button onClick={() => setSelectedVacancy(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('vacancies.salary')}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-emerald)' }}>{selectedVacancy.salary}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('vacancies.contract')}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedVacancy.contract}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('vacancies.joiningPort')}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedVacancy.joiningPort}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--color-accent)' }}>{t('vacancies.requirements')}</h4>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.5rem' }}>
                {selectedVacancy.requirements?.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--color-accent)' }}>{t('vacancies.responsibilities')}</h4>
              <p style={{ color: 'var(--text-secondary)' }}>{selectedVacancy.responsibilities}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setSelectedVacancy(null)} className="btn btn-secondary">
                Закрыть
              </button>
              <button 
                onClick={() => {
                  const v = selectedVacancy;
                  setSelectedVacancy(null);
                  onApplyVacancy(v);
                }} 
                className="btn btn-primary"
              >
                {t('vacancies.confirmApply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { getVesselLabel } from '../../data/initialData';

export const VacanciesTab = ({
  vacancies,
  onOpenAddVacancy,
  onOpenEditVacancy,
  onToggleVacancyActive,
  onDeleteVacancy
}) => {
  const { lang, t } = useLanguage();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>Управление Мобильным Фондом Вакансий</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>Просмотр, создание и публикация активных судовых вакансий</p>
        </div>
        <button onClick={onOpenAddVacancy} className="btn btn-accent" style={{ gap: '0.5rem' }}>
          <Plus size={18} /> {t('admin.addVacancyBtn')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
        {vacancies.map((vac) => (
          <div key={vac.id} className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-surface-elevated)', height: '100%' }}>
            <div>
              {/* Row 1: Reserved HOT / URGENT Badge Slot (Full Width, Top Line) */}
              <div style={{ height: '26px', display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                {vac.urgent ? (
                  <span className="badge badge-danger" style={{ width: '100%', justifyContent: 'center', borderRadius: '6px', fontSize: '0.75rem', padding: '0.3rem 0.5rem', textAlign: 'center' }}>
                    🔥 HOT / URGENT
                  </span>
                ) : (
                  <div style={{ height: '26px' }} />
                )}
              </div>

              {/* Row 2: Vessel Badge & Action Controls Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                <span className="badge badge-blue" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem', textTransform: 'none', lineHeight: 1.3 }}>
                  {getVesselLabel(vac.vesselType, lang)}
                </span>

                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0, alignItems: 'center' }}>
                  <button 
                    type="button"
                    onClick={() => onToggleVacancyActive && onToggleVacancyActive(vac.id)}
                    title={vac.active === false ? "Показать вакансию на сайте" : "Скрыть вакансию с сайта"}
                    style={{ 
                      background: vac.active === false ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', 
                      border: `1px solid ${vac.active === false ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, 
                      color: vac.active === false ? 'var(--color-danger)' : 'var(--color-emerald)', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      padding: '0.35rem 0.55rem', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    {vac.active === false ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{vac.active === false ? 'Скрыта' : 'Видна'}</span>
                  </button>
                  <button 
                    onClick={() => onOpenEditVacancy(vac)} 
                    title="Редактировать вакансию"
                    style={{ background: 'rgba(0,139,255,0.12)', border: '1px solid rgba(0,139,255,0.3)', color: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                  >
                    <Edit size={14} /> <span>Изм.</span>
                  </button>
                  <button 
                    onClick={() => onDeleteVacancy(vac.id)} 
                    title="Удалить вакансию"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem 0.45rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Row 3: Vacancy Title */}
              <h4 style={{ fontSize: '1.3rem', color: '#FFFFFF', margin: '0 0 0.6rem 0', fontWeight: 700, wordBreak: 'break-word' }}>
                {vac.title}
              </h4>

              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-emerald)', marginBottom: '0.8rem' }}>
                {vac.salary} / мес
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.4rem', lineHeight: 1.45 }}>
                <div>DWT / Двигатель: <strong style={{ color: '#FFFFFF' }}>{vac.dwt}</strong></div>
                <div>Контракт: <strong style={{ color: '#FFFFFF' }}>{vac.contract}</strong></div>
                <div>Порт посадки: <strong style={{ color: '#FFFFFF' }}>{vac.joiningPort}</strong></div>
                <div>Дата готовности: <strong style={{ color: 'var(--color-gold)' }}>{vac.joiningDate}</strong></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

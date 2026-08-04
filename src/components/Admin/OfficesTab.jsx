import React from 'react';
import { Plus, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

export const OfficesTab = ({
  offices,
  onOpenAddOffice,
  onOpenEditOffice,
  onToggleOfficeActive,
  onDeleteOffice
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>Управление Сетью Филиалов и Контактов</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>Настройка карточек офисов, контактов и их видимости на сайте</p>
        </div>
        <button onClick={onOpenAddOffice} className="btn btn-accent" style={{ gap: '0.5rem' }}>
          <Plus size={18} /> Добавить Филиал
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
        {offices.map((off) => (
          <div key={off.id} className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-surface-elevated)', height: '100%' }}>
            <div>
              {/* Row 1: All Badges & Action Controls (Сначала идут плашки) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                <span className="badge badge-blue" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem', textTransform: 'none', lineHeight: 1.3 }}>
                  {off.flag}
                </span>
                
                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0, alignItems: 'center' }}>
                  <button 
                    type="button"
                    onClick={() => onToggleOfficeActive && onToggleOfficeActive(off.id)}
                    title={off.active === false ? "Показать филиал на сайте" : "Скрыть филиал с сайта"}
                    style={{ 
                      background: off.active === false ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', 
                      border: `1px solid ${off.active === false ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, 
                      color: off.active === false ? 'var(--color-danger)' : 'var(--color-emerald)', 
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
                    {off.active === false ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{off.active === false ? 'Скрыт' : 'Виден'}</span>
                  </button>
                  <button 
                    onClick={() => onOpenEditOffice(off)}
                    title="Редактировать филиал"
                    style={{ background: 'rgba(0,139,255,0.12)', border: '1px solid rgba(0,139,255,0.3)', color: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                  >
                    <Edit size={14} /> <span>Изм.</span>
                  </button>
                  <button 
                    onClick={() => onDeleteOffice && onDeleteOffice(off.id)}
                    title="Удалить филиал"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem 0.45rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Row 2: Title / City (Потом идет текст) */}
              <h4 style={{ fontSize: '1.35rem', color: '#FFFFFF', margin: '0 0 0.8rem 0', fontWeight: 700, wordBreak: 'break-word' }}>
                {off.city}
              </h4>
              
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.5rem', lineHeight: 1.45 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>📍</span>
                  <span>{off.address}</span>
                </div>
                {off.hours && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-gold)', flexShrink: 0 }}>🕒</span>
                    <span style={{ color: 'var(--text-muted)' }}>{off.hours}</span>
                  </div>
                )}
                {/* Phones list */}
                {(() => {
                  const phones = Array.isArray(off.phones) && off.phones.length > 0
                    ? off.phones
                    : String(off.phone || '').split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
                  if (phones.length === 0) return null;
                  return (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--color-emerald)', flexShrink: 0, marginTop: '2px' }}>📞</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        {phones.map((p, pIdx) => (
                          <strong key={pIdx} style={{ color: 'var(--text-primary)' }}>{p}</strong>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Emails list */}
                {(() => {
                  const emails = Array.isArray(off.emails) && off.emails.length > 0
                    ? off.emails
                    : String(off.email || '').split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
                  if (emails.length === 0) return null;
                  return (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }}>✉️</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        {emails.map((m, mIdx) => (
                          <span key={mIdx} style={{ wordBreak: 'break-all', color: 'var(--text-secondary)' }}>{m}</span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

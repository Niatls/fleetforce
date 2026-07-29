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
              {/* Row 1: Full-width Badge */}
              <div style={{ marginBottom: '0.6rem' }}>
                <span className="badge badge-blue" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem', textTransform: 'none', display: 'inline-block', maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: 1.3 }}>
                  {off.flag}
                </span>
              </div>

              {/* Row 2: Title & Action Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                <h4 style={{ fontSize: '1.3rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>{off.city}</h4>
                
                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
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
              
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.5rem', lineHeight: 1.45 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>📍</span>
                  <span>{off.address}</span>
                </div>
                {off.phone && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-emerald)', flexShrink: 0 }}>📞</span>
                    <strong style={{ color: '#FFFFFF' }}>{off.phone}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>✉️</span>
                  <span style={{ wordBreak: 'break-all' }}>{off.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

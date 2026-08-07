import React from 'react';
import { Plus, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

export const HubBlocksTab = ({
  hubBlocks = [],
  onOpenAddHub,
  onOpenEditHub,
  onToggleHubBlockActive,
  onDeleteHubBlock
}) => {
  const blocksList = Array.isArray(hubBlocks) ? hubBlocks : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>Управление Блоками Морякам и Документами</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>Настройка сервисных блоков, скачиваемых бланков и тестов</p>
        </div>
        <button onClick={onOpenAddHub} className="btn btn-accent" style={{ gap: '0.5rem' }}>
          <Plus size={18} /> Добавить Инфо-Блок
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
        {blocksList.map((block, idx) => {
          if (!block) return null;
          return (
            <div key={block.id || idx} className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-surface-elevated)', height: '100%' }}>
              <div>
                {/* Row 1: Badges & Action Controls Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-gold" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem', textTransform: 'none' }}>
                    {block.actionType ? block.actionType.toUpperCase() : 'BLOCK'}
                  </span>

                  <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0, alignItems: 'center' }}>
                    <button 
                      type="button"
                      onClick={() => onToggleHubBlockActive && onToggleHubBlockActive(block.id)}
                      title={block.active === false ? "Показать инфо-блок на сайте" : "Скрыть инфо-блок с сайта"}
                      style={{ 
                        background: block.active === false ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', 
                        border: `1px solid ${block.active === false ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, 
                        color: block.active === false ? 'var(--color-danger)' : 'var(--color-emerald)', 
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
                      {block.active === false ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{block.active === false ? 'Скрыт' : 'Виден'}</span>
                    </button>
                    <button 
                      onClick={() => onOpenEditHub(block)}
                      title="Редактировать инфо-блок"
                      style={{ background: 'rgba(0,139,255,0.12)', border: '1px solid rgba(0,139,255,0.3)', color: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                    >
                      <Edit size={14} /> <span>Изм.</span>
                    </button>
                    <button 
                      onClick={() => onDeleteHubBlock && onDeleteHubBlock(block.id)}
                      title="Удалить инфо-блок"
                      style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem 0.45rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', margin: '0 0 0.5rem 0', fontWeight: 700 }}>{block.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.45 }}>{block.description}</p>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem' }}>
                Кнопка: <strong>{block.buttonText}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

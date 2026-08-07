import React from 'react';
import { ArrowLeft, Edit3, Eye, CheckCircle2, Save } from 'lucide-react';

export const EditorToolbar = ({
  onClose,
  hasChanges,
  autoSaveStatus,
  previewMode,
  setPreviewMode,
  onPublish
}) => {
  return (
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
        justifyContent: 'space-between',
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
            <Edit3 size={14} /> ВИЗУАЛЬНЫЙ РЕДАКТОР САЙТА
          </span>
          
          {autoSaveStatus && (
            <span style={{ fontSize: '0.82rem', color: 'var(--color-emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <CheckCircle2 size={15} /> {autoSaveStatus}
            </span>
          )}
        </div>
      </div>

      {/* Center Toggle: Preview Mode */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', padding: '3px', borderRadius: '8px' }}>
        <button
          onClick={() => setPreviewMode(false)}
          style={{
            padding: '0.35rem 0.9rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: !previewMode ? 'var(--color-accent)' : 'transparent',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s'
          }}
        >
          <Edit3 size={14} /> Редактирование
        </button>
        <button
          onClick={() => setPreviewMode(true)}
          style={{
            padding: '0.35rem 0.9rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: previewMode ? 'var(--color-emerald)' : 'transparent',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s'
          }}
        >
          <Eye size={14} /> Предпросмотр сайтом
        </button>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button
          onClick={onPublish}
          className="btn btn-accent btn-md"
          style={{ fontWeight: 700, gap: '0.5rem', boxShadow: '0 4px 15px rgba(245,158,11,0.4)' }}
        >
          <Save size={18} />
          <span>🚀 Опубликовать на сайт</span>
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { ArrowLeft, Edit3, Eye, CheckCircle2 } from 'lucide-react';

export const EditorToolbar = ({
  onClose,
  autoSaveStatus,
  previewMode,
  setPreviewMode
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9990,
        background: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-subtle)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
        <button
          onClick={onClose}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} /> Выйти в Админку
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
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

      {/* Mode Switcher Toggle: Edit vs Preview */}
      <div style={{ display: 'flex', background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '3px', borderRadius: '8px' }}>
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
            color: !previewMode ? '#FFFFFF' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'var(--transition-fast)'
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
            color: previewMode ? '#FFFFFF' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'var(--transition-fast)'
          }}
        >
          <Eye size={14} /> Предпросмотр сайтом
        </button>
      </div>
    </header>
  );
};

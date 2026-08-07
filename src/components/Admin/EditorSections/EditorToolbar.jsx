import React from 'react';
import { ArrowLeft, Edit3, Eye, CheckCircle2, Palette } from 'lucide-react';

export const EditorToolbar = ({
  onClose,
  autoSaveStatus,
  previewMode,
  setPreviewMode,
  currentTheme,
  onThemeChange
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
        gap: '1rem',
        boxShadow: 'var(--shadow-subtle)',
        flexWrap: 'wrap'
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Theme Selector */}
        {onThemeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-main)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Palette size={14} color="var(--color-accent)" />
            <select 
              value={currentTheme || 'ocean-soft'}
              onChange={(e) => onThemeChange(e.target.value)}
              className="form-select"
              style={{ padding: '0.2rem 0.4rem', fontSize: '0.78rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <option value="ocean-soft" style={{ background: '#1e293b', color: '#fff' }}>🌊 Тихий Океан (Pacific Blue)</option>
              <option value="light-daylight" style={{ background: '#ffffff', color: '#0f172a' }}>☀️ Дневной Порт (Light Daylight)</option>
              <option value="deep-navy" style={{ background: '#0e1b33', color: '#fff' }}>⚓ Полуночный Флот (Midnight Navy)</option>
              <option value="emerald-sea" style={{ background: '#0a3338', color: '#fff' }}>🐬 Изумрудный Бриз (Caribbean Teal)</option>
              <option value="nordic-storm" style={{ background: '#172338', color: '#fff' }}>⚡ Северный Шторм (Nordic Steel)</option>
              <option value="sunset-haven" style={{ background: '#1e1b3a', color: '#fff' }}>🌅 Морской Закат (Sunset Haven)</option>
            </select>
          </div>
        )}

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
      </div>
    </header>
  );
};

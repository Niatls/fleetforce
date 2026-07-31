import React, { useState, useEffect } from 'react';
import { Edit2, Check } from 'lucide-react';

export const InlineText = ({ 
  value, 
  onChange, 
  tag = 'span', 
  className = '', 
  style = {}, 
  placeholder = 'Введите текст...',
  isEditingEnabled = true,
  multiline = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  useEffect(() => {
    setTempValue(value || '');
  }, [value]);

  const handleSave = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempValue(value || '');
      setIsEditing(false);
    }
  };

  if (!isEditingEnabled) {
    const Tag = tag;
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  const Tag = tag;

  if (isEditing) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', width: '100%', position: 'relative' }}>
        {multiline ? (
          <textarea
            autoFocus
            rows={3}
            className="form-input"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            style={{ width: '100%', resize: 'vertical', fontSize: 'inherit', fontFamily: 'inherit', color: '#fff', background: 'rgba(0,139,255,0.15)', border: '1px solid var(--color-accent)' }}
          />
        ) : (
          <input
            autoFocus
            type="text"
            className="form-input"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            style={{ width: '100%', fontSize: 'inherit', fontFamily: 'inherit', color: '#fff', background: 'rgba(0,139,255,0.15)', border: '1px solid var(--color-accent)', padding: '0.2rem 0.5rem' }}
          />
        )}
        <button
          type="button"
          onClick={handleSave}
          title="Сохранить"
          style={{ background: 'var(--color-emerald)', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Check size={14} />
        </button>
      </span>
    );
  }

  return (
    <Tag 
      className={`${className} inline-edit-hover`} 
      onClick={() => setIsEditing(true)}
      title="Кликните для редактирования текста"
      style={{
        ...style,
        cursor: 'pointer',
        position: 'relative',
        outline: '1px dashed rgba(0, 139, 255, 0.4)',
        outlineOffset: '3px',
        borderRadius: '3px',
        transition: 'all 0.2s ease',
        display: tag === 'span' ? 'inline-block' : 'block'
      }}
    >
      {value || <span style={{ color: 'var(--text-muted)', italic: true }}>{placeholder}</span>}
      <span 
        className="inline-edit-icon"
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: 'var(--color-accent)',
          color: '#fff',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          opacity: 0.8
        }}
      >
        <Edit2 size={10} />
      </span>
    </Tag>
  );
};

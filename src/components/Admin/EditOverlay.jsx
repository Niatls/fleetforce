import React from 'react';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export const EditOverlay = ({
  children,
  onEdit,
  onDelete,
  onToggleActive,
  isActive = true,
  title = '',
  isEditingEnabled = true
}) => {
  if (!isEditingEnabled) {
    return <>{children}</>;
  }

  return (
    <div 
      className="edit-overlay-container" 
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.2s ease',
        outline: isActive ? '2px dashed rgba(0, 139, 255, 0.4)' : '2px dashed rgba(239, 68, 68, 0.5)',
        outlineOffset: '4px',
        opacity: isActive ? 1 : 0.6
      }}
    >
      {/* Top action toolbar badge */}
      <div 
        style={{
          position: 'absolute',
          top: '-12px',
          right: '12px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(11, 19, 41, 0.95)',
          border: '1px solid var(--color-accent)',
          borderRadius: '20px',
          padding: '2px 8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)'
        }}
      >
        {title && (
          <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 600, paddingRight: '4px' }}>
            {title}
          </span>
        )}

        {onToggleActive && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleActive(); }}
            title={isActive ? 'Скрыть с сайта' : 'Показать на сайте'}
            style={{
              background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: 'none',
              color: isActive ? 'var(--color-emerald)' : 'var(--color-danger)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            {isActive ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            title="Редактировать карточку"
            style={{
              background: 'rgba(0, 139, 255, 0.2)',
              border: 'none',
              color: 'var(--color-accent)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            <Edit size={13} />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Вы уверены, что хотите удалить эту карточку из черновика?')) {
                onDelete();
              }
            }}
            title="Удалить карточку"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: 'none',
              color: 'var(--color-danger)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {children}
    </div>
  );
};

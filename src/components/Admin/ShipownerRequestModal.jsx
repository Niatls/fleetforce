import React from 'react';
import { X, Mail } from 'lucide-react';

export const ShipownerRequestModal = ({
  request,
  onClose
}) => {
  if (!request) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>Заявка Судовладельца {request.id}</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Дата: {new Date(request.createdAt).toLocaleString()}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1.2rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.8rem' }}>1. Информация о компании</h4>
            <div style={{ fontSize: '0.92rem', display: 'grid', gap: '0.5rem' }}>
              <div><strong>Компания / Судовладелец:</strong> {request.companyName}</div>
              <div><strong>Контактное лицо:</strong> {request.contactName}</div>
              <div><strong>Email:</strong> <a href={`mailto:${request.email}`} style={{ color: 'var(--color-accent)' }}>{request.email}</a></div>
              <div><strong>Телефон:</strong> <a href={`tel:${request.phone}`} style={{ color: 'var(--color-emerald)' }}>{request.phone}</a></div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.6rem' }}>2. Детали запроса экипажа / Требования</h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
              {request.details || 'Детали не указаны.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <a href={`mailto:${request.email}?subject=FleetForce%20Crewing%20Proposal%20${request.id}`} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Mail size={16} /> Написать на Email компании
          </a>
          <button onClick={onClose} className="btn btn-secondary">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

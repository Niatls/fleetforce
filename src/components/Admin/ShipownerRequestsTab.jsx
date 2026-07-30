import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

export const ShipownerRequestsTab = ({
  shipownerRequests,
  onSelectShipownerRequest,
  onUpdateShipownerRequestStatus,
  onDeleteShipownerRequest
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.3rem' }}>
            Заявки Судовладельцев на Расчет Комплектования Экипажей
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Все поступающие с сайта запросы стоимости подбора экипажа от судоходных компаний.
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>ID / Компания</th>
              <th style={{ padding: '1rem' }}>Контактное лицо</th>
              <th style={{ padding: '1rem' }}>Контакты</th>
              <th style={{ padding: '1rem' }}>Детали запроса</th>
              <th style={{ padding: '1rem' }}>Статус</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {shipownerRequests.map((req) => (
              <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{req.companyName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-accent)' }}>{req.id} • {new Date(req.createdAt).toLocaleDateString()}</div>
                </td>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {req.contactName}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'grid', gap: '0.2rem', fontSize: '0.85rem' }}>
                    <a href={`mailto:${req.email}`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>{req.email}</a>
                    <a href={`tel:${req.phone}`} style={{ color: 'var(--color-emerald)', textDecoration: 'none' }}>{req.phone}</a>
                  </div>
                </td>
                <td style={{ padding: '1rem', maxWidth: '300px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {req.details}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    value={req.status || 'New'} 
                    onChange={(e) => onUpdateShipownerRequestStatus && onUpdateShipownerRequestStatus(req.id, e.target.value)}
                    className="form-select"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: req.status === 'New' ? 'var(--color-gold-light)' : 'rgba(255,255,255,0.05)', color: req.status === 'New' ? 'var(--color-gold)' : 'var(--text-primary)' }}
                  >
                    <option value="New">Новый запрос</option>
                    <option value="In Progress">В работе / Расчет</option>
                    <option value="Quoted">КП отправлено</option>
                    <option value="Archive">Архив</option>
                  </select>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => onSelectShipownerRequest(req)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Eye size={14} /> Просмотр
                    </button>
                    <button 
                      onClick={() => onDeleteShipownerRequest && onDeleteShipownerRequest(req.id)}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem' }}
                      title="Удалить заявку"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {shipownerRequests.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Пока нет поступивших запросов расчетов от судовладельцев.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

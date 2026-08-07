import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

export const ShipownerRequestsTab = ({
  shipownerRequests = [],
  onSelectShipownerRequest,
  onUpdateShipownerRequestStatus,
  onDeleteShipownerRequest
}) => {
  const requestsList = Array.isArray(shipownerRequests) ? shipownerRequests : [];

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
            {requestsList.map((req, idx) => {
              if (!req) return null;
              return (
                <tr key={req.id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{req.companyName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-accent)' }}>{req.id} • {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{req.contactPerson || '—'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>{req.phone}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                      {req.vesselType || 'Флот'}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Экипаж: {req.crewCount || 'по запросу'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={req.status || 'New'}
                      onChange={(e) => onUpdateShipownerRequestStatus && onUpdateShipownerRequestStatus(req.id, e.target.value)}
                      style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.82rem' }}
                    >
                      <option value="New">Новая</option>
                      <option value="In Progress">В обработке</option>
                      <option value="Completed">Обработана</option>
                      <option value="Rejected">Отклонена</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onSelectShipownerRequest && onSelectShipownerRequest(req)}
                        style={{ background: 'rgba(0,139,255,0.1)', border: '1px solid rgba(0,139,255,0.3)', color: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        title="Открыть детали заявки"
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
              );
            })}
            {requestsList.length === 0 && (
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

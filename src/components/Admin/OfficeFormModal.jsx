import React from 'react';
import { X } from 'lucide-react';

export const OfficeFormModal = ({
  isOpen,
  editingOfficeId,
  officeForm,
  setOfficeForm,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
            {editingOfficeId ? 'Редактировать Филиал' : 'Добавить Новый Филиал'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSave} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Город / Регион</label>
              <input 
                type="text" 
                required
                placeholder="Санкт-Петербург"
                className="form-input"
                value={officeForm.city}
                onChange={(e) => setOfficeForm({ ...officeForm, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Бейдж / Метка</label>
              <input 
                type="text" 
                placeholder="⚓ Главный Офис"
                className="form-input"
                value={officeForm.flag}
                onChange={(e) => setOfficeForm({ ...officeForm, flag: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Адрес офиса</label>
            <input 
              type="text" 
              required
              placeholder="Набережная Реки Мойки 58, Офис 402"
              className="form-input"
              value={officeForm.address}
              onChange={(e) => setOfficeForm({ ...officeForm, address: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Телефон (необязательно)</label>
              <input 
                type="text" 
                placeholder="+7 (812) 334-55-66 (необязательно)"
                className="form-input"
                value={officeForm.phone}
                onChange={(e) => setOfficeForm({ ...officeForm, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                required
                placeholder="spb@fleetforce-crewing.com"
                className="form-input"
                value={officeForm.email}
                onChange={(e) => setOfficeForm({ ...officeForm, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-accent">
              Сохранить Филиал
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

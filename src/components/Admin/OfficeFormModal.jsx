import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const OfficeFormModal = ({
  isOpen,
  editingOffice,
  editingOfficeId,
  officeForm: externalForm,
  setOfficeForm: setExternalForm,
  onClose,
  onSave
}) => {
  const defaultForm = {
    city: '',
    flag: '🌊 Филиал',
    address: '',
    phone: '',
    email: '',
    active: true
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) return;
    const target = editingOffice || externalForm;
    if (target) {
      setFormData({
        id: target.id || editingOfficeId || Date.now(),
        city: target.city || '',
        flag: target.flag || '🌊 Филиал',
        address: target.address || '',
        phone: target.phone || '',
        email: target.email || '',
        active: target.active !== undefined ? target.active : true
      });
    } else {
      setFormData(defaultForm);
    }
  }, [isOpen, editingOffice, editingOfficeId, externalForm]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (setExternalForm) {
      setExternalForm(prev => (typeof prev === 'object' && prev ? { ...prev, [field]: value } : { [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const finalData = {
      ...formData,
      city: formData.city || 'Office',
      id: formData.id || Date.now()
    };
    if (onSave) onSave(finalData);
    if (onClose) onClose();
  };

  const isEdit = !!(editingOffice || editingOfficeId);

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '600px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
            {isEdit ? '✏️ Редактировать Филиал' : '➕ Добавить Новый Филиал'}
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Город / Регион</label>
            <input 
              type="text" 
              placeholder="e.g. Санкт-Петербург / Калининград" 
              className="form-input"
              value={formData.city || ''}
              onChange={(e) => updateField('city', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Метка / Флаг филиала</label>
            <input 
              type="text" 
              placeholder="e.g. ⚓ Головной Офис / 🌊 Региональный филиал" 
              className="form-input"
              value={formData.flag || ''}
              onChange={(e) => updateField('flag', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Физический Адрес</label>
            <textarea 
              rows={2}
              placeholder="Полный адрес офиса..." 
              className="form-input"
              value={formData.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Телефон связи</label>
              <input 
                type="text" 
                placeholder="+7 (812) 000-00-00" 
                className="form-input"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email офиса</label>
              <input 
                type="email" 
                placeholder="office@fleetforce.ru" 
                className="form-input"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.4rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-emerald)', fontWeight: 600 }}>
              <input 
                type="checkbox"
                checked={formData.active !== false}
                onChange={(e) => updateField('active', e.target.checked)}
              />
              👁️ Отображать на сайте
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Сохранить изменения' : 'Создать филиал'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

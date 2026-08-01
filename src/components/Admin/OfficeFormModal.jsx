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
    flag: '',
    address: '',
    phone: '',
    email: '',
    active: true
  };

  const [localForm, setLocalForm] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) return;
    if (editingOffice) {
      setLocalForm({
        id: editingOffice.id,
        city: editingOffice.city || '',
        flag: editingOffice.flag || '',
        address: editingOffice.address || '',
        phone: editingOffice.phone || '',
        email: editingOffice.email || '',
        active: editingOffice.active !== undefined ? editingOffice.active : true
      });
    } else if (externalForm) {
      setLocalForm(externalForm);
    } else {
      setLocalForm(defaultForm);
    }
  }, [isOpen, editingOffice, externalForm]);

  if (!isOpen) return null;

  const currentForm = externalForm || localForm;

  const updateField = (field, value) => {
    if (setExternalForm && externalForm) {
      setExternalForm({ ...externalForm, [field]: value });
    } else {
      setLocalForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOffice) {
      onSave({ ...localForm, id: editingOffice.id });
    } else if (externalForm) {
      onSave(e);
    } else {
      onSave({ ...localForm, id: Date.now() });
    }
  };

  const isEdit = !!(editingOffice || editingOfficeId);

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '600px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
            {isEdit ? 'Редактировать Филиал' : 'Добавить Новый Филиал'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Город / Регион</label>
              <input 
                type="text" 
                required
                placeholder="Санкт-Петербург"
                className="form-input"
                value={currentForm.city || ''}
                onChange={(e) => updateField('city', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Бейдж / Метка</label>
              <input 
                type="text" 
                placeholder="⚓ Главный Офис"
                className="form-input"
                value={currentForm.flag || ''}
                onChange={(e) => updateField('flag', e.target.value)}
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
              value={currentForm.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Телефон (необязательно)</label>
              <input 
                type="text" 
                placeholder="+7 (812) 334-55-66 (необязательно)"
                className="form-input"
                value={currentForm.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                required
                placeholder="spb@fleetforce-crewing.com"
                className="form-input"
                value={currentForm.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
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

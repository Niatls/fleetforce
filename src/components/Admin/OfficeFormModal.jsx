import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

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
    phones: [''],
    emails: [''],
    active: true
  };

  const [formData, setFormData] = useState(defaultForm);
  const [phonesList, setPhonesList] = useState(['']);
  const [emailsList, setEmailsList] = useState(['']);

  useEffect(() => {
    if (!isOpen) return;
    const target = editingOffice || externalForm;
    if (target) {
      // Parse phones
      let parsedPhones = [''];
      if (Array.isArray(target.phones) && target.phones.length > 0) {
        parsedPhones = target.phones;
      } else if (target.phone) {
        parsedPhones = String(target.phone).split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
        if (parsedPhones.length === 0) parsedPhones = [''];
      }

      // Parse emails
      let parsedEmails = [''];
      if (Array.isArray(target.emails) && target.emails.length > 0) {
        parsedEmails = target.emails;
      } else if (target.email) {
        parsedEmails = String(target.email).split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
        if (parsedEmails.length === 0) parsedEmails = [''];
      }

      setPhonesList(parsedPhones);
      setEmailsList(parsedEmails);
      setFormData({
        id: target.id || editingOfficeId || Date.now(),
        city: target.city || '',
        flag: target.flag || '🌊 Филиал',
        address: target.address || '',
        phone: target.phone || '',
        email: target.email || '',
        hours: target.hours || '',
        active: target.active !== undefined ? target.active : true
      });
    } else {
      setPhonesList(['']);
      setEmailsList(['']);
      setFormData(defaultForm);
    }
  }, [isOpen, editingOffice, editingOfficeId, externalForm]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Phones Handlers
  const handlePhoneChange = (idx, val) => {
    const updated = [...phonesList];
    updated[idx] = val;
    setPhonesList(updated);
  };
  const handleAddPhone = () => {
    setPhonesList(prev => [...prev, '']);
  };
  const handleRemovePhone = (idx) => {
    if (phonesList.length === 1) {
      setPhonesList(['']);
    } else {
      setPhonesList(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Emails Handlers
  const handleEmailChange = (idx, val) => {
    const updated = [...emailsList];
    updated[idx] = val;
    setEmailsList(updated);
  };
  const handleAddEmail = () => {
    setEmailsList(prev => [...prev, '']);
  };
  const handleRemoveEmail = (idx) => {
    if (emailsList.length === 1) {
      setEmailsList(['']);
    } else {
      setEmailsList(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanPhones = phonesList.map(p => p.trim()).filter(Boolean);
    const cleanEmails = emailsList.map(m => m.trim()).filter(Boolean);

    const finalData = {
      ...formData,
      city: formData.city || 'Office',
      phones: cleanPhones,
      phone: cleanPhones.join(', ') || formData.phone || '',
      emails: cleanEmails,
      email: cleanEmails.join(', ') || formData.email || '',
      id: formData.id || Date.now()
    };
    if (onSave) onSave(finalData);
    if (onClose) onClose();
  };

  const isEdit = !!(editingOffice || editingOfficeId);

  return (
    <div className="modal-overlay" style={{ zIndex: 2000, paddingTop: '85px', paddingBottom: '2rem', overflowY: 'auto', alignItems: 'flex-start' }}>
      <div className="modal-content" style={{ maxWidth: '650px', padding: '2rem', marginTop: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
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

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.1rem' }}>
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

          <div className="form-group">
            <label className="form-label">🕒 Дни и часы работы филиала</label>
            <input 
              type="text" 
              placeholder="e.g. Пн-Пт 09:00 - 18:00 (МСК)" 
              className="form-input"
              value={formData.hours || ''}
              onChange={(e) => updateField('hours', e.target.value)}
            />
          </div>

          {/* Multiple Phone Numbers Section */}
          <div className="form-group" style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: 700, color: 'var(--color-emerald)' }}>
                📞 Телефоны связи (несколько)
              </label>
              <button 
                type="button"
                onClick={handleAddPhone}
                className="btn btn-sm"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--color-emerald)', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
              >
                <Plus size={13} /> Добавить телефон
              </button>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {phonesList.map((phoneVal, pIdx) => (
                <div key={pIdx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input 
                    type="text"
                    placeholder={`Телефон ${pIdx + 1} (e.g. +7 (812) 000-00-00)`}
                    className="form-input"
                    value={phoneVal}
                    onChange={(e) => handlePhoneChange(pIdx, e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => handleRemovePhone(pIdx)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.4rem', flexShrink: 0 }}
                    title="Удалить телефон"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Multiple Email Addresses Section */}
          <div className="form-group" style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: 700, color: 'var(--color-accent)' }}>
                ✉️ Email адреса (несколько)
              </label>
              <button 
                type="button"
                onClick={handleAddEmail}
                className="btn btn-sm"
                style={{ background: 'rgba(0,139,255,0.15)', border: '1px solid rgba(0,139,255,0.3)', color: 'var(--color-accent)', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
              >
                <Plus size={13} /> Добавить email
              </button>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {emailsList.map((emailVal, eIdx) => (
                <div key={eIdx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input 
                    type="email"
                    placeholder={`Email ${eIdx + 1} (e.g. office@fleetforce.ru)`}
                    className="form-input"
                    value={emailVal}
                    onChange={(e) => handleEmailChange(eIdx, e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => handleRemoveEmail(eIdx)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.4rem', flexShrink: 0 }}
                    title="Удалить email"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
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


import React from 'react';
import { X, CheckCircle } from 'lucide-react';

export const HubBlockFormModal = ({
  isOpen,
  editingHubId,
  hubForm,
  setHubForm,
  onHubFileSelect,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
            {editingHubId ? 'Редактировать Инфо-Блок' : 'Добавить Новый Инфо-Блок'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSave} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Заголовок блока</label>
            <input 
              type="text" 
              required
              placeholder="BGI Standard Application"
              className="form-input"
              value={hubForm.title}
              onChange={(e) => setHubForm({ ...hubForm, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание блока</label>
            <textarea 
              className="form-textarea"
              style={{ height: '75px' }}
              placeholder="Описание бланка или услуги..."
              value={hubForm.description}
              onChange={(e) => setHubForm({ ...hubForm, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Текст на кнопке</label>
              <input 
                type="text" 
                required
                placeholder="Скачать анкету BGI (.DOCX)"
                className="form-input"
                value={hubForm.buttonText}
                onChange={(e) => setHubForm({ ...hubForm, buttonText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Тип действия кнопки</label>
              <select 
                className="form-select"
                value={hubForm.actionType}
                onChange={(e) => setHubForm({ ...hubForm, actionType: e.target.value })}
              >
                <option value="download">Скачивание файла (download)</option>
                <option value="wizard">Открыть Мастер Анкеты (wizard)</option>
                <option value="link">Переход по ссылке / Телефон (link)</option>
              </select>
            </div>
          </div>

          {hubForm.actionType === 'download' && (
            <div style={{ display: 'grid', gap: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: 'var(--color-accent)' }}>📎 Загрузить файл с компьютера (.docx, .pdf, .zip, .xlsx)</label>
                <input 
                  type="file" 
                  onChange={onHubFileSelect}
                  className="form-input"
                  style={{ padding: '0.5rem', cursor: 'pointer' }}
                />
              </div>

              {hubForm.fileData && (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-emerald)', background: 'var(--color-emerald-light)', padding: '0.5rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <CheckCircle size={15} /> Файл прикреплен и готов к скачиванию: <strong>{hubForm.filename}</strong>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Имя файла при сохранении пользователем</label>
                <input 
                  type="text" 
                  placeholder="BGI_Application_Form_2026.docx"
                  className="form-input"
                  value={hubForm.filename}
                  onChange={(e) => setHubForm({ ...hubForm, filename: e.target.value })}
                />
              </div>
            </div>
          )}

          {hubForm.actionType === 'link' && (
            <div className="form-group">
              <label className="form-label">Ссылка / Телефон (tel:)</label>
              <input 
                type="text" 
                placeholder="tel:+78005553535"
                className="form-input"
                value={hubForm.linkUrl}
                onChange={(e) => setHubForm({ ...hubForm, linkUrl: e.target.value })}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Тип иконки</label>
              <select 
                className="form-select"
                value={hubForm.iconType}
                onChange={(e) => setHubForm({ ...hubForm, iconType: e.target.value })}
              >
                <option value="FileText">FileText (Документ)</option>
                <option value="Download">Download (Скачивание)</option>
                <option value="FileCheck">FileCheck (Галочка / Чек-лист)</option>
                <option value="Award">Award (Награда / Тесты)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Цветовой акцент</label>
              <select 
                className="form-select"
                value={hubForm.color}
                onChange={(e) => setHubForm({ ...hubForm, color: e.target.value })}
              >
                <option value="blue">Синий (Blue)</option>
                <option value="gold">Золотой (Gold)</option>
                <option value="emerald">Изумрудный (Emerald)</option>
                <option value="danger">Красный (Danger)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-accent">
              Сохранить Инфо-Блок
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

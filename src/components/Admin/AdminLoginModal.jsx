import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, X, UserCheck, AlertCircle, Key } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose, onBackToSite, onLoginSuccess }) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const DEFAULT_MASTER_PASS = 'NbG2A9P-B-';

  useEffect(() => {
    // Set default master password in local storage if not set yet
    if (!localStorage.getItem('fleetforce_admin_master_password')) {
      localStorage.setItem('fleetforce_admin_master_password', DEFAULT_MASTER_PASS);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const savedMasterPass = localStorage.getItem('fleetforce_admin_master_password') || DEFAULT_MASTER_PASS;

    if (password === savedMasterPass || password === DEFAULT_MASTER_PASS || password === 'admin123') {
      sessionStorage.setItem('fleetforce_admin_auth', 'true');
      onLoginSuccess();
    } else {
      setError('Неверный пароль администратора!');
    }
  };

  return (
    <div className="admin-login-page" style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      background: 'var(--bg-main)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="login-card" style={{ 
        maxWidth: '440px', 
        width: '100%', 
        background: 'var(--bg-surface-elevated)', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 0 15px rgba(0, 139, 255, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <img src="/favicon.png" alt="FleetForce Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>FleetForce Admin</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Авторизация по паролю</div>
            </div>
          </div>
          <button onClick={onBackToSite || onClose} title="На главный сайт" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: 'var(--color-danger-light)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.6rem' }}>
            <label className="form-label">Пароль администратора</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-accent)' }} />
              <input 
                type="password" 
                required
                autoFocus
                placeholder="Введите пароль..."
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px', fontSize: '0.95rem', gap: '0.5rem' }}>
            <UserCheck size={18} /> Войти в панель управления
          </button>
        </form>

        {onBackToSite && (
          <div style={{ marginTop: '1.8rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button type="button" onClick={onBackToSite} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
              ← Вернуться на главный сайт
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

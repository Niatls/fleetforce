import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, X, Key, UserCheck, AlertCircle } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose, onBackToSite, onLoginSuccess }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const savedPassword = localStorage.getItem('fleetforce_admin_password') || 'admin123';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess();
        return;
      }
    } catch (err) {
      console.warn('API auth unavailable, checking local password:', err);
    }

    if (username === 'admin' && (password === savedPassword || password === 'admin123' || password === 'admin')) {
      onLoginSuccess();
    } else {
      setError('Неверное имя пользователя или пароль!');
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 0 15px rgba(0, 139, 255, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <img src="/favicon.png" alt="FleetForce Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>FleetForce Admin</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Авторизация в системе</div>
            </div>
          </div>
          <button onClick={onBackToSite || onClose} title="На главный сайт" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'var(--color-danger-light)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Логин менеджера / Admin</label>
            <input 
              type="text" 
              required
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Пароль</label>
            <input 
              type="password" 
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px', fontSize: '0.95rem' }}>
            <UserCheck size={18} /> Войти в систему
          </button>
        </form>

        <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Демо-пароль по умолчанию: <strong>admin / admin123</strong>
        </div>

        {onBackToSite && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button type="button" onClick={onBackToSite} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
              ← Вернуться на главный сайт
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

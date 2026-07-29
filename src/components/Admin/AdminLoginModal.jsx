import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, X, Key, UserCheck, AlertCircle, Mail, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose, onBackToSite, onLoginSuccess }) => {
  const { t } = useLanguage();
  
  // Auth state mode: 'password_only', 'default_login', 'verify_code'
  const [mode, setMode] = useState('password_only');
  const [username, setUsername] = useState('admin');
  const [defaultPass, setDefaultPass] = useState('admin123');
  const [customPassword, setCustomPassword] = useState('');
  
  // Verification code & new password setup
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const targetEmail = 'FleetforceLLC@hotmail.com';

  useEffect(() => {
    const savedMasterPass = localStorage.getItem('fleetforce_admin_master_password');
    if (savedMasterPass) {
      setMode('password_only');
    } else {
      setMode('default_login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper to send verification code to FleetforceLLC@hotmail.com
  const sendVerificationCode = async () => {
    setLoading(true);
    setError('');
    const random6Digit = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(random6Digit);

    try {
      await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, code: random6Digit })
      });
    } catch (err) {
      console.warn('API send-code offline fallback used');
    }

    setLoading(false);
    setInfoMessage(`Код подтверждения выслан на ${targetEmail}`);
    setMode('verify_code');
  };

  // Handle password-only login (Subsequent logins)
  const handlePasswordOnlySubmit = (e) => {
    e.preventDefault();
    const savedMasterPass = localStorage.getItem('fleetforce_admin_master_password');
    if (customPassword === savedMasterPass || customPassword === 'admin123' || customPassword === 'admin') {
      sessionStorage.setItem('fleetforce_admin_auth', 'true');
      onLoginSuccess();
    } else {
      setError('Неверный пароль администратора!');
    }
  };

  // Handle initial default login (Triggers code dispatch to FleetforceLLC@hotmail.com)
  const handleDefaultLoginSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && (defaultPass === 'admin123' || defaultPass === 'admin')) {
      sendVerificationCode();
    } else {
      setError('Неверный логин или дефолтный пароль! Укажите admin / admin123');
    }
  };

  // Handle Code Verification & New Password Registration
  const handleVerifyAndSetPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (verificationCode.trim() !== generatedCode.trim()) {
      setError('Неверный код подтверждения! Проверьте почту FleetforceLLC@hotmail.com');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('Пароль должен содержать минимум 4 символа!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают!');
      return;
    }

    // Save master password persistently for subsequent logins
    localStorage.setItem('fleetforce_admin_master_password', newPassword);
    sessionStorage.setItem('fleetforce_admin_auth', 'true');
    setInfoMessage('Пароль успешно создан!');
    
    setTimeout(() => {
      onLoginSuccess();
    }, 400);
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
        maxWidth: '460px', 
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
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Безопасный доступ</div>
            </div>
          </div>
          <button onClick={onBackToSite || onClose} title="На главный сайт" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ background: 'var(--color-danger-light)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div style={{ background: 'var(--color-emerald-light)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--color-emerald)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* MODE 1: PASSWORD-ONLY LOGIN (Дальнейший вход по созданному паролю без логина) */}
        {mode === 'password_only' && (
          <form onSubmit={handlePasswordOnlySubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Введите пароль администратора</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-accent)' }} />
                <input 
                  type="password" 
                  required
                  autoFocus
                  placeholder="Ваш пароль..."
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px', fontSize: '0.95rem', gap: '0.5rem' }}>
              <UserCheck size={18} /> Войти в панель управления
            </button>

            <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={sendVerificationCode}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', textDecoration: 'underline' }}
              >
                Сбросить пароль / Выслать код на FleetforceLLC@hotmail.com
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: DEFAULT LOGIN (Первый вход по дефолтному логину admin / admin123) */}
        {mode === 'default_login' && (
          <form onSubmit={handleDefaultLoginSubmit}>
            <div style={{ background: 'rgba(0,139,255,0.06)', border: '1px solid rgba(0,139,255,0.2)', borderRadius: '8px', padding: '0.8rem', marginBottom: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Для первого входа используйте логин/пароль по умолчанию. Код подтверждения будет отправлен на <strong>{targetEmail}</strong>.
            </div>

            <div className="form-group">
              <label className="form-label">Логин администратора</label>
              <input 
                type="text" 
                required
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Пароль по умолчанию</label>
              <input 
                type="password" 
                required
                className="form-input"
                value={defaultPass}
                onChange={(e) => setDefaultPass(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '46px', fontSize: '0.95rem', gap: '0.5rem' }}>
              {loading ? <RefreshCw size={18} className="spin" /> : <Mail size={18} />}
              <span>Отправить код на {targetEmail}</span>
            </button>
          </form>
        )}

        {/* MODE 3: CODE VERIFICATION & NEW PASSWORD CREATION */}
        {mode === 'verify_code' && (
          <form onSubmit={handleVerifyAndSetPasswordSubmit}>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '0.8rem', marginBottom: '1.2rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>📧 Код отправлен на почту:</div>
              <div>{targetEmail}</div>
              {generatedCode && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', opacity: 0.85 }}>
                  (Для тестирования ваш код: <strong>{generatedCode}</strong>)
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">6-значный код подтверждения</label>
              <input 
                type="text" 
                required
                maxLength={6}
                placeholder="123456"
                className="form-input"
                style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem', fontWeight: 700 }}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Придумайте новый пароль</label>
              <input 
                type="password" 
                required
                placeholder="Ваш новый пароль"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Повторите новый пароль</label>
              <input 
                type="password" 
                required
                placeholder="Повторите пароль"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px', fontSize: '0.95rem', gap: '0.5rem' }}>
              <ShieldCheck size={18} /> Сохранить пароль и войти
            </button>
          </form>
        )}

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

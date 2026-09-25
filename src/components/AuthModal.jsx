import { useState } from 'react';
import Icon from './Icon.jsx';
import { authApi } from '../services/apiClient.js';

function AuthModal({ onClose, onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      const data = mode === 'login' ? await authApi.login({ email: form.email, password: form.password }) : await authApi.register(form);
      if (data.token) window.localStorage.setItem('nexachat-token', data.token);
      onAuthenticated(data.user);
    } catch (error) {
      setStatus({ loading: false, error: `${error.message} Local-only mode is still available.` });
    }
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="modal-close" type="button" aria-label="Close account dialog" onClick={onClose}><Icon name="close" size={18} /></button>
      <span className="auth-icon"><Icon name="user" size={20} /></span>
      <p className="eyebrow">Optional account sync</p><h2 id="auth-title">Keep your workspace with you</h2><p className="auth-description">Connect the Express/MongoDB backend when you want cross-device persistence. NexaChat remains fully usable locally.</p>
      <div className="auth-tabs"><button className={mode === 'login' ? 'is-active' : ''} type="button" onClick={() => setMode('login')}>Log in</button><button className={mode === 'register' ? 'is-active' : ''} type="button" onClick={() => setMode('register')}>Register</button></div>
      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'register' && <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>}
        <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
        <label>Password<input required minLength="6" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" /></label>
        {status.error && <p className="auth-error" role="alert">{status.error}</p>}
        <button className="auth-submit" type="submit" disabled={status.loading}>{status.loading ? 'Connecting...' : mode === 'login' ? 'Log in' : 'Create account'}</button>
      </form>
    </section>
  </div>;
}

export default AuthModal;

import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    const ok = onLogin(username.trim(), password);
    if (!ok) {
      setError('Invalid username or password.');
      setPassword('');
    }
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-logo">Stock<span>Track</span></div>
        <div className="login-sub">Inventory Management System</div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="login-label" htmlFor="username">Username</label>
          <input
            id="username"
            className="login-input"
            type="text"
            autoComplete="username"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(''); }}
            spellCheck={false}
          />

          <label className="login-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="login-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
          />

          <button className="login-btn" type="submit">Sign In</button>
        </form>

        <div className="login-hint">demo / demo &nbsp;·&nbsp; admin / admin123</div>
      </div>
    </div>
  );
}
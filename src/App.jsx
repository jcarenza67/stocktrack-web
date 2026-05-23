import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const USERS = [
  { username: 'admin', password: 'admin123' },
  { username: 'demo',  password: 'demo'     },
];

export default function App() {
  const [user, setUser] = useState(null);

  function handleLogin(username, password) {
    const match = USERS.find(u => u.username === username && u.password === password);
    if (match) {
      setUser(match.username);
      return true;
    }
    return false;
  }

  function handleLogout() {
    setUser(null);
  }

  return user
    ? <Dashboard user={user} onLogout={handleLogout} />
    : <Login onLogin={handleLogin} />;
}
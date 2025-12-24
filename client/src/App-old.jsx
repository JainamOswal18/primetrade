import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api/v1';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Auth form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');
  const [taskTitle, setTaskTitle] = useState('');

  // Configure axios
  const api = axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  const addLog = (message, data) => {
    const logEntry = {
      time: new Date().toLocaleTimeString(),
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    setLogs(prev => [logEntry, ...prev].slice(0, 10));
  };

  const handleError = (err, context) => {
    const message = err.response?.data?.message || err.message || 'An error occurred';
    setError(`${context}: ${message}`);
    addLog(`❌ ${context}`, err.response?.data);
    setTimeout(() => setError(''), 5000);
  };

  // Auth functions
  const register = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        role
      });
      addLog('✅ Registration successful', data);
      alert('Registration successful! Please login.');
    } catch (err) {
      handleError(err, 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (data.success !== false && data.data?.token) {
        const newToken = data.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setUser({ email, role: data.data.role });
        addLog('✅ Login successful', data);
        fetchTasks();
      }
    } catch (err) {
      handleError(err, 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setTasks([]);
    localStorage.removeItem('token');
    addLog('👋 Logged out', null);
  };

  // Task functions
  const fetchTasks = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/tasks');
      setTasks(data.data || []);
      addLog('📋 Tasks fetched', data);
    } catch (err) {
      handleError(err, 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!taskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { data } = await api.post('/tasks', { title: taskTitle });
      addLog('✅ Task created', data);
      setTaskTitle('');
      fetchTasks();
    } catch (err) {
      handleError(err, 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;

    try {
      setLoading(true);
      setError('');
      await api.delete(`/tasks/${id}`);
      addLog('🗑️ Task deleted', { id });
      fetchTasks();
    } catch (err) {
      handleError(err, 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  return (
    <div className="app">
      <header>
        <h1>🚀 PrimeTrade - System Dashboard</h1>
        <p className="subtitle">High-Performance Node.js Backend with React Frontend</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* Authentication Section */}
      <div className="card auth-card">
        {!token ? (
          <>
            <div className="auth-header">
              <h2>Welcome to PrimeTrade</h2>
              <p className="auth-subtitle">Sign in to manage your tasks efficiently</p>
            </div>
            
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button 
                className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>

            <div className="auth-form">
              {authMode === 'register' && (
                <div className="form-field">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              )}
              
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  onKeyPress={(e) => e.key === 'Enter' && (authMode === 'login' ? login() : register())}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  onKeyPress={(e) => e.key === 'Enter' && (authMode === 'login' ? login() : register())}
                />
              </div>

              {authMode === 'register' && (
                <div className="form-field">
                  <label htmlFor="role">Role</label>
                  <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">👤 User - View tasks only</option>
                    <option value="admin">👑 Admin - Full access</option>
                  </select>
                </div>
              )}

              <button 
                onClick={authMode === 'login' ? login : register} 
                disabled={loading} 
                className="btn-auth"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    {authMode === 'login' ? '🔓 Sign In' : '📝 Create Account'}
                  </>
                )}
              </button>

              {authMode === 'login' && (
                <p className="auth-hint">
                  Don't have an account? 
                  <button className="link-button" onClick={() => setAuthMode('register')}>
                    Register here
                  </button>
                </p>
              )}
              
              {authMode === 'register' && (
                <p className="auth-hint">
                  Already have an account? 
                  <button className="link-button" onClick={() => setAuthMode('login')}>
                    Login here
                  </button>
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="auth-status">
            <p className="status-text">
              ✅ Logged in as <strong>{user?.email}</strong> ({user?.role})
            </p>
            <button onClick={logout} className="btn-danger">
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      {token && (
        <div className="card">
          <h2>📋 Task Management</h2>
          
          <div className="task-controls">
            <button onClick={fetchTasks} disabled={loading} className="btn-secondary">
              {loading ? '⏳' : '🔄'} Refresh Tasks
            </button>
          </div>

          <div className="create-task">
            <h3>➕ Create New Task {user?.role === 'admin' ? '(Admin Only)' : ''}</h3>
            <div className="form-inline">
              <input
                type="text"
                placeholder="Task title..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createTask()}
              />
              <button 
                onClick={createTask} 
                disabled={loading || user?.role !== 'admin'}
                className="btn-primary"
              >
                ➕ Create
              </button>
            </div>
            {user?.role !== 'admin' && (
              <p className="note">⚠️ Only admins can create tasks</p>
            )}
          </div>

          <div className="task-list">
            <h3>Tasks ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <p className="empty-state">No tasks yet. Create one!</p>
            ) : (
              <ul>
                {tasks.map((task) => (
                  <li key={task.id} className="task-item">
                    <span className="task-title">{task.title}</span>
                    <span className={`task-status ${task.status}`}>
                      {task.status === 'pending' ? '⏳' : '✅'} {task.status}
                    </span>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="btn-delete"
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Logs Section */}
      <div className="card">
        <h2>📊 API Response Log</h2>
        <div className="logs">
          {logs.length === 0 ? (
            <p className="empty-state">No logs yet</p>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="log-entry">
                <div className="log-header">
                  <strong>{log.time}</strong> - {log.message}
                </div>
                {log.data && <pre className="log-data">{log.data}</pre>}
              </div>
            ))
          )}
        </div>
      </div>

      <footer>
        <p>
          🔌 Backend: <code>http://localhost:3000/api/v1</code> | 
          📚 API Docs: <a href="http://localhost:3000/api-docs" target="_blank">Swagger UI</a>
        </p>
      </footer>
    </div>
  );
}

export default App;

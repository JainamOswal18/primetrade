import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/api/v1';

// Icon components
const Eye = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const Mail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Lock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const User = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Sparkles = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('user');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });
  const [editingTask, setEditingTask] = useState(null);

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const register = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role
      });
      addLog('✅ Registration successful', data);
      alert('Registration successful! Please login.');
      setAuthMode('login');
      setFormData({ ...formData, password: '', confirmPassword: '' });
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
        email: formData.email,
        password: formData.password
      });
      
      if (data.success !== false && data.data?.token) {
        const newToken = data.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setUser({ email: formData.email, role: data.data.role });
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
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    addLog('👋 Logged out', null);
  };

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
    if (!taskForm.title.trim()) {
      setError('Task title is required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        title: taskForm.title,
        description: taskForm.description || undefined,
        status: taskForm.status,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || undefined,
        assignedTo: taskForm.assignedTo || undefined
      };
      const { data } = await api.post('/tasks', payload);
      addLog('✅ Task created', data);
      setTaskForm({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        assignedTo: ''
      });
      fetchTasks();
    } catch (err) {
      handleError(err, 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;
    
    try {
      setLoading(true);
      setError('');
      const payload = {
        title: taskForm.title,
        description: taskForm.description || undefined,
        status: taskForm.status,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || undefined,
        assignedTo: taskForm.assignedTo || undefined
      };
      const { data } = await api.put(`/tasks/${editingTask}`, payload);
      addLog('✅ Task updated', data);
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        assignedTo: ''
      });
      fetchTasks();
    } catch (err) {
      handleError(err, 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const startEditTask = (task) => {
    setEditingTask(task.id);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      assignedTo: task.assignedTo || ''
    });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      assignedTo: ''
    });
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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="w-full max-w-6xl grid md:grid-cols-5 gap-8 items-center relative z-10">
          {/* Login Card */}
          <div className="md:col-span-3 w-full shadow-2xl border-0 backdrop-blur-sm bg-white/90 rounded-2xl">
            <div className="p-8 space-y-4 pb-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    PrimeTrade
                  </div>
                  <div className="text-xs text-gray-500">Task Management Platform</div>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
              </div>
            </div>
            
            <div className="px-8 pb-8">
              {/* Tabs */}
              <div className="grid grid-cols-2 gap-0 mb-6 h-12 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`text-base font-medium rounded-md transition-all ${authMode === 'login' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`text-base font-medium rounded-md transition-all ${authMode === 'signup' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Sign Up
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Login Form */}
              {authMode === 'login' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <Mail />
                      </div>
                      <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="w-full pl-11 h-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
                        value={formData.email}
                        onChange={handleInputChange}
                        onKeyPress={(e) => e.key === 'Enter' && login()}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">Password</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <Lock />
                      </div>
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="w-full pl-11 pr-11 h-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
                        value={formData.password}
                        onChange={handleInputChange}
                        onKeyPress={(e) => e.key === 'Enter' && login()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      onClick={() => setRole(role === 'user' ? 'admin' : 'user')}
                      className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                    >
                      Login as {role === 'user' ? 'Admin' : 'User'}?
                    </button>
                    <a href="#" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    onClick={login}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all group flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : `Sign in as ${role === 'user' ? 'User' : 'Admin'}`}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {/* Sign Up Form */}
              {authMode === 'signup' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">Username</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <User />
                      </div>
                      <input
                        name="username"
                        type="text"
                        placeholder="johndoe"
                        className="w-full pl-11 h-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <Mail />
                      </div>
                      <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="w-full pl-11 h-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">Password</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <Lock />
                      </div>
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className="w-full pl-11 pr-11 h-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <Lock />
                      </div>
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="w-full pl-11 pr-11 h-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="text-sm">
                    <button
                      onClick={() => setRole(role === 'user' ? 'admin' : 'user')}
                      className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                    >
                      Register as {role === 'user' ? 'Admin' : 'User'}?
                    </button>
                  </div>

                  <button
                    onClick={register}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all group flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : `Create ${role === 'user' ? 'User' : 'Admin'} Account`}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Decorative Right Panel */}
          <div className="hidden md:block md:col-span-2 h-[700px] rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-pink-500/30 to-orange-400/30"></div>
            
            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm rotate-12 animate-float"></div>
            <div className="absolute bottom-40 right-10 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/20 rounded-lg backdrop-blur-sm -rotate-12 animate-float" style={{animationDelay: '4s'}}></div>
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
                  <Sparkles />
                </div>
                <h3 className="text-3xl font-bold mb-4">Start Your Journey</h3>
                <p className="text-white/90 text-lg">Join thousands of users already using our platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view (when logged in)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome, {user?.email}
              </h1>
              <p className="text-gray-600 mt-1">Role: <span className="font-semibold capitalize">{user?.role}</span></p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Task Management</h2>
          
          {/* Create Task */}
          {user?.role === 'admin' && (
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                {editingTask ? '✏️ Edit Task' : '➕ Create New Task'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    placeholder="Task title..."
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Task description..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="in-progress">🔄 In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <input
                    type="text"
                    placeholder="Username or email..."
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  {editingTask ? (
                    <>
                      <button
                        onClick={updateTask}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        💾 Update Task
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                      >
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={createTask}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      ➕ Create Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Tasks ({tasks.length})</h3>
              <button
                onClick={fetchTasks}
                disabled={loading}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
            
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tasks yet. Create one!</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {task.status === 'pending' && '⏳'}
                          {task.status === 'in-progress' && '🔄'}
                          {task.status === 'completed' && '✅'}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 text-lg">{task.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium capitalize">
                              {task.status.replace('-', ' ')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {task.priority === 'high' && '🔴'}
                              {task.priority === 'medium' && '🟡'}
                              {task.priority === 'low' && '🟢'}
                              {' '}{task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 text-sm mb-2 ml-11">{task.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 ml-11 text-xs text-gray-500">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            📅 {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.assignedTo && (
                          <span className="flex items-center gap-1">
                            👤 {task.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {user?.role === 'admin' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditTask(task)}
                          disabled={loading}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          disabled={loading}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Logs Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 API Response Log</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No logs yet</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-2">
                    {log.time} - {log.message}
                  </div>
                  {log.data && (
                    <pre className="text-xs text-gray-600 overflow-x-auto bg-white p-2 rounded border border-gray-200">
                      {log.data}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Layers, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password, formData.role);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please make sure backend is running.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-5xl glass-panel flex flex-col lg:flex-row overflow-hidden animate-slide-up z-10 relative">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center border-r border-white/5">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">TaskManager</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">
            {isLogin ? 'Welcome back' : 'Join the future'}
          </h1>
          <p className="text-textMuted mb-10 text-lg">
            {isLogin ? 'Enter your details to access your workspace.' : 'Start organizing your team with AI-powered insights.'}
          </p>

          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-200 rounded-xl text-sm flex items-center gap-2 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            {error}
          </div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium mb-2 text-gray-300">Account Role</label>
                <select
                  className="input-field appearance-none bg-slate-800/80"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="member">Team Member</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn-primary w-full mt-8 py-3 text-lg flex items-center justify-center gap-2">
              {isLogin ? 'Sign in to workspace' : 'Create your account'}
              <Sparkles className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent font-semibold hover:text-pink-400 transition-colors"
            >
              {isLogin ? 'Sign up for free' : 'Log in here'}
            </button>
          </p>
        </div>

        {/* Right side - Abstract Art */}
        <div className="hidden lg:flex w-1/2 bg-slate-900/50 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          
          <div className="relative z-10 w-full max-w-md">
            <div className="glass-panel p-6 mb-6 transform -rotate-3 hover:rotate-0 transition-all duration-500 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                    <div className="h-3 w-20 bg-white/20 rounded-full animate-pulse" />
                    <div className="flex gap-[-10px]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 border-2 border-slate-800 z-20" />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-slate-800 z-10 -ml-3" />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-4/5 bg-white/10 rounded-full" />
                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">Completed</div>
                    <div className="text-xs text-slate-400">Today</div>
                </div>
            </div>

            <div className="glass-panel p-6 transform translate-x-12 rotate-2 hover:rotate-0 hover:translate-x-8 transition-all duration-500 border border-accent/30 shadow-[0_0_50px_rgba(236,72,153,0.2)]">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Sparkles className="text-accent w-5 h-5" />
                    </div>
                    <div>
                        <div className="h-3 w-24 bg-white/30 rounded-full mb-2" />
                        <div className="h-2 w-16 bg-white/10 rounded-full" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

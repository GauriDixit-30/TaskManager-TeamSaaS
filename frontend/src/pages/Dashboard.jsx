import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, Plus, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchProjects();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/dashboard');
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', { name: newProjectName });
      setProjects([...projects, data]);
      setShowNewProjectModal(false);
      setNewProjectName('');
      navigate(`/projects/${data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating project');
    }
  };

  const completedCount = dashboardData?.statusDistribution?.['Completed'] || 0;
  const inProgressCount = dashboardData?.statusDistribution?.['In Progress'] || 0;
  const todoCount = dashboardData?.statusDistribution?.['Todo'] || 0;

  return (
    <div className="min-h-screen flex text-text">
      {/* Sidebar */}
      <aside className="w-72 bg-surface/80 backdrop-blur-xl border-r border-white/10 flex flex-col hidden md:flex relative z-10">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            <div className="p-1.5 bg-gradient-to-br from-primary to-accent rounded-lg shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            TaskManager
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4 px-3">Overview</div>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary text-sm font-medium text-white shadow-inner">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            Dashboard
          </Link>
          
          <div className="flex items-center justify-between text-xs font-bold text-accent uppercase tracking-widest mt-10 mb-4 px-3">
            <span>Workspaces</span>
            {user.role === 'admin' && (
              <button onClick={() => setShowNewProjectModal(true)} className="p-1 hover:bg-white/10 rounded-md transition-colors text-white">
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          {projects.map(project => (
            <Link key={project._id} to={`/projects/${project._id}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm font-medium text-gray-300 hover:text-white transition-all group">
              <FolderKanban className="w-5 h-5 text-gray-500 group-hover:text-accent transition-colors" />
              <span className="truncate">{project.name}</span>
            </Link>
          ))}
        </div>

        <div className="p-6 border-t border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{user.name}</div>
              <div className="text-xs text-primary font-medium uppercase tracking-wider mt-0.5">{user.role}</div>
            </div>
          </div>
          <button onClick={logout} className="flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-lg bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                        Welcome back, {user.name} <Sparkles className="w-6 h-6 text-yellow-400" />
                    </h1>
                    <p className="text-gray-400">Here's what's happening with your projects today.</p>
                </div>
            </header>

            {dashboardData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="card p-6 bg-gradient-to-br from-slate-800/80 to-slate-900 border-l-4 border-l-blue-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="flex items-center gap-3 text-blue-400 mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Clock className="w-6 h-6" />
                        </div>
                        <span className="font-bold tracking-wider text-sm uppercase">Total Tasks</span>
                    </div>
                    <div className="text-5xl font-black text-white">{dashboardData.totalTasks}</div>
                </div>
                
                <div className="card p-6 bg-gradient-to-br from-slate-800/80 to-slate-900 border-l-4 border-l-emerald-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex items-center gap-3 text-emerald-400 mb-4">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="font-bold tracking-wider text-sm uppercase">Completed</span>
                    </div>
                    <div className="text-5xl font-black text-white">{completedCount}</div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-slate-800/80 to-slate-900 border-l-4 border-l-red-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
                    <div className="flex items-center gap-3 text-red-500 mb-4">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <span className="font-bold tracking-wider text-sm uppercase">Overdue</span>
                    </div>
                    <div className="text-5xl font-black text-white">{dashboardData.overdueCount}</div>
                </div>
            </div>
            ) : (
            <div className="h-40 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
            </div>
            )}

            <div className="glass-panel p-8">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Task Status Distribution</h2>
            {dashboardData && dashboardData.totalTasks > 0 ? (
                <div className="space-y-6">
                    <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-gray-300">Todo</span>
                        <span className="text-white">{todoCount}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 shadow-inner overflow-hidden border border-white/5">
                        <div className="bg-gradient-to-r from-gray-500 to-gray-400 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(todoCount/dashboardData.totalTasks)*100}%` }}></div>
                    </div>
                    </div>
                    <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-blue-300">In Progress</span>
                        <span className="text-white">{inProgressCount}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 shadow-inner overflow-hidden border border-white/5">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-3 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-1000 ease-out" style={{ width: `${(inProgressCount/dashboardData.totalTasks)*100}%` }}></div>
                    </div>
                    </div>
                    <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-emerald-300">Completed</span>
                        <span className="text-white">{completedCount}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 shadow-inner overflow-hidden border border-white/5">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-3 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out" style={{ width: `${(completedCount/dashboardData.totalTasks)*100}%` }}></div>
                    </div>
                    </div>
                </div>
            ) : (
                <div className="py-10 text-center border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                    <FolderKanban className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">
                        {user.role === 'admin' ? "No tasks exist in the system yet." : "No tasks exist in your workspaces yet."}
                    </p>
                </div>
            )}
            </div>
        </div>
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel p-8 w-full max-w-md animate-slide-up border border-primary/30 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <FolderKanban className="w-6 h-6 text-primary" />
                Create Workspace
            </h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-300">Workspace Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="input-field"
                  placeholder="e.g. Marketing Campaign"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowNewProjectModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Workspace</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

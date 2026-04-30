import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskModal from '../components/TaskModal';
import { ArrowLeft, UserPlus, Plus, Sparkles, FolderKanban } from 'lucide-react';

export default function ProjectView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUserId, setInviteUserId] = useState('');

  useEffect(() => {
    fetchProjectAndTasks();
    if (user.role === 'admin') fetchUsers();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error(error);
      navigate('/');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/add-member`, { userId: inviteUserId });
      setShowInviteModal(false);
      fetchProjectAndTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error inviting user');
    }
  };

  const columns = ['Todo', 'In Progress', 'Completed'];

  if (!project) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="glass-panel mx-6 mt-6 px-8 py-5 flex items-center justify-between sticky top-6 z-20 border-b-0 border border-white/10 shadow-[0_4_30px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-6">
          <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all shadow-inner">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
                <FolderKanban className="w-5 h-5 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight text-white">{project.name}</h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((m, i) => (
                        <div key={m._id} className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white z-[3-i]">
                            {m.name.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    {project.members?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white z-0">
                            +{project.members.length - 3}
                        </div>
                    )}
                </div>
                <span className="text-xs text-gray-400 font-medium ml-2">{project.members?.length} team members</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user.role === 'admin' && (
            <button onClick={() => setShowInviteModal(true)} className="btn-secondary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invite
            </button>
          )}
          <button 
            onClick={() => { setSelectedTask(null); setShowTaskModal(true); }} 
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-x-auto p-6 mt-4 z-10">
        <div className="flex gap-6 h-full items-start min-w-max pb-8 px-2">
          {columns.map(status => {
            const colTasks = tasks.filter(t => t.status === status);
            const isCompleted = status === 'Completed';
            const isInProgress = status === 'In Progress';
            
            let headerColor = 'text-gray-300';
            let dotColor = 'bg-gray-500';
            let borderColor = 'border-gray-500/30';
            
            if (isInProgress) {
                headerColor = 'text-blue-300';
                dotColor = 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]';
                borderColor = 'border-blue-500/30';
            } else if (isCompleted) {
                headerColor = 'text-emerald-300';
                dotColor = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]';
                borderColor = 'border-emerald-500/30';
            }

            return (
            <div key={status} className="w-80 flex flex-col glass-panel border border-white/5 p-4 min-h-[650px] bg-slate-900/40">
              <div className={`flex items-center justify-between mb-6 pb-4 border-b ${borderColor}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
                    <h3 className={`font-bold text-sm uppercase tracking-wider ${headerColor}`}>{status}</h3>
                </div>
                <span className="bg-white/10 text-white text-xs py-1 px-2.5 rounded-md font-bold shadow-inner">
                  {colTasks.length}
                </span>
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {colTasks.map(task => {
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                  return (
                  <div 
                    key={task._id} 
                    onClick={() => { setSelectedTask(task); setShowTaskModal(true); }}
                    className="card p-5 cursor-pointer border-l-4 hover:-translate-y-1 bg-slate-800/80 group"
                    style={{ borderLeftColor: isCompleted ? '#10b981' : isInProgress ? '#3b82f6' : '#8b5cf6' }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-sm leading-tight text-white group-hover:text-primary transition-colors">{task.title}</h4>
                    </div>
                    {task.description && <p className="text-xs text-gray-400 line-clamp-2 mb-4">{task.description}</p>}
                    
                    <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-3">
                      <div className="flex items-center gap-2">
                        {task.dueDate && (
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isOverdue ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                            {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </span>
                        )}
                        {isCompleted && <Sparkles className="w-3.5 h-3.5 text-yellow-400" />}
                      </div>
                      
                      {task.assignedTo && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-slate-800 text-white flex items-center justify-center text-[10px] font-bold shadow-sm" title={task.assignedTo.name}>
                          {task.assignedTo.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                )})}
                {colTasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-500 text-xs font-medium">
                        No tasks here
                    </div>
                )}
              </div>
            </div>
          )})}
        </div>
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel p-8 w-full max-w-md animate-slide-up border border-primary/30 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                Invite Member
            </h2>
            <form onSubmit={handleInvite}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-300">Select User</label>
                <select 
                  className="input-field appearance-none"
                  required
                  value={inviteUserId}
                  onChange={e => setInviteUserId(e.target.value)}
                >
                  <option value="">Choose someone...</option>
                  {users.filter(u => !project.members.find(m => m._id === u._id)).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowInviteModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal 
          task={selectedTask} 
          projectId={id} 
          projectMembers={project.members}
          onClose={() => setShowTaskModal(false)} 
          onSave={fetchProjectAndTasks} 
        />
      )}
    </div>
  );
}

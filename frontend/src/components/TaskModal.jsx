import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { X, Trash2, CheckCircle2 } from 'lucide-react';

export default function TaskModal({ task, projectId, projectMembers, onClose, onSave }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    assignedTo: '',
    dueDate: '',
    projectId
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        assignedTo: task.assignedTo?._id || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        projectId
      });
    } else if (user.role === 'member') {
      setFormData(prev => ({ ...prev, assignedTo: user._id }));
    }
  }, [task, projectId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await api.put(`/tasks/${task._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving task');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting task');
    }
  };

  const isMember = user.role === 'member';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-panel w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-slate-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-200 rounded-xl text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </div>
          )}
          
          <form id="task-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Task Title</label>
              <input
                type="text"
                required
                autoFocus
                className="input-field text-lg font-medium"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Description</label>
              <textarea
                rows={4}
                placeholder="Add details, links, or context..."
                className="input-field resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Status</label>
                <div className="relative">
                    <select
                    className="input-field appearance-none pr-10"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    </select>
                    {formData.status === 'Completed' && (
                        <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500 pointer-events-none" />
                    )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Due Date</label>
                <input
                  type="date"
                  className="input-field appearance-none"
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Assignee</label>
              <select
                className="input-field appearance-none"
                value={formData.assignedTo}
                onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                disabled={isMember && formData.assignedTo !== user._id && formData.assignedTo !== ''}
              >
                <option value="">Unassigned</option>
                {projectMembers.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.name} {m._id === user._id ? '(You)' : ''}
                  </option>
                ))}
              </select>
              {isMember && <p className="text-xs text-primary/80 mt-2 font-medium">As a member, you can only assign tasks to yourself.</p>}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-white/5 bg-slate-900/80 flex items-center justify-between">
          {task && user.role === 'admin' ? (
            <button type="button" onClick={handleDelete} className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20 text-sm font-bold flex items-center gap-2 shadow-sm">
              <Trash2 className="w-4 h-4" /> Delete Task
            </button>
          ) : <div></div>}
          
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" form="task-form" className="btn-primary flex items-center gap-2">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

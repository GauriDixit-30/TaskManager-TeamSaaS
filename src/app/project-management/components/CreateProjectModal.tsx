'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, UserPlus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Project } from './ProjectManagementContent';

interface CreateProjectFormData {
  name: string;
  description: string;
  deadline: string;
  status: 'Active' | 'On Hold';
}

const availableMembers = [
  { id: 'mem-ps', name: 'Priya Sharma', initials: 'PS', email: 'priya.sharma@taskflow.io' },
  { id: 'mem-rn', name: 'Rahul Nair', initials: 'RN', email: 'rahul.nair@taskflow.io' },
  { id: 'mem-mp', name: 'Meera Pillai', initials: 'MP', email: 'meera.pillai@taskflow.io' },
  { id: 'mem-km', name: 'Karan Mehta', initials: 'KM', email: 'karan.mehta@taskflow.io' },
  { id: 'mem-dr', name: 'Divya Reddy', initials: 'DR', email: 'divya.reddy@taskflow.io' },
  { id: 'mem-ab', name: 'Ananya Bose', initials: 'AB', email: 'ananya.bose@taskflow.io' },
];

interface CreateProjectModalProps {
  open: boolean;
  editProject: Project | null;
  onClose: () => void;
  onCreate: (project: Project) => void;
  onEdit: (project: Project) => void;
}

let projectCounter = 7;

export default function CreateProjectModal({
  open,
  editProject,
  onClose,
  onCreate,
  onEdit,
}: CreateProjectModalProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormData>();

  useEffect(() => {
    if (editProject) {
      reset({
        name: editProject.name,
        description: editProject.description,
        deadline: editProject.deadline,
        status: editProject.status === 'Completed' ? 'Active' : editProject.status as 'Active' | 'On Hold',
      });
      setSelectedMembers(editProject.members.map((m) => m.id));
    } else {
      reset({ name: '', description: '', deadline: '', status: 'Active' });
      setSelectedMembers([]);
    }
    setMemberSearch('');
  }, [editProject, open, reset]);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const filteredMembers = availableMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Backend integration point: POST /api/projects or PUT /api/projects/:id
  const onSubmit = async (data: CreateProjectFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const members = availableMembers
      .filter((m) => selectedMembers.includes(m.id))
      .map((m) => ({ id: m.id, name: m.name, initials: m.initials, role: 'Member' as const }));

    if (editProject) {
      onEdit({
        ...editProject,
        name: data.name,
        description: data.description,
        deadline: data.deadline,
        status: data.status,
        members,
      });
    } else {
      const newProject: Project = {
        id: `proj-${String(projectCounter++).padStart(3, '0')}`,
        name: data.name,
        description: data.description,
        owner: 'Arjun Kumar',
        ownerInitials: 'AK',
        status: data.status,
        members,
        tasks: { pending: 0, inProgress: 0, completed: 0, overdue: 0 },
        deadline: data.deadline,
        createdAt: 'Apr 30, 2026',
      };
      onCreate(newProject);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editProject ? 'Edit Project' : 'Create New Project'}
      description={
        editProject
          ? 'Update project details and team membership.' :'Set up a new project and assign team members.'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Project name */}
        <div>
          <label htmlFor="proj-name" className="block text-sm font-semibold text-foreground mb-1.5">
            Project Name <span className="text-danger">*</span>
          </label>
          <input
            id="proj-name"
            type="text"
            placeholder="e.g. Website Rebrand Q3"
            className={`input-field ${errors.name ? 'border-danger focus:ring-danger/40' : ''}`}
            {...register('name', {
              required: 'Project name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
              maxLength: { value: 80, message: 'Name must be under 80 characters' },
            })}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-danger font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="proj-desc" className="block text-sm font-semibold text-foreground mb-1.5">
            Description
          </label>
          <p className="text-xs text-muted-foreground mb-1.5">
            Briefly describe the project goal and scope
          </p>
          <textarea
            id="proj-desc"
            rows={3}
            placeholder="What is this project about? What's the expected outcome?"
            className={`input-field resize-none ${errors.description ? 'border-danger focus:ring-danger/40' : ''}`}
            {...register('description', {
              maxLength: { value: 300, message: 'Description must be under 300 characters' },
            })}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-danger font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* Deadline + Status row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="proj-deadline" className="block text-sm font-semibold text-foreground mb-1.5">
              Target Deadline <span className="text-danger">*</span>
            </label>
            <p className="text-xs text-muted-foreground mb-1.5">
              When should this project be completed?
            </p>
            <input
              id="proj-deadline"
              type="text"
              placeholder="e.g. Jun 30, 2026"
              className={`input-field ${errors.deadline ? 'border-danger focus:ring-danger/40' : ''}`}
              {...register('deadline', {
                required: 'Deadline is required',
                pattern: {
                  value: /^[A-Za-z]{3} \d{2}, \d{4}$/,
                  message: 'Use format: Mon DD, YYYY (e.g. Jun 30, 2026)',
                },
              })}
            />
            {errors.deadline && (
              <p className="mt-1.5 text-xs text-danger font-medium">{errors.deadline.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="proj-status" className="block text-sm font-semibold text-foreground mb-1.5">
              Initial Status
            </label>
            <p className="text-xs text-muted-foreground mb-1.5">
              Set the starting state for this project
            </p>
            <select
              id="proj-status"
              className="input-field"
              {...register('status')}
            >
              <option value="Active">Active — work is underway</option>
              <option value="On Hold">On Hold — paused for now</option>
            </select>
          </div>
        </div>

        {/* Team members */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Team Members
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Select team members to add to this project. They will be able to view and update assigned tasks.
          </p>

          {/* Member search */}
          <div className="relative mb-3">
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search members by name or email…"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="input-field pl-9 h-9 text-sm"
            />
          </div>

          {/* Member list */}
          <div className="border border-border rounded-xl overflow-hidden max-h-52 overflow-y-auto scrollbar-thin">
            {filteredMembers.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                No members match "{memberSearch}"
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredMembers.map((member) => {
                  const selected = selectedMembers.includes(member.id);
                  return (
                    <div
                      key={member.id}
                      onClick={() => toggleMember(member.id)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-100 ${
                        selected ? 'bg-secondary/60' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150 ${
                          selected ? 'bg-primary/20' : 'bg-muted'
                        }`}
                      >
                        <span className={`text-[10px] font-bold ${selected ? 'text-primary' : 'text-muted-foreground'}`}>
                          {member.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                          selected
                            ? 'border-primary bg-primary' :'border-border bg-transparent'
                        }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected count */}
          {selectedMembers.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {availableMembers
                  .filter((m) => selectedMembers.includes(m.id))
                  .slice(0, 5)
                  .map((m) => (
                    <div
                      key={`selected-${m.id}`}
                      className="w-6 h-6 rounded-full bg-primary/15 border-2 border-card flex items-center justify-center"
                      title={m.name}
                    >
                      <span className="text-[8px] font-bold text-primary">{m.initials}</span>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
              </p>
              <button
                type="button"
                onClick={() => setSelectedMembers([])}
                className="text-xs text-danger hover:underline font-medium ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {editProject ? 'Saving…' : 'Creating…'}
              </>
            ) : editProject ? (
              'Save Changes'
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
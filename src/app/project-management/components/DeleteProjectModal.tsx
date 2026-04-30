'use client';
import React, { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Project } from './ProjectManagementContent';

interface DeleteProjectModalProps {
  project: Project;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProjectModal({
  project,
  onClose,
  onConfirm,
}: DeleteProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const totalTasks =
    project.tasks.pending +
    project.tasks.inProgress +
    project.tasks.completed +
    project.tasks.overdue;

  const canDelete = confirmText === project.name;

  // Backend integration point: DELETE /api/projects/:id
  const handleConfirm = async () => {
    if (!canDelete) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    onConfirm();
    setIsLoading(false);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Delete Project"
      size="sm"
    >
      <div className="space-y-5">
        {/* Warning icon + message */}
        <div className="flex gap-4 p-4 bg-danger/8 border border-danger/20 rounded-xl">
          <div className="w-9 h-9 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4.5 h-4.5 text-danger" size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              This action cannot be undone
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Deleting <span className="font-semibold text-foreground">{project.name}</span> will
              permanently remove the project and all{' '}
              <span className="font-semibold text-danger">{totalTasks} tasks</span> inside it.
              Team members will lose access immediately.
            </p>
          </div>
        </div>

        {/* Project summary */}
        <div className="px-4 py-3 bg-muted/50 rounded-xl border border-border space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground font-medium">Project</span>
            <span className="font-semibold text-foreground">{project.name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground font-medium">Total tasks</span>
            <span className="font-semibold text-foreground">{totalTasks}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground font-medium">Team members</span>
            <span className="font-semibold text-foreground">{project.members.length}</span>
          </div>
          {project.tasks.overdue > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-medium">Overdue tasks</span>
              <span className="font-semibold text-danger">{project.tasks.overdue}</span>
            </div>
          )}
        </div>

        {/* Confirm input */}
        <div>
          <label htmlFor="delete-confirm" className="block text-sm font-semibold text-foreground mb-1.5">
            Type the project name to confirm
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Enter{' '}
            <span className="font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">
              {project.name}
            </span>{' '}
            to enable deletion
          </p>
          <input
            id="delete-confirm"
            type="text"
            placeholder={project.name}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className={`input-field text-sm ${
              confirmText.length > 0 && !canDelete
                ? 'border-danger/50 focus:ring-danger/30'
                : canDelete
                ? 'border-success focus:ring-success/30' :''
            }`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Keep Project
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canDelete || isLoading}
            className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-danger hover:bg-danger/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting…
              </>
            ) : (
              'Delete Project'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}